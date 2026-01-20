import { Telegraf } from "telegraf";
import Parser from "rss-parser";
import dotenv from "dotenv";
import prisma from "./db.js"; 

dotenv.config();

// Telegram bot
export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// RSS parser with headers to mimic a browser
export const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0; +https://yourdomain.com)",
    "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8"
  }
});

// Load feeds for a user
export async function loadFeeds(userId) {
  const feeds = await prisma.feed.findMany({
    where: { userId: BigInt(userId) },
  });
  return feeds.map(f => f.url);
}

// Save feeds for a user (replace old ones)
export async function saveFeeds(userId, urls) {
  await prisma.feed.deleteMany({ where: { userId: BigInt(userId) } });

  for (const url of urls) {
    await prisma.feed.create({
      data: { userId: BigInt(userId), url },
    });
  }
}

// Mark a job as seen
export async function markJobSeen(userId, jobUrl) {
  await prisma.seenJob.create({
    data: { userId: BigInt(userId), jobUrl },
  });
}

// Check if a job was already seen
export async function isJobSeen(userId, jobUrl) {
  const job = await prisma.seenJob.findFirst({
    where: { userId: BigInt(userId), jobUrl },
  });
  return !!job;
}
