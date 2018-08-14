// config.file = testShouldRun 

require('../database/mongoose'); // This needs to be running

const testConfig = {
  // TDD ?
  'discord-api': false,
  'fortnite-api': false,

  // BDD ?
  'kd': true,
  'roles': true
};

module.exports = testConfig;