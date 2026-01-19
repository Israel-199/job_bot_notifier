import { bot } from "./bot.js";
import startCommand from "./commands/start.js";
import helpCommand from "./commands/help.js";
import aboutCommand from "./commands/about.js";
import statusCommand from "./commands/status.js";
import developerCommand from "./commands/developer.js";
import addfeedCommand from "./commands/addfeed.js";
import listfeedsCommand from "./commands/listfeeds.js";
import removefeedCommand from "./commands/removefeed.js";
import clearfeedsCommand from "./commands/clearfeeds.js";
import { startScheduler } from "./scheduler.js";
import express from "express";
import cron from "node-cron";

// Register commands
startCommand(bot);
helpCommand(bot);
aboutCommand(bot);
statusCommand(bot);
developerCommand(bot);
addfeedCommand(bot);
listfeedsCommand(bot);
removefeedCommand(bot);
clearfeedsCommand(bot);

// Command menu
bot.telegram.setMyCommands([
  { command: "start", description: "👋 Welcome message" },
  { command: "help", description: "❓ Show help guide" },
  { command: "about", description: "ℹ️ About this bot" },
  { command: "status", description: "📊 Show your feed status" },
  { command: "developer", description: "👨‍💻 Developer info" },
  { command: "addfeed", description: "➕ Add an Upwork RSS feed" },
  { command: "listfeeds", description: "📋 List your feeds" },
  { command: "removefeed", description: "🗑️ Remove a feed" },
  { command: "clearfeeds", description: "🧹 Clear all feeds" },
]);

// Express server
const app = express();
const PORT = process.env.PORT || 3000;

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Job Bot Notifier is running");
});

// Mount Telegraf webhook into Express
app.use(bot.webhookCallback("/telegram"));

// Set webhook URL for Telegram (production only)
if (process.env.NODE_ENV === "production") {
  bot.telegram.setWebhook(`https://job-bot-notifier.onrender.com/telegram`);
} else {
  // Local dev: use polling
  bot.launch();
}

// Start scheduler
startScheduler();

// 🔔 Cron job to run periodic tasks every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("⏰ Cron job triggered: running periodic tasks");

  // Example: heartbeat log or feed check
  // startScheduler(); // re-run feed checks if needed
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
