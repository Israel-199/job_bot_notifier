import cron from "node-cron";
import { bot, parser, feeds, updateFeeds } from "./bot.js";

export function startScheduler() {
  cron.schedule("*/5 * * * *", async () => {
    for (const chatId of Object.keys(feeds)) {
      for (const rssUrl of feeds[chatId].urls) {
        try {
          const feed = await parser.parseURL(rssUrl);
          feed.items.forEach(item => {
            const jobId = item.link;
            if (!feeds[chatId].seen[jobId]) {
              feeds[chatId].seen[jobId] = true;
              bot.telegram.sendMessage(chatId, `🆕 New Job: ${item.title}\n${item.link}`);
            }
          });
          updateFeeds(feeds);
        } catch (err) {
          console.error("Error fetching feed:", rssUrl, err.message);
        }
      }
    }
  });
}
