// TODO: Figure out the best location to place this file
const discordAPI = require('../../api/discord-api');
const { GuildRole } = require('../../database/models/guildRoles');
const {
  ServerRolesConfig
} = require('../../database/models/serverRolesRatingConfig');
const { getRoles } = require('../../api/discord-api');

const syncRoles = async ({serverId, activeRoles}) => {
  await addNeededRoles({serverId, activeRoles});
}

/**
 * Adds all the roles that are missing and required by the bot
 * activeRoles can be null, it'll be checked by checkIfRolesExists
 * @return Array of Discord Role Objects
 */
const addNeededRoles = async ({ serverId, activeRoles }) => {
  try {
    const serverRolesConfig = await ServerRolesConfig.findOne({ serverId });

    if (serverRolesConfig) {
      const neededRoles = serverRolesConfig.getNewRoles();

      const missingRoles = await checkIfRolesExists({
        serverId,
        neededRoles,
        activeRoles
      });

      if (missingRoles.length === 0) return true;

      // Add the roles based on the object
      const addPromises = missingRoles.map(missingRole => {
        const role = neededRoles.find(r => {
          return r.name === missingRole;
        });
        return addRole({ serverId, role });
      });

      const addedRoles = await Promise.all(addPromises);
      return addedRoles;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:addNeededRoles() - ${e}`);
  }
};

/**
 * Removes all the roles that were added by the bot
 */
const removeAddedRoles = async ({ serverId }) => {
  try {
    if (!serverId) throw new Error(`No serverId provided`);
    const serverRolesConfig = await ServerRolesConfig.findOne({ serverId });
    if (serverRolesConfig) {
      const roles = serverRolesConfig.getRolesByRatingType();
      const removePromises = roles
        .filter(role => role.hasOwnProperty('discordRoleObject'))
        .map(role =>
          removeRole({ serverId, roleId: role.discordRoleObject.id })
        );

      await Promise.all(removePromises);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:removeAddedRoles() - ${e}`);
  }
};

/**
 * Checks if the roles exist, this returns an array of roles that did not exist
 * @param {String} serverId the server/guild ID to be searched (discord server)
 * @param {Array} neededRoles An array of roles that are needed
 * @param {Array} activeRoles the roles that are already in the discord server, if undefined it'll `GET` them
 * @returns {Promise<true|Array>} should return true if all the roles have been found or an array of roles that do not exist
 */
const checkIfRolesExists = async ({ serverId, neededRoles, activeRoles }) => {
  const roleNames = neededRoles.map(role => {
    return role.name;
  });

  if (!activeRoles) {
    activeRoles = await discordAPI.getRoles(serverId);
  }

  const missingRoles = roleNames.filter(roleName => {
    let isFound = false;
    for (let x = 0; x < activeRoles.length; x++) {
      const completeRole = activeRoles[x]; // a role object sent from the discord API
      if (completeRole.name === roleName) {
        isFound = true;
        break;
      }
    }
    return !isFound;
  });
  return missingRoles;
};

/**
 * Adds a role given guildID and roleName.
 * @returns DiscordRole Object
 */
const addRole = async ({ serverId, role }) => {
  if (!serverId && !role)
    throw new Error(
      `roles.js:addRole() - Please provide a serverId and roleName`
    );

  const discordRoleObject = await discordAPI.addRole(serverId, role.name, {
    ...role.roleOptions
  });

  await ServerRolesConfig.updateOne(
    {
      serverId: serverId,
      rolesRating: {
        $elemMatch: {
          name: role.name,
          type: role.type
        }
      }
    },
    {
      $set: {
        'rolesRating.$.discordRoleObject': discordRoleObject
      }
    }
  );

  return discordRoleObject;
};

/**
 * Removes a role based on Id. Only the Id is reliable, the name can be edited on the discord side, so to be sure.
 */
const removeRole = async ({ serverId, roleId }) => {
  try {
    if (!serverId || !roleId) {
      throw new Error(`missing parameter serverId or role Id`);
    }
    await discordAPI.deleteRole(serverId, roleId);
    await ServerRolesConfig.updateOne(
      { serverId },
      {
        $pull: {
          rolesRating: {
            'discordRoleObject.id': roleId
          }
        }
      }
    );

    return true;
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:removeRole() - ${e}`);
  }

  // true if response is a 204
};

/**
 * Returns an array of roles with the same name in a guild from the discord API.
 */
const getRolesByName = async ({ serverId, roleName }) => {
  const roles = await discordAPI.getRoles(serverId);
  const res = roles.filter(role => {
    return role.name === roleName;
  });
  return res;
};

// TODO: Setup a mongoose query to get guild roles in the database
// @deprecated
const getGuildRolesInDatabase = async ({ guildID }) => {
  if (!guildID)
    throw new Error(`roles.js:getGuildRolesInDatabase - no guildID provided`);
  const rolesInServer = await GuildRole.find({
    guildID
  });

  return rolesInServer.map(doc => {
    return doc.toObject();
  });
};

// @deprecated
const getServerRolesInDatabase = async serverId => {
  try {
    if (!serverId) throw new Error(`no serverId provided`);
    const doc = await ServerRolesConfig.findOne({
      serverId
    });
    if (doc) {
      return doc;
    } else {
      throw new Error(`Server Roles Config not found for server ${serverId}`);
    }
  } catch (e) {
    throw new Error(`roles.js:getServerRolesInDatabase() - ${e}`);
  }
};

//@deprecated
const setUserRolesInGuild = async ({ guildID, roleID, userID }) => {
  if (!guildID || !userID || !roleID)
    throw new Error(`roles.js:setUserRolesInGuild() - incomplete params`);

  // TODO: When the bot sets a user's role it should also save it.
  try {
    return await discordAPI.setUserRole(guildID, roleID, userID);
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:setUserRolesInGuild() - ${e}`);
  }
};

module.exports = {
  addNeededRoles,
  removeAddedRoles,
  checkIfRolesExists,
  getRolesByName,
  addRole,
  removeRole,
  setUserRolesInGuild,
  getGuildRolesInDatabase,
  getServerRolesInDatabase
};
