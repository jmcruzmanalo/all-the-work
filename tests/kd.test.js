
const expect = require('expect');
const testConfig = require('./test.config');
const { ObjectID } = require('mongodb');
const { getKDs, getDeservedRole } = require('../actions/kd');
const { ROLES } = require('../actions/roles');
const { testDocRoles, sampleGuildID } = require('./seed/testDocRoles');



describe(`KD.js`, () => {
  if (!testConfig['kd']) return;


  describe(`Getting the KD of ATW_Seensei then checking what role he deserves`, () => {

    let userKDs;
    it(`should get the KD of ATW_Seensei`, async () => {
      const kds = await getKDs({ ign: 'ATW_Seensei' });
      expect(kds).toMatchObject({
        solos: 'N/A',
        duos: 2.25,
        squads: 4.26
      });
      userKDs = kds;
    });

    it(`should check what role player deservers`, async () => {
      const role = await getDeservedRole({
        guildID: sampleGuildID,
        ign: 'ATW_Seensei',
        userKDs,
        roles: testDocRoles
      });

      expect(role.length).toBe(1);

      expect(role[0]).toMatchObject(testDocRoles[0]);
    });
  });

});