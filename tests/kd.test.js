const expect = require('expect');
const { ObjectID } = require('mongodb');
const { getKDs, getTRN, getDeservedRole } = require('../actions/kd');
const { RolesAsDatabaseResults, TestGuildID } = require('./seed/roles.seed');
const { setUserRole, removeUserRole } = require('../api/discord-api');
const { DeveloperDiscordID, MainGuildID } = require('../config');

describe(`KD.js`, () => {
  describe(`Getting the KD of ATW_Seensei then checking what role he deserves`, () => {
    let userKDs;
    it(`should get the KD of ATW_Seensei`, async () => {
      const kds = await getKDs({ ign: 'ATW_Seensei' });
      // TODO: For now expect anything as long as it exists I guess.
      expect(kds).toMatchObject({
        solos: expect.anything(),
        duos: expect.anything(),
        squads: expect.anything()
      });
      userKDs = kds;
    });

    // TODO: Fix this test. It's not a very clean one. It depends on previous runs.
    it(`should check what role player deservers and add it based on KD`, async () => {
      const roles = await getDeservedRole({
        guildID: TestGuildID,
        ign: 'ATW_Seensei',
        userKDs,
        roles: RolesAsDatabaseResults
      });

      const role = roles.deservedRoles;

      expect(role.length).toBe(1);

      expect(role[0]).toMatchObject(RolesAsDatabaseResults[1]);

      // Testing that we can remove a roles from getDeservedRole().invalidRoles
      const invalidRoles = roles.invalidRoles;
      expect(invalidRoles.length).toBe(2);
    });
  });

  describe(`Getting the TRN of ATW_Seensei then checking what role he deserves`, () => {
    it(`should get the TRN of ATW_Seensei`, async () => {
      const trn = await getTRN({ epicIGN: 'ATW_Seensei' });
      expect(typeof trn).toBe('number');
    });
  });
});
