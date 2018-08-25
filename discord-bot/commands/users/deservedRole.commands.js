const { Command } = require('discord.js-commando');
const { getDeservedRole } = require('../../../actions/kd');
const { UserLink } = require('../../../database/models/userLink');
const { setUserRolesInGuild } = require('../../../actions/roles');
const { getUserRoles, removeUserRole } = require('../../../api/discord-api');



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
    message.channel.startTyping();
    const discordID = message.author.id;

    const doc = await UserLink.findOne({
      discordID
    });

    if (doc) {
      const guildID = message.member.guild.id;
      const { epicIGN } = doc;

      const roles = await getDeservedRole({
        guildID,
        ign: epicIGN,
        userDiscordId: discordID
      });

      const deservedRole = roles.deservedRoles;

      // Add deserved roles
      if (deservedRole.length === 1) {
        const x = {
          guildID,
          roleID: deservedRole[0].discordRoleObject.id,
          userID: discordID
        };
        await setUserRolesInGuild(x);
        
      } else if (deservedRole.length === 0) {
        message.reply(`Can't find a role you deserve wtf.`);
      } else if (deservedRole.length > 1) {
        message.reply(`You seem to have satisfied multiple roles. Feature not supported yet.`);
      }

      // Remove invalid roles
      const invalidRoles = roles.invalidRoles;
      const currentUserRoles = await getUserRoles(guildID, discordID);

      console.log(invalidRoles);
      console.log(currentUserRoles);

      const invalidRolesInUser = currentUserRoles.filter((activeRole) => {
        for (let x = 0; x < invalidRoles.length; x++) {
          let z = invalidRoles[x];
          if (z.discordRoleObject.id === activeRole) {
            return true;
          } else {
            false;
          }
        }
      });
      console.log(invalidRolesInUser);

      for (let y = 0; y < invalidRolesInUser.length; y++) {
        const invalidRoleId = invalidRolesInUser[y];
        await removeUserRole(guildID, invalidRoleId, discordID);
        
      }

      message.reply(`Role successfully set! Welcome to ${deservedRole[0].discordRoleObject.name}`);

    } else {
      message.reply('No linked account to discordID yafuq. Run: `!atw link your-IGN');
    }
    message.channel.stopTyping();
  }
}

module.exports = DeservedRoleCommand;