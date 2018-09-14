const { Command } = require('discord.js-commando');
const { UserLink } = require('../../../database/models/userLink');
const {
  getDeservedTRNRole,
  applyRolesToUser
} = require('../../../actions/roles/roles.compute');

class DeservedRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'where-do-i-belong',
      memberName: 'where-do-i-belong',
      group: 'users',
      description: 'Figures out what role you deserve based on TRN',
      examples: ['`!atw where-do-i-belong`']
    });
  }

  async run(message, argsString, formPattern) {
    message.channel.startTyping();
    const userDiscordId = message.author.id;

    const doc = await UserLink.findOne({
      userDiscordId
    });

    if (doc) {
      const serverId = message.member.guild.id;

      const roles = await getDeservedTRNRole({
        serverId,
        userDiscordId
      });

      const { deservedRoles, invalidRoles } = roles;

      await applyRolesToUser({
        serverId,
        userDiscordId,
        deservedRoles,
        invalidRoles
      });
    } else {
      message.reply(
        'No linked account to discordID yafuq. Run: `!atw link your-IGN'
      );
    }
    message.channel.stopTyping();
  }
}

module.exports = DeservedRoleCommand;
