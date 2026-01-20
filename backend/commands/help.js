export default function helpCommand(bot) {
  bot.command("help", (ctx) => {
    ctx.reply(`
🤖 *Upwork Job Notify Bot* — Commands Guide

✨ *Getting Started*
1️⃣ Go to [Upwork Job Search](https://www.upwork.com/nx/jobs/) and run a search (e.g., "React developer").
2️⃣ Look at the search URL in your browser. Find the part that says \`q=your+keyword\`.
   Example: \`https://www.upwork.com/nx/search/jobs/?q=frontend%20developer\`
3️⃣ Convert it into an RSS feed link by using this format:
   👉 \`https://www.upwork.com/ab/feed/jobs/rss?q=your+keyword\`
   Example: \`https://www.upwork.com/ab/feed/jobs/rss?q=frontend+developer\`
4️⃣ Send it to me with:
   👉 /addfeed <rssUrl>

🛠️ *Commands*
➕ /addfeed <rssUrl>  
📋 /listfeeds  
🗑️ /removefeed <rssUrl>  
🧹 /clearfeeds  
ℹ️ /about  
📊 /status  
👨‍💻 /developer  
❓ /help  

💡 *Tip*: Each skill or keyword (React, Node.js, Golang, Tailwind CSS, etc.) can have its own RSS feed.
    `, { parse_mode: "Markdown" });
  });
}
