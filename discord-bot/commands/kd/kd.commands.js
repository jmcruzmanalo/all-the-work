const { Command } = require('discord.js-commando');
const { getKDs } = require('../../../actions/kd');
const { getEpicIgnWithDiscordId } = require('../../../actions/members');
const { doesUserExist } = require('../../../api/fortnite-api');

class KDCommands extends Command {
  constructor(client) {
    super(client, {
      name: 'kd',
      group: 'kd',
      memberName: 'test',
      description: `Gets the KD of the linked account or specified epic IGN. It will delete the command sent by the user and also send a self destructing message.`,
      examples: ['`!atw kd`', '`!atw kd ATW_Seensei`']
    });
  }

  generateMessage(epicIgn, kds) {
    let stats = [];
    for (const cat in kds) {
      if (kds.hasOwnProperty(cat)) {
        const stat = kds[cat];
        stats.push({
          name: cat,
          value: `**${stat.toString()}**`
        });
      }
    }
    return {
      embed: {
        color: 3447003,
        title: `KD of ${epicIgn}`,
        footer: { text: `This message will be deleted in 8 seconds` },
        fields: stats
      }
    };
  }

  async run(message, argsString) {
    message.channel.startTyping();
    const args = argsString.split(' ');
    const userDiscordId = message.author.id;
    let epicIgn = args[0]
      ? args.join(' ')
      : await getEpicIgnWithDiscordId(userDiscordId);
    message.delete();

    console.log(epicIgn);
    if (epicIgn && (await doesUserExist({ ign: epicIgn }))) {
      const kds = await getKDs(epicIgn);
      const sentMessage = await message.channel.send(
        this.generateMessage(epicIgn, kds)
      );
      setTimeout(() => {
        sentMessage.delete();
      }, 8000);
    } else {
      if (args[0]) {
        await message.reply(
          `Could not find epic IGN \`${epicIgn}\` in the Fortnite Tracker database.`
        );
      } else if (epicIgn && !args[0]) {
        await message.reply(
          `Your linked ign \`${epicIgn}\` doesn't seem to exist. Did you update your ign? Try using \`!atw link <your-latest-ign>\`.`
        );
      } else {
        await message.reply(`You haven't linked any fortnite ign to this discord account.`)
      }
    }
    message.channel.stopTyping();
    return;
  }
}

module.exports = KDCommands;
