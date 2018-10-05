// API KEY: JhhfPQCUkvCHeJFqM2Bl
// KEY name: eBcZd

const { BotToken } = require('../config');
const { bot } = require('./bot-instance');
const { onReady, onMessage } = require('./bot-events');

module.exports = () => {
  bot.on('ready', onReady);

  bot.on('message', onMessage);

  bot.login(BotToken);
};
