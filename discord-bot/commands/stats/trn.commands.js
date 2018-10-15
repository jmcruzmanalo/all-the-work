const { Command } = require('discord.js-commando');
const { getTRN } = require('../../../actions/stats');
const { doesUserExist } = require('../../../api/fortnite-api');

class TRNCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trn',
      group: 'stats',
      memberName: 'trn',
      description: `Gets the TRN of the linked account or specified epic IGN. It will delete the command sent by the user and also send a self destructing message.`,
      examples: ['`!atw trn`', '`!atw trn ATW_Seensei`']
    });
  }

  async run(message, argsString) {
    try {
      message.channel.startTyping();
      if (argsString) {
        const epicIGN = argsString;
        if (!await doesUserExist({ign: epicIGN})) {
          await message.reply(`Can't find user (${epicIGN}) in Fortnite Tracker's database.`);
          return;
        }
        const trn = await getTRN({epicIGN});
        await message.reply(`\`${epicIGN}\`'s TRN is ${trn}.`);
        return;

      } else {

      }
    } catch (e) {
      
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = TRNCommand;
