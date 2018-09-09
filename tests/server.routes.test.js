const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { MainGuildID, DeveloperDiscordID } = require('../config');
const config = require('./test.config');
const {
  dropAllServerRolesConfig,
  getServerRolesConfigOrInsert
} = require('../actions/roles/roles.edit');

describe(`server.routes.js`, () => {
  if (!config.routes) return;
  const { app } = require('..');

  describe(`/api/servers/:serverId/rolesRating/verifyPassword`, () => {
    const serverConfigValues = {
      serverId: MainGuildID,
      latestRequesterDiscordId: DeveloperDiscordID
    };
    let password = '';

    before(async () => {
      await dropAllServerRolesConfig();
    });
    after(async () => {
      await dropAllServerRolesConfig();
    });

    it(`should add a serverRolesConfig - same command used by the bot`, async () => {
      // Add a server roles config before checking
      const serverRolesConfig = await getServerRolesConfigOrInsert({
        ...serverConfigValues
      });
      const {
        serverId,
        newlyInserted,
        latestRequesterDiscordId
      } = serverRolesConfig;
      password = serverRolesConfig.password;

      expect(newlyInserted).toBeTruthy();
      expect(serverId).toBe(serverConfigValues.serverId);
      expect(password).not.toBeUndefined();
    });

    it(`should make a request to verify the password successfully`, async () => {
      await request(app)
        .post(`/api/servers/${MainGuildID}/rolesRating/verifyPassword`)
        .send({
          password: password
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toMatchObject({ isValid: true });
        });
    });

    it(`should make a request to verify an invalid password`, async () => {
      await request(app)
        .post(`/api/servers/${MainGuildID}/rolesRating/verifyPassword`)
        .send({
          password: 'Random Password'
        })
        .expect(200) // Using a 200 to prevent having to catch errors. Will use a 401 on submit instead
        .expect(res => {
          expect(res.body).toMatchObject({ isValid: false });
        });
    });
  });
});
