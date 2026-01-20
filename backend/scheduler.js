import cron from "node-cron";
import { bot, parser } from "./bot.js";
import prisma from "./db.js"; // PrismaClient instance

export function startScheduler() {
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏰ Scheduler triggered: checking feeds...");

    try {
      // Fetch all feeds from DB
      const allFeeds = await prisma.feed.findMany();

      // Group feeds by user
      const feedsByUser = allFeeds.reduce((acc, feed) => {
        const uid = feed.userId.toString();
        if (!acc[uid]) acc[uid] = [];
        acc[uid].push(feed.url);
        return acc;
      }, {});

      // Iterate over users and their feeds
      for (const [chatId, urls] of Object.entries(feedsByUser)) {
        for (const rssUrl of urls) {
          try {
            const feed = await parser.parseURL(rssUrl);

            // Limit to 5 most recent items
            for (const item of feed.items.slice(0, 5)) {
              const jobId = item.link;

              // Check if job already seen
              const seen = await prisma.seenJob.findFirst({
                where: { userId: BigInt(chatId), jobUrl: jobId },
              });

              if (!seen) {
                // Mark job as seen
                await prisma.seenJob.create({
                  data: { userId: BigInt(chatId), jobUrl: jobId },
                });

                // Send job notification
                await bot.telegram.sendMessage(
                  chatId,
                  `🆕 <b>${item.title}</b>\n${item.link}`,
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
