
const { DEV_MODE } = require('../config');
const { bot } = require('./bot-instance');
const { addNeededRoles, sortNeededRoles } = require('../actions/roles');

const onReady = async () => {

  console.log('Bot is ready, running needed checks.');

  const guilds = bot.guilds;
  const guildsArray = guilds.array();

  for (let x = 0; x < guildsArray.length; x++) {
    const guild = guildsArray[x];
    const rolesArray = guild.roles.array();
    addNeededRoles({guildID: guild.id, activeRoles: rolesArray})
      .then(() => {
        console.log(`Prepared roles for server: ${guild.id}`);
        // return sortNeededRoles({guildID: guild.id});
      })
      .then(() => {
        // console.log('Done sorting the Roles');
        
        // #suspicious-messages ID: 445547935833391104
        
      });
  }
};

const onMessage = async (message) => {
  // message.channel.name
  if (DEV_MODE && message.channel.name !== 'bot-development') {
    return;
  }
}

module.exports = { onReady, onMessage };