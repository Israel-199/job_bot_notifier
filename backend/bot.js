import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import prisma from "./db.js";
import puppeteer from "puppeteer";

dotenv.config();

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export async function scrapeJobs(skill) {
  const url = `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(skill)}`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".job-tile")).map(el => ({
      title: el.querySelector(".job-title")?.innerText.trim(),
      link: "https://www.upwork.com" + el.querySelector("a")?.getAttribute("href"),
      description: el.querySelector(".job-description")?.innerText.trim(),
    }));
  });

  await browser.close();
  return jobs;
}

export async function loadSkills(userId) {
  const feeds = await prisma.feed.findMany({
    where: { userId: BigInt(userId) },
  });
  return feeds.map(f => f.skill);
}

export async function saveSkills(userId, skills) {
  await prisma.feed.deleteMany({ where: { userId: BigInt(userId) } });

  for (const skill of skills) {
    await prisma.feed.create({
      data: { userId: BigInt(userId), skill },
    });
  }
}

export async function markJobSeen(userId, jobUrl) {
  await prisma.seenJob.create({
    data: { userId: BigInt(userId), jobUrl },
  });
}

export async function isJobSeen(userId, jobUrl) {
  const job = await prisma.seenJob.findFirst({
    where: { userId: BigInt(userId), jobUrl },
  });
  return !!job;
}
