const config = require('../config');
const testConfig = require('./test.config');
const expect = require('expect');
const api = require('../api/discord-api');
const axios = require('axios');

describe(`Discord API JS`, async () => {
  if (!testConfig['discord-api']) return;
  it(`should be able to acquire the roles`, async () => {
    const roles = await api.getRoles(config.MainGuildID);
    expect(roles[0]).toHaveProperty('name');
  });
});