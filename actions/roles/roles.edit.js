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
  latestRequesterDiscordId = null
}) => {
  if (!serverId || !latestRequesterDiscordId)
    throw new Error(`No serverId or latestRequesterDiscordId passed`);

  const password = passwordGen.generate({
    length: 16,
    numbers: true,
    symbols: true
  });

  try {
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

module.exports = {
  dropAllServerRolesConfig,
  getServerRolesConfigOrInsert
};
