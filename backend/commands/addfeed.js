import { feeds, updateFeeds } from "../bot.js";

export default function addfeedCommand(bot) {
  bot.command("addfeed", (ctx) => {
    const rssUrl = ctx.message.text.split(" ")[1];
    if (!rssUrl) {
      return ctx.reply("Usage: /addfeed <Upwork RSS feed URL>");
    }

    const chatId = ctx.chat.id;
    if (!feeds[chatId]) feeds[chatId] = { urls: [], seen: {} };

    if (!feeds[chatId].urls.includes(rssUrl)) {
      feeds[chatId].urls.push(rssUrl);
      updateFeeds(feeds);
      ctx.reply(`✅ Added feed: ${rssUrl}`);
    } else {
      ctx.reply("⚠️ You already added this feed.");
    }
  });
}
