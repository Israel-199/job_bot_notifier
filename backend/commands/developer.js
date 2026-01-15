export default function developerCommand(bot) {
  bot.command("developer", (ctx) => {
    ctx.reply(`
👨‍💻 *Developer Info*

This bot was developed by *Israel Assefa*  
(Full-Stack Developer)

📬 Contact Me:
💬 Telegram: @Isru4600  
📧 Email: israelassefa199@gmail.com  

💡 Reach out for feedback, collaboration, or support!
    `, { parse_mode: "Markdown" });
  });
}
