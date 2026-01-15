import { Telegraf } from "telegraf";
import Parser from "rss-parser";
import dotenv from "dotenv";
import { loadFeeds, saveFeeds } from "./db.js";

dotenv.config();

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
export const parser = new Parser();
export let feeds = loadFeeds();

export function updateFeeds(newFeeds) {
  feeds = newFeeds;
  saveFeeds(feeds);
}
