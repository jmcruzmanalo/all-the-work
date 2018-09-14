const { DEV_MODE } = require('../config');
const { bot } = require('./bot-instance');
const { addNeededRoles, sortNeededRoles } = require('../actions/roles/roles');

const onReady = async () => {
  console.log('Bot is ready, running needed checks.');

  const guilds = bot.guilds;
  const guildsArray = guilds.array();

  for (let x = 0; x < guildsArray.length; x++) {
    const guild = guildsArray[x];
    const rolesArray = guild.roles.array();
    addNeededRoles({ serverId: guild.id, activeRoles: rolesArray }).then(
      addedRoles => {
        if (addedRoles && addedRoles.length) {
          console.log(`Prepared roles for server: ${guild.id}`);
        } else {
          console.log(
            'No serverRolesConfig detected. use `!atw set-server-roles`'
          );
        }
      }
    );
  }
};
const onMessage = async message => {
  // message.channel.name
  if (DEV_MODE && message.channel.name !== 'bot-development') {
    return;
  }
};

module.exports = { onReady, onMessage };
