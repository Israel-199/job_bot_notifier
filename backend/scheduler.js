import cron from "node-cron";
import { bot, scrapeJobs } from "./bot.js";
import prisma from "./db.js";

function formatRelativeTime(pubDate) {
  if (!pubDate) return "Just posted";

  const diffMs = Date.now() - new Date(pubDate).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}

export function startScheduler() {
  cron.schedule("*/15 * * * *", async () => {   
    console.log("⏰ Scheduler triggered: checking skills...");

    try {
      const allSkills = await prisma.feed.findMany();

      const skillsByUser = allSkills.reduce((acc, feed) => {
        const uid = feed.userId.toString();
        if (!acc[uid]) acc[uid] = [];
        acc[uid].push(feed.skill);  
        return acc;
      }, {});

      for (const [chatId, skills] of Object.entries(skillsByUser)) {
        for (const skill of skills) {
          try {
            const jobs = await scrapeJobs(skill);

            for (const job of jobs.slice(0, 5)) {
              const jobId = job.link;
              const seen = await prisma.seenJob.findFirst({
                where: { userId: BigInt(chatId), jobUrl: jobId },
              });

              if (!seen) {
                await prisma.seenJob.create({
                  data: { userId: BigInt(chatId), jobUrl: jobId },
                });

                const description = job.description
                  ? job.description.slice(0, 300) +
                    (job.description.length > 300 ? "..." : "")
                  : "No description provided.";

                await bot.telegram.sendMessage(
                  chatId,
                  `🆕 <b>${job.title}</b>\n🕒 Posted: Just now\n\n${description}\n\n🔗 ${job.link}`,
                  { parse_mode: "HTML" }
                );
              }
            }
          } catch (err) {
            console.error("❌ Error scraping jobs for skill:", skill, err.message);
            await bot.telegram.sendMessage(
              chatId,
              `⚠️ Failed to fetch jobs for skill: ${skill}`
            );
          }
        }
      }
    } catch (err) {
      console.error("❌ Scheduler error:", err.message);
    }
  });
}
