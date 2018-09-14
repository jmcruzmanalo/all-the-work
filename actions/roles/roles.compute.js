const { getStats } = require('../../api/fortnite-api');
const { getEpicIgnWithDiscordId } = require('../members');
const {
  ServerRolesConfig
} = require('../../database/models/serverRolesRatingConfig');
const {
  getRoles,
  getUserRoles,
  setUserRole
} = require('../../api/discord-api');

const compareRoles = (rating, ranges) => {
  const deservedRoles = [];
  const invalidRoles = [];
  ranges.forEach(role => {
    const { min, max } = role.range;

    if (rating > min && rating < max) {
      deservedRoles.push(role.name);
    } else {
      invalidRoles.push(role.name);
    }
  });
  return {
    deservedRoles,
    invalidRoles
  };
};

const getTRN = async epicIGN => {
  try {
    if (!epicIGN) throw new Error(`no epicIGN provided`);
    const stats = await getStats({ ign: epicIGN });
    if (!stats) {
      return false;
    }

    const trnRating = stats.curr_p9.trnRating.valueInt;

    // TODO: Run an async task that saves this value to the userLink

    return trnRating;
  } catch (e) {
    throw new Error(`roles.compute.js:getTRN() - ${e}`);
  }
};

const applyRolesToUser = async ({
  serverId,
  userDiscordId,
  activeUserRoles,
  deservedRoles = [],
  invalidRoles = []
}) => {
  try {
    if (!serverId || !userDiscordId)
      throw new Error(`No userDiscordId or serverId provided`);

    activeUserRoles = activeUserRoles
      ? activeUserRoles
      : await getUserRoles(serverId, userDiscordId);

    const activeServerRoles = await getRoles(serverId);

    const activeUserRoleIds = activeServerRoles
      .filter(role => deservedRoles.includes(role.name))
      .map(role => role.id);

    for (roleId of activeUserRoleIds) {
      await setUserRole(serverId, roleId, userDiscordId);
    }
  } catch (e) {
    throw new Error(`roles.compute.js:applyRolesToUser() - ${e}`);
  }
};

const getDeservedTRNRole = async ({ serverId, userDiscordId }) => {
  try {
    if (!serverId || !userDiscordId) throw new Error(`Incomplete params`);

    const epicIGN = await getEpicIgnWithDiscordId(userDiscordId);
    if (!epicIGN) {
      return {
        error: `You haven't linked an epic IGN to this discord account yafuq. Use \`!atw link <epic IGN>\`.`
      };
    }
    const trn = await getTRN(epicIGN);

    if (!trn) {
      return {
        error: `Could not find your linked epic IGN in fortnite tracker's database`
      };
    }

    const serverRoleConfig = await ServerRolesConfig.findOne({
      serverId
    });

    if (!serverRoleConfig) {
      return {
        error: `Could not find server roles config. This means the admin hasn't setup any roles yet.`
      };
    }

    const rolesRating = serverRoleConfig.getRolesByRatingType();

    const roles = compareRoles(trn, rolesRating);
    return roles;
  } catch (e) {
    throw new Error(`roles.compute.js:getDeservedTRNRole() - ${e}`);
  }
};
module.exports = { getDeservedTRNRole, applyRolesToUser };
