export default function startCommand(bot) {
  bot.start((ctx) => {
    ctx.reply(`
👋 Welcome to *Upwork Job Notify Bot*!  

🚀 I’ll keep you updated with new job postings from Upwork based on the skills you track.  

To begin:
1️⃣ Think of a skill or keyword you want to monitor (e.g., "Frontend developer").  
2️⃣ Add it here with 👉 /addskill <keyword>  
3️⃣ I’ll check regularly and notify you when new jobs appear.  

Type ℹ️ /help anytime to see all commands and tips.
    `, { parse_mode: "Markdown" });
  });
}
