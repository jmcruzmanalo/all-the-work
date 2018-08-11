
// TODO: Figure out the best location to place this file

const discordAPI = require('../api/discord-api');
const { GuildRole } = require('../database/models/guildRoles');
const arrayChunk = require('array.chunk');

/**
 * TODO: These roles should now be defined by the user (admin of the discord server)
 * These are how roles should be defined. Obviously this "Schema" can be saved later in a database to be dynamic
 */
const ROLES = [
  {
    name: 'Senpapi',
    roleOptions: {
      color: '#0f0e0e', // BLACK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 4,
      max: 6.99
    },
    position: 1,
    unique: true // Only one user
  },
  {
    name: 'Kouhai',
    roleOptions: {
      color: '#E91E63', // GREEN
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 3,
      max: 3.99
    },
    position: 2
  },
  {
    name: 'Heikin', // Meaning average
    roleOptions: {
      color: '#F8D2F9', // PINK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 1,
      max: 2.99
    },
    position: 3
  },
  {
    name: 'DooDoo',
    roleOptions: {
      color: '#654321', // BROWN like shit
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 0,
      max: 0.99
    },
    position: 4
  }
];

/**
 * Adds all the roles that are missing and required by the bot
 * @return Array of Discord Role Objects
 */
const addNeededRoles = async ({ guildID, rolesInput = ROLES }) => {
  const missingRoles = await checkIfRolesExists({ guildID, roles: rolesInput });

  if (missingRoles.length === 0) return true;

  // Add the roles based on the object
  const addPromises = missingRoles.map((missingRole) => {
    const role = rolesInput.find((r) => {
      return r.name === missingRole;
    });
    return addRole({ guildID, role });
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
 * Sorts all the roles of the guild by the inputted position
 */
const sortNeededRoles = async ({ guildID }) => {
  try {
    // Get roles in database
    const rolesInDatabase = await GuildRole.find({
      guildID
    }).lean();

    // Get roles in the server
    const rolesInGuild = await discordAPI.getRoles(guildID);

    // Sort the roles from the database
    rolesInDatabase.sort((a, b) => {
      return a.position - b.position
    });

    let highestRole = Math.max.apply(Math, rolesInGuild.map((role) => {
      if (role.managed) {
        return 0;
      } else {
        return role.position
      }
    }));


    const positions = rolesInDatabase.map((role) => {
      let t = highestRole - role.position + 1;
      if (t % 2 === 0) {
        t++;
      }
      return {
        id: role.discordRoleObject.id,
        position:  t
      };
    });

    let nextPosition = 0;
    // const chunkedPositions = arrayChunk(positions, 2);
    for (let x = 0; x < positions.length; x++) {
      const position = positions[x];
      const newPositions = await discordAPI.applyGuildPositions(guildID, [position]);
      const currentPosition = newPositions.find((p) => {
        return p.id === position.id;
      });
      if (currentPosition.position < position.position ) {
        await discordAPI.applyGuildPositions(guildID, [{
          id: currentPosition.id,
          position: position.position + 1
        }]);
      }

    }

    return true;
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:sortNeededRoles() - ${e}`)
  }

};

/**
 * Removes all the roles that were added by the bot
 */
const removeAddedRoles = async ({ guildID }) => {

  const roles = await getGuildRolesInDatabase({ guildID });
  const removePromises = roles.map((role) => {
    return removeRole({ guildID, role });
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
 * @param {Array} roleNames An array of role names
 * @param {Array} activeRoles the roles that are already in the discord server, if undefined it'll `GET` them
 * @returns {Promise<true|Array>} should return true if all the roles have been found or an array of roles that do not exist
 */
const checkIfRolesExists = async ({ guildID, roles, activeRoles }) => {
  const roleNames = roles.map((role) => {
    return role.name;
  });

  if (!activeRoles) {
    activeRoles = await discordAPI.getRoles(guildID);
  }

  const missingRoles = roleNames.filter((roleName) => {
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
const addRole = async ({ guildID, role }) => {
  if (!guildID && !role) throw new Error(`roles.js:addRole() - Please provide a guildID and roleName`);

  const addedRole = await discordAPI.addRole(guildID, role.name, { ...role.roleOptions });

  const d = {
    name: role.name,
    guildID,
    discordRoleObject: addedRole,
    roleOptions: role.roleOptions,
    kdRange: role.kdRange,
  }
  if (role.unique) d.unique = role.unique;
  if (role.position) d.position = role.position;

  const guildRole = new GuildRole(d);

  /**
   * TODO: Someday we might not need to wait for save() to finish. We'll check though once needed.
   */
  await guildRole.save();


  return addedRole;
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

    // TODO: check if this is the best way to run findOneAndRemove
    const dbRemovePromise = new Promise(async (resolve, reject) => {
      const removedRole = await GuildRole.findOneAndRemove({
        guildID,
        'discordRoleObject.id': roleID
      });
      if (removedRole) {
        resolve();
      } else {
        reject(`Role that should have been removed could not be found in the database.`);
      }
    });

    const p = [
      dbRemovePromise,
      discordAPI.deleteRole(guildID, roleID)
    ];

    return Promise.all(p);
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
const getRolesByName = async ({ guildID, roleName }) => {
  const roles = await discordAPI.getRoles(guildID);
  const res = roles.filter((role) => {
    return role.name === roleName
  });
  return res;
}

// TODO: Setup a mongoose query to get guild roles in the database
const getGuildRolesInDatabase = async ({ guildID }) => {
  if (!guildID) throw new Error(`roles.js:getGuildRolesInDatabase - no guildID provided`);
  const rolesInServer = await GuildRole.find({
    guildID
  });


  return rolesInServer.map((doc) => {
    return doc.toObject();
  });
};

const setUserRolesInGuild = async ({ guildID, roleID, userID }) => {
  if (!guildID || !userID || !roleID) throw new Error(`roles.js:setUserRolesInGuild() - incomplete params`);

  // TODO: When the bot sets a user's role it should also save it.
  try {
    return await discordAPI.setUserRole(guildID, roleID, userID);
  } catch (e) {
    console.log(e);
    throw new Error(`roles.js:setUserRolesInGuild() - ${e}`);
  }

};




module.exports = {
  ROLES, addNeededRoles, removeAddedRoles, checkIfRolesExists, sortNeededRoles,
  getRolesByName, addRole, removeRole, setUserRolesInGuild, getGuildRolesInDatabase
};