import prisma from "../db.js"; // PrismaClient instance

export default function addfeedCommand(bot) {
  bot.command("addfeed", async (ctx) => {
    const rssUrl = ctx.message.text.split(" ")[1];
    if (!rssUrl) {
      return ctx.reply("Usage: /addfeed <Upwork RSS feed URL>");
    }

    const userId = BigInt(ctx.chat.id);

    try {
      // Check if feed already exists for this user
      const existing = await prisma.feed.findFirst({
        where: { userId, url: rssUrl },
      });

      if (existing) {
        return ctx.reply("⚠️ You already added this feed.");
      }

      // Add new feed
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
