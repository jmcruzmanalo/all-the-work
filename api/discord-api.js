const axios = require('axios');
const { BotToken } = require('../config');

const instance = axios.create({
  baseURL: 'https://discordapp.com/api',
  headers: {
    'Authorization': `Bot ${BotToken}`,
    'User-Agent': 'DiscordBot'
  }
});

const getUser = async (guildID, userID) => {
  if (!guildID || !userID) throw new Error(`discord-api.js:getUser() - one of the params is missing`);
  const url = `/guilds/${guildID}/members/${userID}`;
  let res;
  try {
    res = await instance.get(url);
    return res.data;
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:getUser() - ${e}`)
  }
};

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
    throw new Error(`discord-api:getRoles() - ${e}`)
  }
  return res.data;
}

const addRole = async (guildID, roleName, roleOptions = {}) => {
  const url = `/guilds/${guildID}/roles`;
  let res;
  try {
    if (roleOptions.color) {
      let x = roleOptions.color.replace('#', '');
      roleOptions.color = parseInt(x, 16);
    }
    const requestOptions = {
      name: roleName,
      ...roleOptions
    };
    res = await instance.post(url, requestOptions);
  } catch (e) {
    throw new Error(`discord-api:addRole() - ${e}`);
  }
  return res.data;
};

const deleteRole = async (guildID, roleID) => {
  const url = `/guilds/${guildID}/roles/${roleID}`;
  let res;
  try {
    res = await instance.delete(url);
  } catch (e) {
    throw new Error(`discord-api:deleteRole() - ${e}`);
  }
  return res.status;
};

const setUserRole = async (guildID, roleID, userID) => {
  if (!guildID || !roleID || !userID) throw new Error(`discord-api.js:setUserRole() - one of the params is missing`);
  const url = `/guilds/${guildID}/members/${userID}/roles/${roleID}`;
  let res;
  try {
    res = await instance.put(url);
    if (res.status === 204) {
      return true;
    } else {
      throw new Error(res.error);
    }
  } catch(e) {
    console.log(e);
    throw new Error(`discord-api.js:setUserRole() - ${e}`)
  }
};

const getUserRoles = async (guildID, userID) => {
  if (!guildID || !userID) throw new Error(`discord-api.js:getUserRoles() - one of the params is missing`);
  let res;
  try {
    user = await getUser(guildID, userID);
    return user.roles;
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:getUserRoles() - ${e}`)
  }
};



module.exports = { getRoles, addRole, deleteRole, setUserRole, getUserRoles };