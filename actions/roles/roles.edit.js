/**
 * This file will handle the requesting of discord role changes VIA the GUI AND mainly the serverRolesConfig
 */
const passwordGen = require('generate-password');
const {
  ServerRolesConfig
} = require('../../database/models/serverRolesRatingConfig');
const has = require('lodash/has');

/**
 * Drop all server roles config in database
 */
const dropAllServerRolesConfig = async () => {
  await ServerRolesConfig.remove({});
};

/**
 * Fetches or inserts the server roles config
 */
const getServerRolesConfigOrInsert = async ({
  serverId = null,
  latestRequesterDiscordId = null,
  password
}) => {
  try {
    if (!serverId || !latestRequesterDiscordId)
      throw new Error(`No serverId or latestRequesterDiscordId passed`);

    if (!password) {
      password = passwordGen.generate({
        length: 16,
        numbers: true,
        symbols: true
      });
    }

    let serverRolesConfig = await ServerRolesConfig.findOne({ serverId });

    if (serverRolesConfig) {
      const r = serverRolesConfig.toObject();
      r.newlyInserted = false;
      return r;
    } else {
      serverRolesConfig = new ServerRolesConfig({
        serverId,
        password,
        lastUpdatedBy: latestRequesterDiscordId
      });
      await serverRolesConfig.save();
    }
    const r = serverRolesConfig.toObject();
    r.newlyInserted = true; // Want to avoid conflict with mongoose
    return r;
  } catch (e) {
    throw new Error(`roles.edit.js:getServerRolesConfigOrInsert() - ${e}`);
  }
};

/**
 * Used to update the serverRolesConfig of a server. It will also return the deleted roles.
 */
const updateServerRolesConfig = async ({
  serverId,
  password,
  rolesRating,
  ratingType
}) => {
  try {
    if (!serverId || !password || !rolesRating || !ratingType)
      throw new Error(`Incomplete params`);

    const serverRolesConfig = await ServerRolesConfig.findOne({
      serverId,
      password
    });

    if (serverRolesConfig) {
      const serverRolesConfigClone = serverRolesConfig.toObject();
      const removedRoles = serverRolesConfigClone.rolesRating.filter(role => {
        if (has(role, 'discordRoleObject.id')) {
          const x = rolesRating.find(r => {
            if (!has(r, 'discordRoleObject.id')) return false; 
            return role.discordRoleObject.id === r.discordRoleObject.id;
          });
          return !x;
        }
      });

      serverRolesConfig.rolesRating = rolesRating;
      serverRolesConfig.ratingType = ratingType;
      await serverRolesConfig.save();
      return removedRoles;
    } else {
      throw new Error(`No matching serverId or password`);
    }
  } catch (e) {
    throw new Error(`roles.edit.js:updateServerRolesConfig() - ${e}`);
  }
};

const getServerRolesConfig = async serverId => {
  try {
    if (!serverId) throw new Error(`Missing serverId param`);
    const serverRolesConfig = await ServerRolesConfig.findOne({
      serverId
    }).select({
      _id: 0,
      __v: 0,
      password: 0,
      lastUpdatedBy: 0,
      'rolesRating._id': 0
    });
    if (serverRolesConfig) {
      return serverRolesConfig.toObject();
    }
    return false;
  } catch (e) {
    throw new Error(`roles.edit.js:getServerRolesRating() - ${e}`);
  }
};

module.exports = {
  dropAllServerRolesConfig,
  getServerRolesConfigOrInsert,
  updateServerRolesConfig,
  getServerRolesConfig
};
