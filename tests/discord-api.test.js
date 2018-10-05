const config = require('../config');
const expect = require('expect');
const api = require('../api/discord-api');
const {serverId} = require('./seed/roles.seed');

describe(`Discord API JS`, async () => {
  it(`should be able to acquire the roles`, async () => {
    const roles = await api.getRoles(serverId);
    expect(roles[0]).toHaveProperty('name');
  });
});
