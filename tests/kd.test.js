
const expect = require('expect');
const testConfig = require('./test.config');
const { ObjectID } = require('mongodb');
const { getKDs, getDeservedRole } = require('../actions/kd');
const { ROLES } = require('../actions/roles');
const { RolesAsDatabaseResults, TestGuildID } = require('./seed/roles.seed');
const { setUserRole, removeUserRole } = require('../api/discord-api');
const { DeveloperDiscordID, MainGuildID } = require('../config')



describe(`KD.js`, () => {
  if (!testConfig['kd']) return;



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

    it(`should check what role player deservers and add it`, async () => {
      const roles = await getDeservedRole({
        guildID: TestGuildID,
        ign: 'ATW_Seensei',
        userKDs,
        roles: RolesAsDatabaseResults
      });

      const role = roles.deservedRoles;

      expect(role.length).toBe(1);

      expect(role[0]).toMatchObject(RolesAsDatabaseResults[0]);

      // Testing that we can remove a roles from getDeservedRole().invalidRoles
      const invalidRoles = roles.invalidRoles;
      expect(invalidRoles.length).toBe(2);
     

    });

    it(`should add a random role and remove it`, async () => {

    });

  });


  describe(`BEHAVIOR TESTS`, () => {
    // TODO: Add proper tests on the deservedRole Command

    // Setup sample KD range

    // Get the users KD


    // Add the users role based on KD

    // 
  });

});