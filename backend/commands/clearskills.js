import prisma from "../db.js"; 

export default function clearSkillsCommand(bot) {
  bot.command("clearskills", async (ctx) => {
    const userId = BigInt(ctx.chat.id);

    try {
      await prisma.feed.deleteMany({
        where: { userId },
      });

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
