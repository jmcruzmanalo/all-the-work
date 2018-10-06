const axios = require('axios');
const { BotToken } = require('../config');

const request = require('request');

const instance = axios.create({
  baseURL: 'https://discordapp.com/api',
  headers: {
    Authorization: `Bot ${BotToken}`,
    // 'User-Agent': 'DiscordBot'
  }
});

const getUser = async (guildID, userID) => {
  if (!guildID || !userID)
    throw new Error(`discord-api.js:getUser() - one of the params is missing`);
  const url = `/guilds/${guildID}/members/${userID}`;
  let res;
  try {
    res = await instance.get(url);
    return res.data;
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:getUser() - ${e}`);
  }
};

/**
 * Gets the roles in a certain guild
 * @param {String} guildID - The guildID, remember to pass a string
 */
const getRoles = async serverId => {
  const url = `/guilds/${serverId}/roles`;
  let res;
  try {
    res = await instance.get(url);
  } catch (e) {
    throw new Error(`discord-api:getRoles() - ${e}`);
  }
  return res.data;
};

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
  if (!guildID || !roleID || !userID)
    throw new Error(
      `discord-api.js:setUserRole() - one of the params is missing`
    );
  const url = `/guilds/${guildID}/members/${userID}/roles/${roleID}`;
  let res;
  try {
    res = await instance.put(url);
    if (res.status === 204) {
      return true;
    } else {
      throw new Error(res.error);
    }
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:setUserRole() - ${e}`);
  }
};

const getUserRoles = async (guildID, userID) => {
  if (!guildID || !userID)
    throw new Error(
      `discord-api.js:getUserRoles() - one of the params is missing`
    );
  let res;
  try {
    user = await getUser(guildID, userID);
    return user.roles;
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:getUserRoles() - ${e}`);
  }
};

const removeUserRole = async (guildID, roleID, userID) => {
  if (!guildID || !roleID || !userID)
    throw new Error(
      `discord-api.js:removeUserRoles() - one of the params is missing`
    );

  const url = `/guilds/${guildID}/members/${userID}/roles/${roleID}`;
  let res;
  try {
    res = await instance.delete(url);
    if (res.status === 204) return true;
    throw new Error(res);
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:removeUserRoles() - ${e}`);
  }
};

// Not actually needed since Discord.js supports this.
const deleteMessage = async (channelId, messageId) => {
  try {
    if (!channelId || !messageId) throw new Error(`missing channelId or messageId`);
    const url = `/channels/${channelId}/messages/${messageId}`;
    const res = await instance.delete(url);
    if (res.status === 204) return true;
    if (res.status === 404) return false;
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:deleteMessage() - ${e}`);
  }
}

/**
 * Applies the array to the guild's roles. Accepts an array of object with the roleID as id and position as a number.
 */
const applyGuildPositions = async (guildID, positions) => {
  if (!guildID || !positions) throw new Error(`one of the params is missing`);
  if (!Array.isArray(positions))
    throw new Error(`positions param is not an array`);
  let res;
  try {
    const url = `/guilds/415506140840067076/roles`;
    res = await instance.patch(url, positions, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DiscordBot',
        Authorization:
          'Bot NDY1ODU3MDcxMDk1NzQyNDk1.DiTmuQ.kriHkhbB7uXxd8t_Prg_9oTZuv0'
      }
    });
    if (res.status !== 200) {
      throw new Error(`status ${res.status}`);
    }
    return res.data;
  } catch (e) {
    console.log(e);
    throw new Error(`discord-api.js:applyGuildPositions() - ${e}`);
  }
};

module.exports = {
  getRoles,
  addRole,
  deleteRole,
  setUserRole,
  getUserRoles,
  applyGuildPositions,
  removeUserRole,
  deleteMessage
};
