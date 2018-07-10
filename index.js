// API KEY: JhhfPQCUkvCHeJFqM2Bl
// KEY name: eBcZd

const Discord = require('discord.js');

const DEV_MODE = true;
const bot = new Discord.Client();


const kd = require('./commands/kd');


bot.on('message', async (message) => {
  // messgae.channel.name
  if (DEV_MODE && message.channel.name !== 'bot-development') {
      return;
  }
  const text = message.content;
  if (text.substring(0, 4) === '!atw') {

    // For now just pass straight to setKD
    await kd.setKD(message);

    message.reply(':middle_finger:');
  }

});

bot.login('NDY1ODU3MDcxMDk1NzQyNDk1.DiTmuQ.kriHkhbB7uXxd8t_Prg_9oTZuv0');