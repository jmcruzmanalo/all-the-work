const expect = require('expect');
const config = require('./test.config');
const { MainGuildID, DeveloperDiscordID } = require('../config');
const {
  ServerRolesConfig
} = require('../database/models/serverRolesRatingConfig');
const {
  getServerRolesConfigOrInsert,
  dropAllServerRolesConfig,
  updateServerRolesConfig
} = require('../actions/roles/roles.edit');

describe(`roles.edit.js`, () => {
  if (!config.rolesEdit) return;

  before(async () => {
    await dropAllServerRolesConfig();
  });

  it(`should add a new serverRolesConfig doc`, async () => {
    const serverRolesConfig = await getServerRolesConfigOrInsert({
      serverId: MainGuildID,
      latestRequesterDiscordId: DeveloperDiscordID
    });
    expect(serverRolesConfig.newlyInserted).toBeTruthy();

    const keys = Object.keys(serverRolesConfig);
    expect(keys.includes('_id')).toBeTruthy();
    expect(keys.includes('password')).toBeTruthy();
    expect(keys.includes('serverId')).toBeTruthy();
  });

  it(`should get an already existing serverRolesConfig doc`, async () => {
    const serverRolesConfig = await getServerRolesConfigOrInsert({
      serverId: MainGuildID,
      latestRequesterDiscordId: DeveloperDiscordID
    });
    expect(serverRolesConfig.newlyInserted).toBeFalsy();
    const keys = Object.keys(serverRolesConfig);
    expect(keys.includes('_id')).toBeTruthy();
    expect(keys.includes('password')).toBeTruthy();
    expect(keys.includes('serverId')).toBeTruthy();
  });
});
