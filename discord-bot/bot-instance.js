const path = require('path');
const Discord = require('discord.js');
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
    ['users', 'User Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

module.exports = { bot };