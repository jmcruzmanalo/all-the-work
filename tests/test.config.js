// config.file = testShouldRun

require('../database/mongoose'); // This needs to be running

const testConfig = {
  // TDD ?
  'discord-api': true,
  'fortnite-api': true,

  // BDD ?
  kd: true,
  roles: true,
  members: true
};

module.exports = testConfig;
