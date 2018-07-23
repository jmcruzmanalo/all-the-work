const { Command } = require('discord.js-commando');
const { getDeservedRole } = require('../../../actions/kd');
const { UserLink } = require('../../../database/models/userLink');


class DeservedRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'where-do-i-belong',
      memberName: 'where-do-i-belong',
      group: 'users',
      description: 'Figures out what role you deserve based on KD',
      examples: ['`!atw where-do-i-belong`']
    });
  }

  async run(message, argsString, formPattern) {
    const discordID = message.author.id;

    const doc = await UserLink.findOne({
      discordID
    });

    if (doc) {
      const { epicIGN } = doc;
      const deservedRole = await getDeservedRole({ ign: epicIGN });
      const test = JSON.stringify(deservedRole, undefined, 2).trim();
      message.reply(`
      \`\`\`
      ${test}
      \`\`\`
      `);
    } else {
      message.reply('No linked account to discordID yafuq. Run: `!atw link your-IGN');
    }


    // await getDeservedRole({});
  }
}

module.exports = DeservedRoleCommand;