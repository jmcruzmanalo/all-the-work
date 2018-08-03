const { Command } = require('discord.js-commando');
const { removeAddedRoles } = require('../../../actions/roles');
const { GuildRole } = require('../../../database/models/guildRoles');


class DeservedRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-roles',
      memberName: 'remove-roles',
      group: 'roles',
      description: 'Removes the roles that were added by the bot',
      examples: ['`!atw remove-roles`']
    });
  }

  async run(message, argsString, formPattern) {
    message.channel.startTyping();
    const guildID = message.member.guild.id;

    try {
      await removeAddedRoles({ guildID });
      await GuildRole.remove({
        guildID
      });
      message.reply(`Finished removing the roles`);
    } catch (e) {
      console.log(e);
      throw new Error(`There was an error removing the roles, see console logs.`);
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = DeservedRoleCommand;