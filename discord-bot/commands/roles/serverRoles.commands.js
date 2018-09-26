const { Command } = require('discord.js-commando');
const {
  getServerRolesConfigOrInsert
} = require('../../../actions/roles/roles.edit');

class DeservedRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set-server-roles',
      memberName: 'set-server-roles',
      group: 'roles',
      description: `You'll receive a link to set the server's roles and ratings via a GUI`,
      examples: ['`!atw set-server-roles`']
    });
  }

  async run(message, argsString, formPattern) {
    message.channel.startTyping();
    const discordId = message.author.id;
    const serverId = message.guild.id;
    const url = process.env.NGROK_TUNNEL;

    if (message.member.permissions.has('ADMINISTRATOR')) {
      const serverRolesConfig = await getServerRolesConfigOrInsert({
        serverId,
        latestRequesterDiscordId: discordId
      });

      await message.channel.send({
        embed: {
          color: 3447003,
          title: 'Set user roles',
          description: `The link below will allow you to set the server via a GUI, you'll need to enter the password below on save`,
          fields: [
            {
              name: 'Link:',
              value: `${url}/servers/${serverId}/edit-ratings?requesterDiscordId=${discordId}`
            },
            {
              name: 'Password: (if prompted on save)',
              value: serverRolesConfig.password
            }
          ]
        }
      });
    } else {
      await message.reply(`You need to be an admin to use this feature.`);
    }

    message.channel.stopTyping();
  }
}

module.exports = DeservedRoleCommand;
