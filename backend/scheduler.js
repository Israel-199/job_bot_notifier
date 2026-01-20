import cron from "node-cron";
import { bot, parser } from "./bot.js";
import prisma from "./db.js";

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

                const postedTime = item.pubDate
                  ? new Date(item.pubDate).toLocaleString("en-US", {
                      timeZone: "UTC",
                      hour12: false,
                    })
                  : "Unknown";

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
