const { Command } = require('discord.js-commando');
const { getDeservedRole } = require('../../../actions/kd');
const { UserLink } = require('../../../database/models/userLink');
const { setUserRolesInGuild } = require('../../../actions/roles');
const { getUserRoles, removeUserRole } = require('../../../api/discord-api');

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
    const discordID = message.author.id;

    message.channel.stopTyping();
  }
}

module.exports = DeservedRoleCommand;
