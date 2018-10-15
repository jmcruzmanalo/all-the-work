const { Command } = require('discord.js-commando');
const { getAllUserLinks } = require('../../../actions/members');

class ShowLinksCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'show-links',
      memberName: 'show-links',
      group: 'users',
      description: 'Show all the linked accounts in the server',
      examples: ['`!atw show-links`']
    });
  }

  async run(message) {
    try {
      message.channel.startTyping();
      const serverId = message.guild.id;
      const userLinks = await getAllUserLinks(serverId);
      const serverMembers = message.guild.members;
      const users = userLinks.map(userLink => {
        const user = { ...userLink };
        const { userDiscordId } = userLink;
        // GuildMember object see discord.js
        const guildMember = serverMembers.get(userDiscordId);
        user.discordName = guildMember.nickname || guildMember.user.username;
        return user;
      });
      let linksString = ``;
      users.forEach(({ discordName, epicIGN }) => {
        linksString += `${epicIGN} to ${discordName} \n`;
      });
      await message.channel.send(linksString);
    } catch (e) {
      throw e;
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = ShowLinksCommand;
