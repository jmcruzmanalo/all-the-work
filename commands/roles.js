
// TODO: Figure out the best location to place this file

const discordAPI = require('../api/discord-api');

const ROLE_KD_RANGE = {
  '0': 'OMAGAD DOO DOO',
  '1': '1 life 1 kill',
  '2': 'You deserve better',
  '3': 'You deserve ATW',
  '4': 'You deserve SENPAPI'
};

/**
 * 
 * @param {String} guildID the guild ID to be searched
 * @param {Object} rolesRange key value pair of [string number]:[name of role] to be checked. These are constants
 * @returns {Promise<true|Array>} should return true if all the roles have been found or an array of roles that do not exist
 */
const checkIfRolesExists = async ({guildID, rolesRange = ROLE_KD_RANGE, activeRoles}) => {
  const roles = Object.values(rolesRange); // Roles to be searched
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
const addRole = async ({guildID, roleName}) => {
  if (!guildID && !roleName) throw new Error(`Error - roles.js:addRole() - Please provide a guildID and roleName`);
  return await discordAPI.addRole(guildID, roleName);
};

/**
 * Removes a role based on a name. It'll also delete duplicates.
 */
const removeRole = async ({roleName}) => {
  
  // Should return a 204
};

module.exports = {ROLE_KD_RANGE, checkIfRolesExists, addRole};