import prisma from "../db.js"; 

export default function clearSkillsCommand(bot) {
  bot.command("clearskills", async (ctx) => {
    const userId = BigInt(ctx.chat.id);

    try {
      // Delete all tracked skills for this user
      await prisma.feed.deleteMany({
        where: { userId },
      });

      // Delete all seen jobs for this user
      await prisma.seenJob.deleteMany({
        where: { userId },
      });

      ctx.reply("🧹 Cleared all your tracked skills.");
    } catch (err) {
      console.error("Error clearing skills:", err);
      ctx.reply("❌ Failed to clear skills.");
    }
  });
}
