/**
 * This file will handle the requesting of discord role changes VIA the GUI
 */

import GuildRolesUpdateRequest from '../../database/models/guildRolesUpdateRequest';

export const requestRoleUpdate = async ({
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
