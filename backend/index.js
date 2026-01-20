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
import axios from "axios";

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

const app = express();
const PORT = process.env.PORT || 3000;

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Job Bot Notifier is running");
});

// Mount Telegraf webhook
app.use(bot.webhookCallback("/telegram"));

// Webhook vs polling
if (process.env.NODE_ENV === "production") {
  bot.telegram.setWebhook(`https://job-bot-notifier.onrender.com/telegram`);
} else {
  bot.launch(); // polling for local dev
}

// Start scheduler
startScheduler();

// 🔔 Cron job every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("⏰ Cron job triggered: running periodic tasks");
  // Add feed checking or other scheduled logic here
});

// 🔑 Keep-alive ping every 14 minutes
setInterval(() => {
  axios
    .get("https://job-bot-notifier.onrender.com")
    .then(() => console.log("🔄 Pinged backend URL to stay awake"))
    .catch((err) => console.error("Ping failed:", err.message));
}, 14 * 60 * 1000);

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
