const _ = require('lodash');
const { UserLink } = require('../database/models/userLink');
/**
 * Gets the linked accounts in the database based on serverId
 */
const getLinkedServerMembers = async ({ serverId }) => {
  if (!serverId) throw new Error(`No discord server id provided`);

  const users = (await UserLink.find({ guildID: serverId }))
    .map((model) => _.pick(model, ['id', 'epicIGN', 'guildID', 'discordID']));
  return users;

};

/**
 * Links a server member to a specific Epic IGN
 */
const linkServerMemberToEpicIGN = async ({ serverId, userDiscordId, epicIGN }) => {
  if (!serverId || !userDiscordId || !epicIGN) throw new Error(`Either serverId, userDiscordId, or epicIGN was not provided`);

  try {
    const savedUser = await UserLink.updateOne(
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

const updateServerMemberStats = async ({ serverId, userDiscordId, stats = {}}) => {
  if (!serverId || userDiscordId) throw new Error(`Either serverId or epicIGN was not provided`);

  

}

module.exports = {
  getLinkedServerMembers,
  linkServerMemberToEpicIGN,
  updateServerMemberStats
};