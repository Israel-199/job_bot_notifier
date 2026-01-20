import { bot } from "./bot.js";
import startCommand from "./commands/start.js";
import helpCommand from "./commands/help.js";
import aboutCommand from "./commands/about.js";
import statusCommand from "./commands/status.js";
import developerCommand from "./commands/developer.js";
import addSkillCommand from "./commands/addskill.js";
import listSkillsCommand from "./commands/listskills.js";
import removeSkillCommand from "./commands/removeskill.js";
import clearSkillsCommand from "./commands/clearskills.js";
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
addSkillCommand(bot);
listSkillsCommand(bot);
removeSkillCommand(bot);
clearSkillsCommand(bot);

// Update Telegram command list
bot.telegram.setMyCommands([
  { command: "start", description: "👋 Welcome message" },
  { command: "help", description: "❓ Show help guide" },
  { command: "about", description: "ℹ️ About this bot" },
  { command: "status", description: "📊 Show your skill tracking status" },
  { command: "developer", description: "👨‍💻 Developer info" },
  { command: "addskill", description: "➕ Add a skill keyword to track jobs" },
  { command: "listskills", description: "📋 List your tracked skills" },
  { command: "removeskill", description: "🗑️ Remove a tracked skill" },
  { command: "clearskills", description: "🧹 Clear all tracked skills" },
]);

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Job Bot Notifier is running");
});

app.use(bot.webhookCallback("/telegram"));

if (process.env.NODE_ENV === "production") {
  bot.telegram.setWebhook(`https://job-bot-notifier.onrender.com/telegram`);
} else {
  bot.launch();
}

// Start scheduler
startScheduler();

// Cron job (every 5 minutes — adjust to 15 if you want to stay under 100 requests/day)
cron.schedule("*/5 * * * *", () => {
  console.log("⏰ Cron job triggered: running periodic tasks");
});

// Keep Render backend awake
setInterval(() => {
  axios
    .get("https://job-bot-notifier.onrender.com")
    .then(() => console.log("🔄 Pinged backend URL to stay awake"))
    .catch((err) => console.error("Ping failed:", err.message));
}, 14 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
