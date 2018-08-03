// config.file = testShouldRun 

const { mongoose } = require('../database/mongoose'); // This needs to be running

const testConfig = {
  // TDD ?
  'discord-api': true,
  'fortnite-api': true,

  // BDD ?
  'kd': true,
  'roles': true
};

module.exports = testConfig;