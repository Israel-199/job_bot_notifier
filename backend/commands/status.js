import prisma from "../db.js";

export default function statusCommand(bot) {
  bot.command("status", async (ctx) => {
    const userId = BigInt(ctx.chat.id);

    try {
      const skillCount = await prisma.feed.count({
        where: { userId },
      });

      if (skillCount === 0) {
        return ctx.reply(
          "📊 Status: You don’t have any tracked skills yet. ➕ Add one with /addskill <keyword>"
        );
      }
      ctx.reply(
        `📊 Status: You currently have *${skillCount}* skill(s) saved.\n⏱️ I’m checking them every 5 minutes for new jobs.`,
        { parse_mode: "Markdown" }
      );
    } catch (err) {
      console.error("Error fetching status:", err);
      ctx.reply("❌ Failed to fetch status.");
    }
  });
}
