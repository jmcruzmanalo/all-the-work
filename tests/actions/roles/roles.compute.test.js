const expect = require('expect');
const request = require('supertest');
const {
  serverId,
  rolesAsClientUIInput,
  password,
  userDiscordId
} = require('../../seed/roles.seed');
const {
  addNeededRoles,
  removeAddedRoles
} = require('../../../actions/roles/roles');
const {
  dropAllServerRolesConfig,
  getServerRolesConfigOrInsert
} = require('../../../actions/roles/roles.edit');
const { linkServerMemberToEpicIGN } = require('../../../actions/members');
const {
  getDeservedTRNRole,
  applyRolesToUser
} = require('../../../actions/roles/roles.compute');
const { UserLink } = require('../../../database/models/userLink');

describe.only('actions/roles.compute.js', () => {
  describe('BDD - Testing adding role based on KD', () => {
    const { app } = require('../../../index');
    before(async () => {
      await removeAddedRoles({ serverId });
      await dropAllServerRolesConfig();
      await UserLink.remove({});
    });

    describe(`Setup initial data first`, () => {
      it(`should setup the data first`, async () => {
        await getServerRolesConfigOrInsert({
          serverId,
          latestRequesterDiscordId: userDiscordId,
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

      it(`should link ATW_Seensei to discord user first id - ${userDiscordId}`, async () => {
        await linkServerMemberToEpicIGN({
          serverId,
          userDiscordId,
          epicIGN: 'ATW_Seensei'
        });
      });
    });

    describe(`Adding a role based on Player stats and serverRolesConfig`, () => {
      let deservedRoles = [];
      let invalidRoles = [];
      it(`should check the deserved roles of a player based on TRN`, async () => {
        const roles = await getDeservedTRNRole({
          serverId,
          userDiscordId
        });
        expect(roles.deservedRoles).toMatchObject(['TEST0']);
        expect(roles.invalidRoles).toMatchObject(['TEST3', 'TEST2', 'TEST1']);
        deservedRoles = [...roles.deservedRoles];
        invalidRoles = [...roles.invalidRoles];
      });

      it(`should add the valid deserved roles to the user`, async () => {
        // Should not throw an error
        await applyRolesToUser({
          serverId,
          userDiscordId,
          deservedRoles,
          invalidRoles
        });

        // Add assertion that the roles was added
      });

      it(`should remove the invalid roles by the same function "applyRolesToUser"`, async () => {
        // Add assertion that the roles were removed
      });
    });
  });
});
