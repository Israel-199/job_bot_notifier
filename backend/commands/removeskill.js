import prisma from "../db.js";

export default function removeSkillCommand(bot) {
  bot.command("removeskill", async (ctx) => {
    const skill = ctx.message.text.split(" ").slice(1).join(" ");
    if (!skill) {
      return ctx.reply("Usage: /removeskill <skill keyword>");
    }

    const userId = BigInt(ctx.chat.id);

    try {
      const result = await prisma.feed.deleteMany({
        where: { userId, skill },
      });

      if (result.count === 0) {
        ctx.reply("⚠️ That skill isn’t in your list.");
      } else {
        ctx.reply(`🗑️ Removed skill: ${skill}`);
      }
    } catch (err) {
      console.error("Error removing skill:", err);
      ctx.reply("❌ Failed to remove skill.");
    }
  });
}
