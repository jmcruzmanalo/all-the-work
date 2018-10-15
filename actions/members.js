const _ = require('lodash');
const { UserLink } = require('../database/models/userLink');
/**
 * Gets the linked accounts in the database based on serverId
 */
// @depracated
const getLinkedServerMembers = async ({ serverId }) => {
  if (!serverId) throw new Error(`No discord server id provided`);

  const users = (await UserLink.find({ guildID: serverId })).map(model =>
    _.pick(model, ['id', 'epicIGN', 'guildID', 'discordID'])
  );
  return users;
};

/**
 * Links a server member to a specific Epic IGN
 */
const linkServerMemberToEpicIGN = async ({
  serverId,
  userDiscordId,
  epicIGN
}) => {
  if (!serverId || !userDiscordId || !epicIGN)
    throw new Error(
      `Either serverId, userDiscordId, or epicIGN was not provided`
    );

  try {
    return await UserLink.updateOne(
      {
        serverId,
        userDiscordId
      },
      {
        serverId,
        userDiscordId,
        epicIGN
      },
      {
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
  } catch (e) {
    throw new Error(`members.js:linkServerMemberToEpicIGN() - ${e}`);
  }
};

// TODO
const updateServerMemberStats = async ({
  serverId,
  userDiscordId,
  stats = {}
}) => {
  if (!serverId || userDiscordId)
    throw new Error(`Either serverId or epicIGN was not provided`);
};

const getEpicIgnWithDiscordId = async userDiscordId => {
  try {
    if (!userDiscordId) throw new Error(`No userDiscordId provided`);

    const userLink = await UserLink.findOne({
      userDiscordId
    });

    if (userLink) {
      return userLink.epicIGN;
    }
    return false;
  } catch (e) {
    throw new Error(`members.js:getEpicIgnWithDiscordId() - ${e}`);
  }
};

const getAllUserLinks = async serverId => {
  try {
    if (!serverId) throw new Error(`missing serverId parameter`);
    const userDocs = await UserLink.find({ serverId }).select({
      _id: 0,
      __v: 0,
      serverId: 0,
      'stats._id': 0
    });
    const userLinks = userDocs.map(link => link.toObject());
    return userLinks;
  } catch (e) {
    throw new Error(`members.js:getAllUserLinks() - ${e}`);
  }
};

module.exports = {
  getLinkedServerMembers,
  getEpicIgnWithDiscordId,
  linkServerMemberToEpicIGN,
  updateServerMemberStats,
  getAllUserLinks
};
