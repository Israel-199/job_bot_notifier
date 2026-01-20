export default function helpCommand(bot) {
  bot.command("help", (ctx) => {
    ctx.reply(`
🤖 *Upwork Job Notify Bot* — Commands Guide

✨ *Getting Started*
1️⃣ Go to [Upwork Job Search](https://www.upwork.com/nx/jobs/) and run a search (e.g., "React developer").
2️⃣ Look at the search URL in your browser. Find the part that says \`q=your+keyword\`.
   Example: \`https://www.upwork.com/nx/search/jobs/?q=frontend%20developer\`
3️⃣ Copy the keyword you want to track (e.g., "frontend developer").
4️⃣ Add it here with:
   👉 /addskill <keyword>

🛠️ *Commands*
➕ /addskill <keyword>  
📋 /listskills  
🗑️ /removeskill <keyword>  
🧹 /clearskills  
ℹ️ /about  
📊 /status  
👨‍💻 /developer  
❓ /help  

💡 *Tip*: Each skill or keyword (React, Node.js, Golang, Tailwind CSS, etc.) can be tracked individually. I’ll notify you whenever new jobs appear for those skills.
    `, { parse_mode: "Markdown" });
  });
}
