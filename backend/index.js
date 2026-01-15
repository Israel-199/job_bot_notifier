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
  { command: "clearfeeds", description: "🧹 Clear all feeds" }
]);

// Start bot + scheduler
bot.launch();
startScheduler();
