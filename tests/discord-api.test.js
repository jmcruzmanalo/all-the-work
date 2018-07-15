const config = require('../config');
const expect = require('expect');
const api = require('../api/discord-api');
const axios = require('axios');

describe(`Discord API JS`, async () => {
  it(`should be able to aquire the roles`, async () => {
    const roles = await api.getRoles(config.MainGuildID);
    expect(roles[0]).toHaveProperty('name');
  });
});