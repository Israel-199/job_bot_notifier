import prisma from "../db.js"; 

export default function listSkillsCommand(bot) {
  bot.command("listskills", async (ctx) => {
    const userId = BigInt(ctx.chat.id);

    try {
      const skills = await prisma.feed.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (skills.length === 0) {
        return ctx.reply("📋 You don’t have any tracked skills yet. Add one with /addskill <keyword>");
      }

      const skillList = skills.map(s => s.skill).join("\n");
      ctx.reply("📋 Your tracked skills:\n" + skillList);
    } catch (err) {
      console.error("Error listing skills:", err);
      ctx.reply("❌ Failed to list skills.");
    }
  });
}
