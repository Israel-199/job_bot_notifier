import { feeds, updateFeeds } from "../bot.js";

export default function removefeedCommand(bot) {
  bot.command("removefeed", (ctx) => {
    const rssUrl = ctx.message.text.split(" ")[1];
    const chatId = ctx.chat.id;

    if (!feeds[chatId] || !feeds[chatId].urls.includes(rssUrl)) {
      return ctx.reply("⚠️ That feed isn’t in your list.");
    }

    feeds[chatId].urls = feeds[chatId].urls.filter(url => url !== rssUrl);
    updateFeeds(feeds);
    ctx.reply(`🗑️ Removed feed: ${rssUrl}`);
  });
}
