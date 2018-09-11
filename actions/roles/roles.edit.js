/**
 * This file will handle the requesting of discord role changes VIA the GUI
 */
const passwordGen = require('generate-password');
const {
  ServerRolesConfig
} = require('../../database/models/serverRolesRatingConfig');

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

const updateServerRolesConfig = async ({
  serverId,
  password,
  rolesRating,
  ratingType
}) => {
  try {
    if (!serverId || !password || !rolesRating)
      throw new Error(`Incomplete params`);

    const serverRoleConfig = await ServerRolesConfig.findOne({
      serverId,
      password
    });

    if (serverRoleConfig) {
      serverRoleConfig.rolesRating = rolesRating;
      serverRoleConfig.ratingType = ratingType;
      await serverRoleConfig.save();
    } else {
      throw new Error(`No matching serverId or password`);
    }
  } catch (e) {
    throw new Error(`roles.edit.js:updateServerRolesConfig() - ${e}`);
  }
};

module.exports = {
  dropAllServerRolesConfig,
  getServerRolesConfigOrInsert,
  updateServerRolesConfig
};
