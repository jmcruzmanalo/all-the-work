// config.file = testShouldRun

require('../database/mongoose'); // This needs to be running

const testConfig = {
  // TDD ?
  'discord-api': false,
  'fortnite-api': false,

  // BDD ?
  kd: false,
  roles: false,
  rolesEdit: false,
  members: false,
  routes: true
};

module.exports = testConfig;
