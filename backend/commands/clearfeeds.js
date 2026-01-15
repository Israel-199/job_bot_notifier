import { feeds, updateFeeds } from "../bot.js";

export default function clearfeedsCommand(bot) {
  bot.command("clearfeeds", (ctx) => {
    const chatId = ctx.chat.id;
    feeds[chatId] = { urls: [], seen: {} };
    updateFeeds(feeds);
    ctx.reply("🧹 Cleared all your feeds.");
  });
}
