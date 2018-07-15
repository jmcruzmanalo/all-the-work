// API KEY: JhhfPQCUkvCHeJFqM2Bl
// KEY name: eBcZd

const {BotToken} = require('../config');
const {bot} = require('./bot-instance');
const DEV_MODE = true;

const {onReady, onMessage} = require('./bot-events');

bot.on('ready', onReady);

bot.on('message', onMessage);


bot.login(BotToken);