const axios = require('axios');
const { BotToken } = require('../config');

const instance = axios.create({
  baseURL: 'https://discordapp.com/api',
  headers: {
    'Authorization': `Bot ${BotToken}`,
    'User-Agent': 'DiscordBot'
  }
});

/**
 * Gets the roles in a certain guild
 * @param {String} guildID - The guildID, remember to pass a string
 */
const getRoles = async (guildID) => {
  const url = `/guilds/${guildID}/roles`;
  let res;
  try {
    res = await instance.get(url);
  } catch (e) {
    throw new Error(`Error - discord-api:getRoles() - ${e}`)
  }
  return res.data;
}

const addRole = async (guildID, roleName, roleOptions = { mentionable: true }) => {
  const url = `/guilds/${guildID}/roles`;
  let res;
  try {
    res = await instance.post(url, {
      name: roleName,
      ...roleOptions
    });
  } catch (e) {
    throw new Error(`Error - discord-api:addRole() - ${e}`);
  }
  return res.data;
};

const deleteRole = async (guildID, roleID) => {
  const url = `/guilds/${guildID}/roles/${roleID}`;
  let res;
  try {
    res = await instance.delete(url);
  } catch (e) {
    throw new Error(`Error - discord-api:deleteRole() - ${e}`);
  }
  return res.status;
};

module.exports = { getRoles, addRole, deleteRole };