import cron from "node-cron";
import { bot, parser } from "./bot.js";
import prisma from "./db.js";

function formatRelativeTime(pubDate) {
  if (!pubDate) return "Just posted";

  const diffMs = Date.now() - new Date(pubDate).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}

export function startScheduler() {
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏰ Scheduler triggered: checking feeds...");

    try {
      const allFeeds = await prisma.feed.findMany();

      const feedsByUser = allFeeds.reduce((acc, feed) => {
        const uid = feed.userId.toString();
        if (!acc[uid]) acc[uid] = [];
        acc[uid].push(feed.url);
        return acc;
      }, {});

      for (const [chatId, urls] of Object.entries(feedsByUser)) {
        for (const rssUrl of urls) {
          try {
            const feed = await parser.parseURL(rssUrl);

            for (const item of feed.items.slice(0, 5)) {
              const jobId = item.link;
              const seen = await prisma.seenJob.findFirst({
                where: { userId: BigInt(chatId), jobUrl: jobId },
              });

              if (!seen) {
                await prisma.seenJob.create({
                  data: { userId: BigInt(chatId), jobUrl: jobId },
                });

                const postedTime = formatRelativeTime(item.pubDate);

                const description = item.description
                  ? item.description.slice(0, 300) +
                    (item.description.length > 300 ? "..." : "")
                  : "No description provided.";

                await bot.telegram.sendMessage(
                  chatId,
                  `🆕 <b>${item.title}</b>\n🕒 Posted: ${postedTime}\n\n${description}\n\n🔗 ${item.link}`,
                  { parse_mode: "HTML" }
                );
              }
            }
          } catch (err) {
            console.error("❌ Error fetching feed:", rssUrl, err.message);
            await bot.telegram.sendMessage(
              chatId,
              `⚠️ Failed to fetch feed: ${rssUrl}`
            );
          }
        }
      }
    } catch (err) {
      console.error("❌ Scheduler error:", err.message);
    }
  });
}
