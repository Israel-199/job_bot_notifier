import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import prisma from "./db.js";
import fetch from "node-fetch";
import { load } from "cheerio"; 

dotenv.config();

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export async function scrapeJobs(skill) {
  const url = `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(skill)}`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = load(html);  

  const jobs = [];
  $(".job-tile").each((i, el) => {
    jobs.push({
      title: $(el).find(".job-title").text().trim(),
      link: "https://www.upwork.com" + $(el).find("a").attr("href"),
      description: $(el).find(".job-description").text().trim(),
    });
  });

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
