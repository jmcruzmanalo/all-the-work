
const { DEV_MODE } = require('../config');
const { bot } = require('./bot-instance');
const { addNeededRoles } = require('../commands/roles');

const onReady = async () => {
  const guilds = bot.guilds;
  const guildsArray = guilds.array();

  for (let x = 0; x < guildsArray.length; x++) {
    const guild = guildsArray[x];
    const rolesArray = guild.roles.array();
    addNeededRoles({guildID: guild.id, activeRoles: rolesArray})
      .then(() => {
        console.log(`Prepared roles for server: ${guild.id}`);
      });
  }
};

const onMessage = async (message) => {
  // message.channel.name
  if (DEV_MODE && message.channel.name !== 'bot-development') {
    return;
  }
  const text = message.content;
  if (text.substring(0, 4) === '!atw') {
    console.log(message);
    message.reply(':middle_finger:');
  }
}

module.exports = { onReady, onMessage };