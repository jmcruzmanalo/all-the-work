const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const {
  dropAllServerRolesConfig,
  getServerRolesConfigOrInsert,
  getServerRolesConfig,
  updateServerRolesConfig
} = require('../actions/roles/roles.edit');
const { removeAddedRoles, removeRolesByNames } = require('../actions/roles/roles');
const {
  password,
  userDiscordId,
  rolesAsClientUIInput,
  roleNames,
  serverId
} = require('./seed/roles.seed');
const clone = require('clone');

describe.only(`server.routes.js`, () => {
  const { app } = require('..');

  describe(`Verify password endpoint - /api/servers/:serverId/rolesRating/verifyPassword`, () => {
    before(async () => {
      await removeRolesByNames(serverId, roleNames);
      await dropAllServerRolesConfig();
    });
    it(`should add a serverRolesConfig - same command used by the bot`, async () => {
      // Add a server roles config before checking
      const serverRolesConfig = await getServerRolesConfigOrInsert({
        serverId,
        latestRequesterDiscordId: userDiscordId,
        password
      });
      expect(serverRolesConfig.newlyInserted).toBeTruthy();
      expect(serverRolesConfig.serverId).toBe(serverId);
      expect(serverRolesConfig.password).toBe(password);
    });

    it(`should make a request to verify the password successfully`, async () => {
      await request(app)
        .post(`/api/servers/${serverId}/rolesRating/verifyPassword`)
        .send({
          password
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toMatchObject({ isValid: true });
        });
    });

    it(`should make a request to verify an invalid password`, async () => {
      await request(app)
        .post(`/api/servers/${serverId}/rolesRating/verifyPassword`)
        .send({
          password: 'Random Password'
        })
        .expect(200) // Using a 200 to prevent having to catch errors. Will use a 401 on submit instead
        .expect(res => {
          expect(res.body).toMatchObject({ isValid: false });
        });
    });
  });

  describe(`Saving serverRolesConfig - /api/servers/:serverId/requestUpdateRolesRating`, () => {
    before(async () => {
      await removeRolesByNames(serverId, roleNames);
      await dropAllServerRolesConfig();
    });

    it(`should add a serverRolesConfig - same command used by the bot`, async () => {
      // Add a server roles config before checking
      const serverRolesConfig = await getServerRolesConfigOrInsert({
        serverId,
        latestRequesterDiscordId: userDiscordId,
        password
      });
      expect(serverRolesConfig.newlyInserted).toBeTruthy();
      expect(serverRolesConfig.serverId).toBe(serverId);
      expect(serverRolesConfig.password).toBe(password);
    });

    it(`should update the server roles config with the received data from the client`, async () => {
      await request(app)
        .post(`/api/servers/${serverId}/requestUpdateRolesRating`)
        .send({
          password,
          serverRatingEditValues: rolesAsClientUIInput
        })
        .expect(200)
        .expect(response => {
          const body = response.body;
          const rolesRating = body.rolesRating;
          for (let roleRating of rolesRating) {
            expect(roleRating).toHaveProperty('discordRoleObject');
            expect(roleRating.discordRoleObject).toMatchObject({
              name: expect.anything()
            });
          }
        });
    });

    describe(`Using the current serverRolesConfig`, () => {
      it(`should add a new role and add it to the discord server`, async () => {
        const serverRolesConfig = await getServerRolesConfig(serverId);
        const updateInput = clone(serverRolesConfig, false);
        delete updateInput.serverId;
        updateInput.rolesRating.unshift({
          name: 'TEST4',
          range: {
            min: 0,
            max: 500
          },
          type: 'TRN Rating'
        });
        updateInput.rolesRating[1].range.min = 501;

        await request(app)
          .post(`/api/servers/${serverId}/requestUpdateRolesRating`)
          .send({
            password,
            serverRatingEditValues: updateInput
          })
          .expect(200)
          .expect(response => {
            const body = response.body;
            const rolesRating = body.rolesRating;
            for (let roleRating of rolesRating) {
              expect(roleRating).toHaveProperty('discordRoleObject');
              expect(roleRating.discordRoleObject).toMatchObject({
                name: expect.anything()
              });
            }
            expect(rolesRating[0]).toMatchObject({
              discordRoleObject: expect.any(Object),
              name: expect.any(String),
              range: expect.any(Object),
              type: expect.any(String)
            });
          });

        const serverRolesConfigUpdated = await getServerRolesConfig(serverId);
        expect(serverRolesConfigUpdated.rolesRating).toMatchObject(
          updateInput.rolesRating
        );
      });

      it(`should remove one of the roles`, async () => {
        const serverRolesConfigUpdated = clone(
          await getServerRolesConfig(serverId),
          false
        );
        const updateInput = {
          rolesRating: serverRolesConfigUpdated.rolesRating,
          ratingType: serverRolesConfigUpdated.ratingType
        };
        const { rolesRating } = updateInput;
        // Splicing TEST1
        rolesRating.splice(3, 1);
        rolesRating[2].range.max = rolesRating[3].range.min - 1;

        await request(app)
          .post(`/api/servers/${serverId}/requestUpdateRolesRating`)
          .send({
            password,
            serverRatingEditValues: updateInput
          })
          .expect(200)
          .expect(response => {
            const body = response.body;
            const rolesRating = body.rolesRating;

            const x = rolesRating.find(role => {
              role.name === 'TEST1'
            });
            expect(x).toBeUndefined();
            expect(body.removedRoles[0].name).toBe('TEST1');

            // Expect the role to not be in the database
            // Expect the role to no exist in the discord server

          });
      });

      it(`should change the name of one of the roles`, async () => {});
    });
  });
});
