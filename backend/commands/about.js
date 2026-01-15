export default function aboutCommand(bot) {
  bot.command("about", (ctx) => {
    ctx.reply(`
ℹ️ *About This Bot*

This bot helps freelancers stay updated with new job postings on Upwork.  
You can add your personal Upwork RSS feed links, and I’ll notify you whenever new jobs appear.

✨ Features:
🔔 Instant Telegram notifications  
📋 Track multiple skills/searches  
🗑️ Manage feeds easily  
✅ Deduplication (no repeats)
    `, { parse_mode: "Markdown" });
  });
}
