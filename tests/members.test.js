const expect = require('expect');
const _ = require('lodash');
const { UserLink } = require('../database/models/userLink');
const { MainGuildID, DeveloperDiscordID } = require('../config');
const { linkServerMemberToEpicIGN } = require('../actions/members');

// TODO
describe(`members.js`, () => {
  const clearAllMembers = async () => {
    await UserLink.remove({});
  };

  describe(`UNIT TESTS`, () => {
    beforeEach(clearAllMembers);
    it(`should add a user to the members collection`, async () => {
      const u = {
        serverId: MainGuildID,
        userDiscordId: DeveloperDiscordID,
        epicIGN: 'ATW_Seensei'
      };

      await linkServerMemberToEpicIGN({ ...u });

      const savedUser = await UserLink.findOne({});
      const su = _.pick(savedUser, ['serverId', 'userDiscordId', 'epicIGN']);
      su.stats = _.pick(savedUser.stats, ['latestKD', 'latestTRN']);

      expect(su).toMatchObject({
        ...u,
        stats: {
          latestKD: 0,
          latestTRN: 0
        }
      });
    });
  });

  describe(`BDD Tests`, () => {});
});
