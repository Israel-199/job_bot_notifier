import prisma from "../db.js"; // PrismaClient instance

export default function clearfeedsCommand(bot) {
  bot.command("clearfeeds", async (ctx) => {
    const userId = BigInt(ctx.chat.id);

    try {
      // Delete all feeds for this user
      await prisma.feed.deleteMany({
        where: { userId },
      });

      // Optionally also clear seen jobs
      await prisma.seenJob.deleteMany({
        where: { userId },
      });

      ctx.reply("🧹 Cleared all your feeds.");
    } catch (err) {
      console.error("Error clearing feeds:", err);
      ctx.reply("❌ Failed to clear feeds.");
    }
  });
}
