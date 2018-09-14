const expect = require('expect');
const request = require('supertest');
const {
  getServerRolesConfigOrInsert,
  dropAllServerRolesConfig
} = require('../../../actions/roles/roles.edit');
const {
  addNeededRoles,
  removeAddedRoles
} = require('../../../actions/roles/roles');
const {
  password,
  serverId,
  rolesAsClientUIInput
} = require('../../seed/roles.seed');

describe('actions/roles.js', () => {
  describe('BDD - Testing on bot login', () => {
    const { app } = require('../../../index');

    before(async () => {
      await dropAllServerRolesConfig();
    });

    it(`should first setup the data`, async () => {
      // Run getServerRolesConfigOrInsert to setup the serverRolesConfig
      await getServerRolesConfigOrInsert({
        serverId,
        latestRequesterDiscordId: '123456789',
        password
      });

      // User the express server to fill it with data
      await request(app)
        .post(`/api/servers/${serverId}/requestUpdateRolesRating`)
        .send({
          password,
          serverRatingEditValues: rolesAsClientUIInput
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toMatchObject({
            message: 'Finished updating the database'
          });
        });
    });

    // Based on the data now in the test database, check with the actual server what is missing. What the Bot would use
    it(`should add the missing roles to the actual server`, async () => {
      const response = await addNeededRoles({
        serverId
      });
      expect(response.length).toBe(4);
      expect(response).toContainEqual(
        expect.objectContaining({
          name: expect.anything()
        })
      );
    });

    it(`should remove the roles that were added by the bot`, async () => {
      const response = await removeAddedRoles({ serverId });
      expect(response).true;
    });
  });
});
