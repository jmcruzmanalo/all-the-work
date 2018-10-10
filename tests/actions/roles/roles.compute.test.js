const expect = require('expect');
const request = require('supertest');
const {
  serverId,
  rolesAsClientUIInput,
  roleNames,
  password,
  userDiscordId
} = require('../../seed/roles.seed');
const {
  removeRolesByNames
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
  describe('BDD - Testing adding role based on stats', () => {
    const { app } = require('../../../index');
    before(async () => {
      await removeRolesByNames(serverId, roleNames);
      await dropAllServerRolesConfig();
      await UserLink.remove({});
    });

    after(async () => {
      // Clear everything to clean the discord server
      // await removeAddedRoles({ serverId });
      // await dropAllServerRolesConfig();
      // await UserLink.remove({});
    });

    describe(`Setup`, () => {
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
          .expect(({ body }) => {
            expect(body).toHaveProperty('rolesRating');
            const rolesRating = body.rolesRating;
            expect(rolesRating.length).toBe(4);
            expect(rolesRating).toContainEqual(
              expect.objectContaining({
                name: expect.anything()
              })
            );
            for (let roleRating of rolesRating) {
              expect(roleRating).toHaveProperty('discordRoleObject');
              expect(roleRating.discordRoleObject.name).toBe(roleRating.name);
            }
          });
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
      describe(`Adding a role for the first time`, () => {
        let deservedRoles = [];
        let invalidRoles = [];
        it(`should check the deserved roles of a player based on a high TRN`, async () => {
          const roles = await getDeservedTRNRole({
            serverId,
            userDiscordId,
            trn: 4900
          });
          expect(roles.deservedRoles).toMatchObject(['TEST0']);
          expect(roles.invalidRoles).toMatchObject(['TEST3', 'TEST2', 'TEST1']);
          deservedRoles = [...roles.deservedRoles];
          invalidRoles = [...roles.invalidRoles];
        });

        it(`should add the valid deserved roles to the user`, async () => {
          // Should not throw an error
          const { addedRoles } = await applyRolesToUser({
            serverId,
            userDiscordId,
            deservedRoles,
            invalidRoles
          });

          expect(addedRoles[0]).toMatchObject({
            name: 'TEST0'
          });
        });
      });

      describe(`Adding a new role and removing the old one due to trn change`, () => {
        let deservedRoles = [];
        let invalidRoles = [];
        it(`should check the deserved roles of a player based on a TRN that is level lower`, async () => {
          const roles = await getDeservedTRNRole({
            serverId,
            userDiscordId,
            trn: 3500
          });
          expect(roles.deservedRoles).toMatchObject(['TEST1']);
          expect(roles.invalidRoles).toMatchObject(['TEST3', 'TEST2', 'TEST0']);
          deservedRoles = [...roles.deservedRoles];
          invalidRoles = [...roles.invalidRoles];
        });
        it(`should add the valid deserved roles to the user`, async () => {
          const { addedRoles, removedRoles } = await applyRolesToUser({
            serverId,
            userDiscordId,
            deservedRoles,
            invalidRoles
          });

          expect(addedRoles[0]).toMatchObject({
            name: 'TEST1'
          });
          expect(removedRoles[0]).toMatchObject({
            name: 'TEST0'
          });
        });
      });
    });
  });
});
