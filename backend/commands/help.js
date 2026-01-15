export default function helpCommand(bot) {
  bot.command("help", (ctx) => {
    ctx.reply(`
🤖 *Upwork Job Notify Bot* — Commands Guide

✨ *Getting Started*
1️⃣ Go to Upwork and run a job search (e.g., "React developer").
2️⃣ Save the search, then copy the RSS feed link.
3️⃣ Send it to me with 👉 /addfeed <rssUrl>

🛠️ *Commands*
➕ /addfeed <rssUrl>  
📋 /listfeeds  
🗑️ /removefeed <rssUrl>  
🧹 /clearfeeds  
ℹ️ /about  
📊 /status  
👨‍💻 /developer  
❓ /help  

💡 *Tip*: Each skill or keyword you save in Upwork can generate its own RSS feed.
    `, { parse_mode: "Markdown" });
  });
}
