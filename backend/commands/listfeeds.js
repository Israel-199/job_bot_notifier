import prisma from "../db.js"; // PrismaClient instance

export default function listfeedsCommand(bot) {
  bot.command("listfeeds", async (ctx) => {
    const userId = BigInt(ctx.chat.id);

    try {
      // Fetch feeds from Postgres
      const feeds = await prisma.feed.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (feeds.length === 0) {
        return ctx.reply("📋 You don’t have any feeds yet. Add one with /addfeed <url>");
      }

      const feedList = feeds.map(f => f.url).join("\n");
      ctx.reply("📋 Your feeds:\n" + feedList);
    } catch (err) {
      console.error("Error listing feeds:", err);
      ctx.reply("❌ Failed to list feeds.");
    }
  });
}
