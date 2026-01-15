import { Telegraf } from "telegraf";
import Parser from "rss-parser";
import fs from "fs";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const parser = new Parser();

// Load feeds database
let feeds = {};
if (fs.existsSync("feeds.json")) {
  feeds = JSON.parse(fs.readFileSync("feeds.json"));
}

// Save feeds database
function saveFeeds() {
  fs.writeFileSync("feeds.json", JSON.stringify(feeds, null, 2));
}

// --- COMMANDS ---

// /start
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

// /help
bot.command("help", (ctx) => {
  ctx.reply(`
🤖 *Upwork Job Notify Bot* — Commands Guide

✨ *Getting Started*
1️⃣ Go to Upwork and run a job search (e.g., "React developer").
2️⃣ Save the search, then copy the RSS feed link.
3️⃣ Send it to me with 👉 /addfeed <rssUrl>

🛠️ *Commands*
➕ /addfeed <rssUrl>  
Add an Upwork RSS feed to get job notifications.

📋 /listfeeds  
Show all your saved feeds.

🗑️ /removefeed <rssUrl>  
Remove a specific feed from your list.

🧹 /clearfeeds  
Remove all feeds at once.

ℹ️ /about  
Learn what this bot does.

📊 /status  
See how many feeds you have.

👨‍💻 /developer  
Info about the developer & contact details.

❓ /help  
Show this help message.

💡 *Tip*: Each skill or keyword you save in Upwork can generate its own RSS feed. Add multiple feeds to track different skills!
  `, { parse_mode: "Markdown" });
});

// /about
bot.command("about", (ctx) => {
  ctx.reply(`
ℹ️ *About This Bot*

This bot helps freelancers stay updated with new job postings on Upwork.  
You can add your personal Upwork RSS feed links, and I’ll notify you whenever new jobs appear that match your skills.

✨ Key Features:
🔔 Instant Telegram notifications  
📋 Track multiple skills/searches  
🗑️ Manage feeds easily  
✅ Deduplication (no repeats)

Type ❓ /help to see all available commands.
  `, { parse_mode: "Markdown" });
});

// /status
bot.command("status", (ctx) => {
  const chatId = ctx.chat.id;
  if (!feeds[chatId] || feeds[chatId].urls.length === 0) {
    return ctx.reply("📊 Status: You don’t have any feeds yet. ➕ Add one with /addfeed <url>");
  }

  const feedCount = feeds[chatId].urls.length;
  ctx.reply(`📊 Status: You currently have *${feedCount}* feed(s) saved.\n⏱️ I’m checking them every 5 minutes for new jobs.`, { parse_mode: "Markdown" });
});

// /developer
bot.command("developer", (ctx) => {
  ctx.reply(`
👨‍💻 *Developer Info*

This bot was developed by *Israel Assefa*  
(Full-Stack Developer)

📬 Contact:
💬 Telegram: @Isru4600  
📧 Email: israelassefa199@gmail.com  

💡 Reach out for feedback, collaboration, or support!
  `, { parse_mode: "Markdown" });
});

// /addfeed
bot.command("addfeed", (ctx) => {
  const rssUrl = ctx.message.text.split(" ")[1];
  if (!rssUrl) {
    return ctx.reply("Usage: /addfeed <Upwork RSS feed URL>");
  }

  const chatId = ctx.chat.id;
  if (!feeds[chatId]) feeds[chatId] = { urls: [], seen: {} };

  if (!feeds[chatId].urls.includes(rssUrl)) {
    feeds[chatId].urls.push(rssUrl);
    saveFeeds();
    ctx.reply(`✒️Added feed: ${rssUrl}`);
  } else {
    ctx.reply("⚠️ You already added this feed.");
  }
});

// /listfeeds
bot.command("listfeeds", (ctx) => {
  const chatId = ctx.chat.id;
  if (!feeds[chatId] || feeds[chatId].urls.length === 0) {
    return ctx.reply("📋 You don’t have any feeds yet. Add one with /addfeed <url>");
  }
  ctx.reply("📋 Your feeds:\n" + feeds[chatId].urls.join("\n"));
});

bot.command("removefeed", (ctx) => {
  const rssUrl = ctx.message.text.split(" ")[1];
  const chatId = ctx.chat.id;

  if (!feeds[chatId] || !feeds[chatId].urls.includes(rssUrl)) {
    return ctx.reply("⚠️ That feed isn’t in your list.");
  }

  feeds[chatId].urls = feeds[chatId].urls.filter(url => url !== rssUrl);
  saveFeeds();
  ctx.reply(`🗑️ Removed feed: ${rssUrl}`);
});

bot.command("clearfeeds", (ctx) => {
  const chatId = ctx.chat.id;
  feeds[chatId] = { urls: [], seen: {} };
  saveFeeds();
  ctx.reply("🧹 Cleared all your feeds.");
});

cron.schedule("*/5 * * * *", async () => {
  for (const chatId of Object.keys(feeds)) {
    for (const rssUrl of feeds[chatId].urls) {
      try {
        const feed = await parser.parseURL(rssUrl);
        feed.items.forEach(item => {
          const jobId = item.link; 
          if (!feeds[chatId].seen[jobId]) {
            feeds[chatId].seen[jobId] = true; 
            bot.telegram.sendMessage(
              chatId,
              `🆕 New Job: ${item.title}\n${item.link}`
            );
          }
        });
        saveFeeds();
      } catch (err) {
        console.error("Error fetching feed:", rssUrl, err.message);
      }
    }
  }
});

bot.telegram.setMyCommands([
  { command: "start", description: "👋 Welcome message" },
  { command: "help", description: "❓ Show help guide" },
  { command: "about", description: "ℹ️ About this bot" },
  { command: "status", description: "📊 Show your feed status" },
  { command: "developer", description: "👨‍💻 Developer info" },
  { command: "addfeed", description: "➕ Add an Upwork RSS feed" },
  { command: "listfeeds", description: "📋 List your feeds" },
  { command: "removefeed", description: "🗑️ Remove a feed" },
  { command: "clearfeeds", description: "🧹 Clear all feeds" }
]);

bot.launch();
