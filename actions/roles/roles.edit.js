/**
 * This file will handle the requesting of discord role changes VIA the GUI
 */

const {
  GuildRolesUpdateRequest
} = require('../../database/models/guildRolesUpdateRequest');

const requestRoleUpdate = async ({
  serverId,
  rolesRating,
  requesterDiscordId
}) => {
  if ((!serverId, !rolesRating, !requesterDiscordId))
    throw new Error(`incomplete params`);

  try {
    const guildRoleUpdateRequest = new GuildRolesUpdateRequest({
      serverId,
      rolesRating,
      requesterDiscordId
    });
    await guildRoleUpdateRequest.save();
  } catch (e) {
    throw new Error(`roles.edit.js:requestRoleUpdate() - ${e}`);
  }
};

module.exports = { requestRoleUpdate };
