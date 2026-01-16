// scheduler.js
import cron from "node-cron";
import { bot, parser, feeds, updateFeeds } from "./bot.js";

export function startScheduler() {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏰ Scheduler triggered: checking feeds...");

    for (const chatId of Object.keys(feeds)) {
      for (const rssUrl of feeds[chatId].urls) {
        try {
          const feed = await parser.parseURL(rssUrl);

          // Limit to the latest 5 items per run
          feed.items.slice(0, 5).forEach(item => {
            const jobId = item.link;

            if (!feeds[chatId].seen[jobId]) {
              feeds[chatId].seen[jobId] = true;

              bot.telegram.sendMessage(
                chatId,
                `🆕 <b>${item.title}</b>\n${item.link}`,
                { parse_mode: "HTML" }
              );
            }
          });

          // Persist updated feeds state
          updateFeeds(feeds);

        } catch (err) {
          console.error("❌ Error fetching feed:", rssUrl, err.message);

          // Optional: notify user if a feed consistently fails
          bot.telegram.sendMessage(
            chatId,
            `⚠️ Failed to fetch feed: ${rssUrl}`
          );
        }
      }
    }
  });
}
