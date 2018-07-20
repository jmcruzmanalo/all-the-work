
const expect = require('expect');
const testConfig = require('./test.config');
const { getKDs, getDeservedRole } = require('../commands/kd');
const { ROLES } = require('../commands/roles');


describe(`KD.js`, () => {
  if (!testConfig['kd']) return;
  describe(`Getting the KD of ATW_Seensei then checking what role he deserves`, () => {
    let userKDs;
    it(`should get the KD of ATW_Seensei`, async () => {
      const kds = await getKDs({ ign: 'ATW_Seensei' });
      expect(kds).toMatchObject({
        solos: 'N/A',
        duos: 3.25,
        squads: 4.17
      });
      userKDs = kds;
    });

    it(`should check what role player deservers`, async () => {
      const role = await getDeservedRole({ ign: 'ATW_Seensei', userKDs});
      expect(role).toMatchObject(ROLES.Senpapi);
    });
  });
});