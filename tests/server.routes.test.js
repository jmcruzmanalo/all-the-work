const expect = require('expect');
const request = require('supertest');
require('mongoose');
const clone = require('clone');
const {
  dropAllServerRolesConfig,
  getServerRolesConfigOrInsert,
  getServerRolesConfig
} = require('../actions/roles/roles.edit');
const { removeRolesByNames } = require('../actions/roles/roles');
const {
  password,
  userDiscordId,
  rolesAsClientUIInput,
  roleNames,
  serverId
} = require('./seed/roles.seed');
const { getRoles } = require('../api/discord-api');

describe('server.routes.js', () => {
  // eslint-disable-next-line global-require
  const { app } = require('..');

  describe('Verify password endpoint - /api/servers/:serverId/rolesRating/verifyPassword', () => {
    before(async () => {
      await removeRolesByNames(serverId, roleNames);
      await dropAllServerRolesConfig();
    });
    it('should add a serverRolesConfig - same command used by the bot', async () => {
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

    it('should make a request to verify the password successfully', async () => {
      await request(app)
        .post(`/api/servers/${serverId}/rolesRating/verifyPassword`)
        .send({
          password
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({ isValid: true });
        });
    });

    it('should make a request to verify an invalid password', async () => {
      await request(app)
        .post(`/api/servers/${serverId}/rolesRating/verifyPassword`)
        .send({
          password: 'Random Password'
        })
        // Using a 200 to prevent having to catch errors. Will use a 401 on submit instead
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({ isValid: false });
        });
    });
  });

  describe('Saving serverRolesConfig - /api/servers/:serverId/requestUpdateRolesRating', () => {
    before(async () => {
      await removeRolesByNames(serverId, roleNames);
      await dropAllServerRolesConfig();
    });

    it('should add a serverRolesConfig - same command used by the bot', async () => {
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

    it('should update the server roles config with the received data from the client', async () => {
      await request(app)
        .post(`/api/servers/${serverId}/requestUpdateRolesRating`)
        .send({
          password,
          serverRatingEditValues: rolesAsClientUIInput
        })
        .expect(200)
        .expect((response) => {
          const { body } = response;
          const { rolesRating } = body;
          const values = Object.values(rolesRating);
          values.forEach((roleRating) => {
            expect(roleRating).toHaveProperty('discordRoleObject');
            expect(roleRating.discordRoleObject).toMatchObject({
              name: expect.anything()
            });
          });
        });
    });

    describe('Using the current serverRolesConfig', () => {
      it('should add a new role and add it to the discord server', async () => {
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
          .expect((response) => {
            const body = response.body;
            const rolesRating = body.rolesRating;
            for (const roleRating of rolesRating) {
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
        expect(serverRolesConfigUpdated.rolesRating).toMatchObject(updateInput.rolesRating);
      });

      it('should remove one of the roles', async () => {
        const serverRolesConfigUpdated = clone(await getServerRolesConfig(serverId), false);
        const updateInput = {
          rolesRating: serverRolesConfigUpdated.rolesRating,
          ratingType: serverRolesConfigUpdated.ratingType
        };
        const { rolesRating } = updateInput;
        // Splicing TEST1
        rolesRating.splice(3, 1);
        rolesRating[2].range.max = rolesRating[3].range.min - 1;

        let latestRolesRating;
        let latestRemovedRoles;
        await request(app)
          .post(`/api/servers/${serverId}/requestUpdateRolesRating`)
          .send({
            password,
            serverRatingEditValues: updateInput
          })
          .expect(200)
          .expect((response) => {
            const body = response.body;
            const rolesRating = body.rolesRating;
            const removedRoles = body.removedRoles;
            const x = rolesRating.find((role) => {
              role.name === 'TEST1';
            });
            expect(x).toBeUndefined();
            expect(removedRoles[0].name).toBe('TEST1');

            latestRolesRating = rolesRating;
            latestRemovedRoles = removedRoles;
          });

        // Expect the role to not be in the database
        const latestServerRolesRating = await getServerRolesConfig(serverId);
        expect(latestServerRolesRating.rolesRating).toMatchObject(latestRolesRating);

        // Expect the role to no exist in the discord server
        const currentServerRoles = await getRoles(serverId);
        const isFound = currentServerRoles.find((role) => {
          role.id === latestRemovedRoles[0].id;
        });
        expect(isFound).toBeUndefined();
      });

      it('should change the name of one of the roles', async () => {});
    });
  });
});
