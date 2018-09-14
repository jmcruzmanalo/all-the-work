// TODO: Figure out the best location to place this file
const discordAPI = require('../../api/discord-api');
const { GuildRole } = require('../../database/models/guildRoles');
const {
  ServerRolesConfig
} = require('../../database/models/serverRolesRatingConfig');
const { getRoles } = require('../../api/discord-api');

const arrayChunk = require('array.chunk');

/**
 * Adds all the roles that are missing and required by the bot
 * @return Array of Discord Role Objects
 */
const addNeededRoles = async ({ serverId, activeRoles }) => {
  try {
    const serverRolesConfig = await ServerRolesConfig.findOne({ serverId });

    if (serverRolesConfig) {
      const neededRoles = serverRolesConfig.getRolesByRatingType();
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
  const roles = await (await ServerRolesConfig.findOne({
    serverId
  })).getRolesByRatingType();
  const removePromises = roles.map(role => {
    return removeRole({ serverId, role });
  });

  try {
    await Promise.all(removePromises);
    return true;
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:removeAddedRoles() - ${e}`);
  }
};

/**
 * Checks if the roles exist, this returns an array of roles that did not exist
 * @param {String} serverId the server/guild ID to be searched (discord server)
 * @param {Array} neededRoles An array of role names
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

  const addedRole = await discordAPI.addRole(serverId, role.name, {
    ...role.roleOptions
  });

  return addedRole;
};

/**
 * Removes a role based on a name on a guild. It'll also delete duplicates.
 */
const removeRole = async ({ serverId, role }) => {
  if (!role)
    throw new Error(`roles.js:removeRole() - Please provide a role Object`);

  const roleName = role.name;

  // get all the roles of a certain guild
  const roles = await getRolesByName({ serverId, roleName });

  // loop through all the roles and get the IDs of those that have the same name
  const roleIDs = roles.map(r => {
    return r.id;
  });

  // Should return a 204
  const deletePromises = roleIDs.map(roleID => {
    // TODO: check if this is the best way to run findOneAndRemove
    return discordAPI.deleteRole(serverId, roleID);
  });

  try {
    await Promise.all(deletePromises);
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
// @depracated
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
