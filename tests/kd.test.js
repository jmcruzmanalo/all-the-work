
const expect = require('expect');
const testConfig = require('./test.config');
const { ObjectID } = require('mongodb');
const { getKDs, getDeservedRole } = require('../actions/kd');
const { ROLES } = require('../actions/roles');
const { RolesAsDatabaseResults, TestGuildID } = require('./seed/roles.seed');



describe(`KD.js`, () => {
  if (!testConfig['kd']) return;

  describe(`Getting the KD of ATW_Seensei then checking what role he deserves`, () => {

    let userKDs;
    it(`should get the KD of ATW_Seensei`, async () => {
      const kds = await getKDs({ ign: 'ATW_Seensei' });
      expect(kds).toMatchObject({
        solos: 1.17,
        duos: 2.38,
        squads: 4.13
      });
      userKDs = kds;
    });

    it(`should check what role player deservers`, async () => {
      const role = await getDeservedRole({
        guildID: TestGuildID,
        ign: 'ATW_Seensei',
        userKDs,
        roles: RolesAsDatabaseResults
      });

      expect(role.length).toBe(1);

      expect(role[0]).toMatchObject(RolesAsDatabaseResults[0]);
    });
  });

});