const { Command } = require('discord.js-commando');
const { Link } = require('../../../database/models/Link');
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

    const args = argsString.split(" ");
    const guildID = message.guild.id
    const epicIGN = args[0];
    const discordID = message.author.id;

    if (await doesUserExist({ign: epicIGN})) {
      const link = new Link({
        guildID,
        epicIGN,
        discordID
      });
      link.save();
      message.reply(`Successfully linked your account`);
    } else {
      message.reply(`The user ${epicIGN} does not seem to exist.`);
      return;
    }
  }
}

module.exports = LinkCommand;