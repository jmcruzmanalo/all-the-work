const path = require('path');
const { Client } = require('discord.js-commando');
const { mongoose } = require('../database/mongoose');

const bot = new Client({
  commandPrefix: '!atw',
  owner: '359314226214600704',
  disabledEveryone: true
});

bot.registry
  .registerDefaultTypes()
  .registerGroups([
    ['kd', 'K/D Commands'],
    ['users', 'User Commands'],
    ['roles', 'Roles Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

module.exports = { bot };