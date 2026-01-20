import prisma from "../db.js";

export default function addSkillCommand(bot) {
  bot.command("addskill", async (ctx) => {
    const skill = ctx.message.text.split(" ").slice(1).join(" ");
    if (!skill) {
      return ctx.reply("Usage: /addskill <keyword or skill>");
    }

    const userId = BigInt(ctx.chat.id);

    try {
      const existing = await prisma.feed.findFirst({
        where: { userId, skill },
      });

      if (existing) {
        return ctx.reply("⚠️ You already added this skill.");
      }

      await prisma.feed.create({
        data: { userId, skill },
      });

      ctx.reply(`✅ Added skill: ${skill}`);
    } catch (err) {
      console.error("Error adding skill:", err);
      ctx.reply("❌ Failed to add skill.");
    }
  });
}
