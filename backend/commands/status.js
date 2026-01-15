import { feeds } from "../bot.js";

export default function statusCommand(bot) {
  bot.command("status", (ctx) => {
    const chatId = ctx.chat.id;
    if (!feeds[chatId] || feeds[chatId].urls.length === 0) {
      return ctx.reply("📊 Status: You don’t have any feeds yet. ➕ Add one with /addfeed <url>");
    }

    const feedCount = feeds[chatId].urls.length;
    ctx.reply(`📊 Status: You currently have *${feedCount}* feed(s) saved.\n⏱️ I’m checking them every 5 minutes for new jobs.`, { parse_mode: "Markdown" });
  });
}
