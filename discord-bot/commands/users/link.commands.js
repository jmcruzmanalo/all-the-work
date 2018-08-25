const { Command } = require('discord.js-commando');
const { UserLink } = require('../../../database/models/userLink');
const { doesUserExist } = require('../../../api/fortnite-api');
const { linkServerMemberToEpicIGN } = require('../../../actions/members');

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
    const serverId = message.guild.id
    const userDiscordId = message.author.id;
    const epicIGN = args[0];

    try {
      if (!epicIGN) {
        message.reply(`yafuq, provide your Epic IGN. \`!atw link your-ign-here\``);
        return;
      }

      if (await doesUserExist({ ign: epicIGN })) {
        await linkServerMemberToEpicIGN({ serverId, userDiscordId, epicIGN});
        message.reply(`Successfully linked your ign (${epicIGN}) to your discord account.`);
      } else {
        message.reply(`The user \`${epicIGN}\` does not seem to exist in the Epic servers.`);
        return;
      }
    } catch (e) {
      console.log(e);
      message.reply(`There was an error processing your request, let the DooDoo owner know. he fuq`);
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = LinkCommand;