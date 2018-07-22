const { Command } = require('discord.js-commando');


class KDCommands extends Command {
  constructor(client) {
    super(client, {
      name: 'kd',
      group: 'kd',
      memberName: 'test',
      description: 'A Test command',
      examples: ['`!atw `']
    });
  }

  run(message) {
    return message.reply(`A Test command`);
  }
}

module.exports = KDCommands;