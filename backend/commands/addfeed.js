import prisma from "../db.js";

export default function addfeedCommand(bot) {
  bot.command("addfeed", async (ctx) => {
    const rssUrl = ctx.message.text.split(" ")[1];
    if (!rssUrl) {
      return ctx.reply("Usage: /addfeed <Upwork RSS feed URL>");
    }

    const userId = BigInt(ctx.chat.id);

    try {
      const existing = await prisma.feed.findFirst({
        where: { userId, url: rssUrl },
      });

      if (existing) {
        return ctx.reply("⚠️ You already added this feed.");
      }

      await prisma.feed.create({
        data: { userId, url: rssUrl },
      });

      ctx.reply(`✅ Added feed: ${rssUrl}`);
    } catch (err) {
      console.error("Error adding feed:", err);
      ctx.reply("❌ Failed to add feed.");
    }
  });
}
