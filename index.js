require("dotenv").config();
const { Telegraf } = require("telegraf");
const { exec } = require("child_process");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Команда для старта /start
bot.start((ctx) => {
  ctx.reply("Бот стартанул, /help выводит команды");
});

const startCommand = (cmd) => {
  if (cmd === "off") {
    exec("sudo shutdown -h now", (err, stdout, stdin) => {
      if (err) {
        console.log(err.message);
      }

      console.log(stdout);
      console.log(stdin);
    });
  }

  if (cmd === "sleep") {
    exec("pmset sleepnow", (err, stdout, stdin) => {
      if (err) {
        console.log(err.message);
      }
    });
  }
};

// Слушатель для помощи /help
bot.help((ctx) => {
  const text = `
    Бот для удаленного управления ПК
    *Команды* : 
    "Выключить" \\- отключает компьютер 
    "Cон" \\- отправляет в сон 
    Нужно еще придумать команды
    "Кто клоун?" \\- Отправить Дмитрию то, что он Клоун\\(нужно доделать\\)
  `;
  ctx.replyWithMarkdownV2(text);
});

// Слушатель команд(просто вводить текст)
bot.hears([/сон/gi, /выключить/gi], (ctx) => {
  const text = ctx.message.text.toLowerCase();

  switch (text) {
    case "выключить":
      startCommand("off");
      break;
    case "сон":
      ctx.reply("Ваш ПК будет спать");
      new Promise((resolve, reject) => {
        resolve(startCommand("sleep"));
      }).then((res) => ctx.reply("Пк ушел спать, спокойного ему сна"));
      break;
    default:
  }
});

// Запуст Бота
bot
  .launch()
  .then(() => {
    console.log("Bot Started >>");
  })
  .catch((err) => console.error("ERROR", err.message));
