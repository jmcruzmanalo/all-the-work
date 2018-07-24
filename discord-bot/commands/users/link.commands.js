const { Command } = require('discord.js-commando');
const { UserLink } = require('../../../database/models/userLink');
const { doesUserExist } = require('../../../api/fortnite-api');

class LinkCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'link',
      memberName: 'link',
      group: 'users',
      description: 'Links a fortnite IGN to the Discord User. 1-1 relation.',
      examples: ['`!atw link {ign}`']
    });
  }

  async run(message, argsString, formPattern) {
    message.channel.startTyping();
    const args = argsString.split(" ");
    const guildID = message.guild.id
    const epicIGN = args[0];
    const discordID = message.author.id;

    if (await doesUserExist({ign: epicIGN})) {
      const userLink = new UserLink({
        guildID,
        epicIGN,
        discordID
      });
      userLink.save();
      message.reply(`Successfully linked your account`);
    } else {
      message.reply(`The user ${epicIGN} does not seem to exist.`);
      return;
    }
    message.channel.stopTyping();
  }
}

module.exports = LinkCommand;