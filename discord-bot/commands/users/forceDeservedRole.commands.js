const { Command } = require('discord.js-commando');
const { UserLink } = require('../../../database/models/userLink');
const {
  getDeservedTRNRole,
  applyRolesToUser
} = require('../../../actions/roles/roles.compute');

class DeservedRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'where-does-this-fuck-belong',
      memberName: 'where-does-this-fuck-belong',
      group: 'users',
      description:
        'Figures out what role the specified user deserves based on TRN',
      examples: [
        `\`!atw where-does-this-fuck-belong <your-victims-discord-name>\``
      ]
    });
  }

  async run(message, argsString, formPattern) {
    message.channel.startTyping();
    try {
      const discordUser = argsString;

      const serverMembers = message.guild.members
        .array()
        .map(({ nickname, user }) => ({
          nickname,
          id: user.id,
          username: user.username
        }));
      const serverMember = serverMembers.find(
        ({ nickname, username }) =>
          discordUser === nickname || discordUser === username
      );

      if (serverMember) {
        const serverId = message.member.guild.id;
        const userDiscordId = serverMember.id;
        const roles = await getDeservedTRNRole({
          serverId,
          userDiscordId
        });

        if (roles.error) {
          await message.reply(roles.error);
          message.channel.stopTyping();
          return;
        }

        const { deservedRoles, invalidRoles } = roles;

        const { addedRoles } = await applyRolesToUser({
          serverId,
          userDiscordId,
          deservedRoles,
          invalidRoles
        });
        if (addedRoles && addedRoles.length >= 1) {
          await message.reply(
            `${discordUser} has joined ${addedRoles[0].name}!`
          );
        }
      } else {
        await message.reply(
          `Could not find \`${discordUser}\` in this server.`
        );
      }
    } catch (e) {
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = DeservedRoleCommand;
