// config.file = testShouldRun 

const { mongoose } = require('../database/mongoose'); // This needs to be running

const testConfig = {
  // TDD ?
  'discord-api': false,
  'fortnite-api': false,

  // BDD ?
  'kd': false,
  'roles': true
};

module.exports = testConfig;