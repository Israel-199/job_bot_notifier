import prisma from "../db.js";

export default function removefeedCommand(bot) {
  bot.command("removefeed", async (ctx) => {
    const rssUrl = ctx.message.text.split(" ")[1];
    if (!rssUrl) {
      return ctx.reply("Usage: /removefeed <Upwork RSS feed URL>");
    }

    const userId = BigInt(ctx.chat.id);

    try {
      const result = await prisma.feed.deleteMany({
        where: { userId, url: rssUrl },
      });

      if (result.count === 0) {
        ctx.reply("⚠️ That feed isn’t in your list.");
      } else {
        ctx.reply(`🗑️ Removed feed: ${rssUrl}`);
      }
    } catch (err) {
      console.error("Error removing feed:", err);
      ctx.reply("❌ Failed to remove feed.");
    }
  });
}
