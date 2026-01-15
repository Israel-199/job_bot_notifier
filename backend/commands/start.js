export default function startCommand(bot) {
  bot.start((ctx) => {
    ctx.reply(`
👋 Welcome to *Upwork Job Notify Bot*!  

🚀 I’ll keep you updated with new job postings from Upwork based on your skills.  

To begin:
1️⃣ Save a search on Upwork (e.g., "Frontend developer").  
2️⃣ Copy the RSS feed link.  
3️⃣ Send it here with 👉 /addfeed <rssUrl>  

Type ℹ️ /help anytime to see all commands and tips.
    `, { parse_mode: "Markdown" });
  });
}
