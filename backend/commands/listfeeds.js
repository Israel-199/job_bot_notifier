import { feeds } from "../bot.js";

export default function listfeedsCommand(bot) {
  bot.command("listfeeds", (ctx) => {
    const chatId = ctx.chat.id;
    if (!feeds[chatId] || feeds[chatId].urls.length === 0) {
      return ctx.reply("📋 You don’t have any feeds yet. Add one with /addfeed <url>");
    }
    ctx.reply("📋 Your feeds:\n" + feeds[chatId].urls.join("\n"));
  });
}
