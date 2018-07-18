
// TODO: Figure out the best location to place this file

const discordAPI = require('../api/discord-api');
const {Role} = require('../database/models/role');;

// These are how roles should be defined. Obviously this "Schema" can be saved later in a database to be dynamic
const ROLES = {
  Senpapi: {
    roleOptions: {
      name: 'Senpapi',
      color: '#0f0e0e', // BLACK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 4,
      max: 6.99
    },
    unique: true // Only one user
  },
  Kouhai: {
    roleOptions: {
      name: 'Kouhai',
      color: '#E91E63', // GREEN
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 3,
      max: 3.99
    }
  },
  Heikin: {
    roleOptions: {
      name: 'Heikin', // Meaning average
      color: '#F8D2F9', // PINK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 1,
      max: 2.99
    }
  },
  DooDoo: {
    roleOptions: {
      name: 'DooDoo',
      color: '#654321', // BROWN like shit
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 0,
      max: 0.99
    }
  }
};

/**
 * Adds all the roles that are missing and required by the bot
 */
const addNeededRoles = async ({ guildID, rolesRange = ROLES }) => {
  const missingRoles = await checkIfRolesExists({ guildID, rolesRange });

  if (missingRoles.length === 0) return true;

  // Add the roles based on the object
  const addPromises = missingRoles.map((missingRole) => {
    return addRole({guildID, role: rolesRange[missingRole]});
  });

  try {
    const addedRoles = await Promise.all(addPromises);
    return addedRoles;
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:addNeededRoles() - ${e}`);
  }
};

/**
 * Removes all the roles that were added by the bot
 */
const removeAddedRoles = async ({ guildID, rolesRange = ROLES}) => {
  const rolesToBeRemoves = Object.keys(rolesRange);

  const removePromises = rolesToBeRemoves.map((roleName) => {
    return removeRole({guildID, role: rolesRange[roleName]});
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
 * @param {String} guildID the guild ID to be searched
 * @param {Object} rolesRange key value pair of [string number]:[name of role] to be checked. These are constants
 * @param {Array} activeRoles the roles that are already in the discord server, if undefined it'll `GET` them
 * @returns {Promise<true|Array>} should return true if all the roles have been found or an array of roles that do not exist
 */
const checkIfRolesExists = async ({ guildID, rolesRange = ROLE_KD_RANGE, activeRoles }) => {
  const roles = Object.keys(rolesRange); // Roles to be searched
  if (!activeRoles) {
    activeRoles = await discordAPI.getRoles(guildID);
  }

  const missingRoles = roles.filter((role) => {
    let isFound = false;
    for (let x = 0; x < activeRoles.length; x++) {
      const completeRole = activeRoles[x]; // a role object sent from the discord API
      if (completeRole.name === role) {
        isFound = true;
        break;
      }
    }
    return !isFound;
  });
  return missingRoles;
};

/**
 * Adds a role given guildID and roleName
 */
const addRole = async ({ guildID, role }) => {
  if (!guildID && !role) throw new Error(`roles.js:addRole() - Please provide a guildID and roleName`);

  /**
   * TODO: The added role should be stored in a database so we can just remove by ID instead of querying the discord api. This will ensure that we don't accidentally remove a role which was renamed. Though in the end it's not support to be that way
   */
  return await discordAPI.addRole(guildID, role.name, { ...role.roleOptions });
};

/**
 * Removes a role based on a name on a guild. It'll also delete duplicates.
 */
const removeRole = async ({ guildID, role }) => {

  if (!role) throw new Error(`roles.js:removeRole() - Please provide a role Object`);

  const roleName = role.name;

  // get all the roles of a certain guild
  const roles = await getRolesByName({ guildID, roleName });

  // loop through all the roles and get the IDs of those that have the same name
  const roleIDs = roles.map((r) => {
    return r.id;
  });

  // Should return a 204
  const deletePromises = roleIDs.map((roleID) => {
    return discordAPI.deleteRole(guildID, roleID);
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
 * Returns an array of roles with the same name in a guild.
 */
const getRolesByName = async ({ guildID, roleName }) => {
  const roles = await discordAPI.getRoles(guildID);
  const res = roles.filter((role) => {
    return role.name === roleName
  });
  return res;
}

module.exports = { addNeededRoles, removeAddedRoles, checkIfRolesExists, getRolesByName, addRole, removeRole };