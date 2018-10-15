const { Command } = require('discord.js-commando');
const { doesUserExist } = require('../../../api/fortnite-api');
const { linkServerMemberToEpicIGN } = require('../../../actions/members');

class ForceLinkCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'force-link',
      memberName: 'force-link',
      group: 'users',
      description:
        'Links a fortnite IGN to a discord user specified in the command.',
      examples: ['`!atw link {ign} to {discord ign}`']
    });
  }

  async run(message, argsString) {
    message.channel.startTyping();
    try {
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        await message.reply(`This command is only available to Administrators`);
        return;
      }

      const serverId = message.guild.id;
      if (!argsString.includes(' to ')) {
        await message.reply(
          `\` to \` indicates the split between the command. Where the fuck is it ma brudah?`
        );
        return;
      }
      const args = argsString.split(' to ');
      if (args.length < 2) {
        await message.reply(
          `\` to \` did not split the IGNs. Probably cause it wasn't placed between two.`
        );
        return;
      }
      if (args.length > 2) {
        await message.reply(
          `Multiple \` to \`s found. Unless this is part of your ign? If so, this bot can't force link it yet. The user will have to do it himself. (for now)`
        );
        return;
      }

      const epicIGN = args[0].trim();
      const discordUser = args[1].trim();

      if (!(await doesUserExist)) {
        await message.reply(
          `The epic ign ${epicIGN} does not exist in fortnite tracker's database`
        );
        return;
      }

      await message.reply(
        `Will try link \`${epicIGN}\` fortnite account to \`${discordUser}\``
      );

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

      if (!serverMember) {
        await message.reply(
          `The discord account ${discordUser} could not be found within this server`
        );
        return;
      }

      try {
        await linkServerMemberToEpicIGN({
          serverId,
          userDiscordId: serverMember.id,
          epicIGN
        });
        await message.reply(
          `Successfully linked ign (${epicIGN}) to your discord account (${discordUser}, id: ${
            serverMember.id
          }).`
        );
      } catch (e) {
        console.log(e);
        await message.reply(
          `Could not link fortnite account(${epicIGN}) to ${discordUser}`
        );
      }
    } catch (e) {
      throw e;
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = ForceLinkCommand;
