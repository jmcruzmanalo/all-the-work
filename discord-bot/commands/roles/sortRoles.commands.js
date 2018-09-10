const { Command } = require('discord.js-commando');
const { sortNeededRoles } = require('../../../actions/roles/roles');

class DeservedRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sort-roles',
      memberName: 'sort-roles',
      group: 'roles',
      description: 'Sorts the roles the admin added',
      examples: ['`!atw sort-roles`']
    });
  }

  async run(message, argsString, formPattern) {
    message.channel.startTyping();
    const guildID = message.member.guild.id;

    try {
      await sortNeededRoles({ guildID });
      message.reply(`Finished sorting the roles.`);
    } catch (e) {
      console.log(e);
      throw new Error(
        `There was an error sorting the roles, see console logs.`
      );
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = DeservedRoleCommand;
