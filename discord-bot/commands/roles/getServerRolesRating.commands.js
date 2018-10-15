const { Command } = require('discord.js-commando');
const { getServerRolesConfig } = require('../../../actions/roles/roles.edit');

class DeservedRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'get-ratings',
      memberName: 'get-ratings',
      group: 'roles',
      description: `Gets the active role-ratings`,
      examples: ['`!atw get-ratings`']
    });
  }

  async run(message) {
    try {
      message.channel.startTyping();
      const serverId = message.guild.id;
      const serverRolesConfig = await getServerRolesConfig(serverId);
      const rolesRating = serverRolesConfig.rolesRating;
      rolesRating.reverse();

      await message.channel.send({
        embed: {
          color: 3447003,
          title: `TRN rating required per role`,
          fields: rolesRating.map(({ name, range: { min, max } }) => {
            return {
              name: name,
              value: `**\`${min} - ${max}\`**`
            };
          })
        }
      });
    } catch (e) {
      throw e;
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = DeservedRoleCommand;
