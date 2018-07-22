// https://fortnite.y3n.co/v2 - api key: JhhfPQCUkvCHeJFqM2Bl

const axios = require('axios');

const instance = axios.create({
  baseURL: `https://api.fortnitetracker.com/v1/profile`,
  headers: {
    'TRN-Api-Key': 'c51e316a-6b62-4317-8636-be93b3185894'
  }
});

const doesUserExist = async ({ ign, platform = 'pc' }) => {
  if (!ign) throw new Error(`fortnite-api.js:doesUserExist() - provide an IGN`);
  const url = `/${platform}/${ign}`;
  try {
    let response = await instance.get(url);
    if (response.status === 200) {
      if (response.data.hasOwnProperty('error')) {
        return false;
      }
      return true;
    } else {
      throw new Error(`Unhandled response status`);
    }
  } catch(e) {
    console.log(e);
    throw new Error(`fortnite-api.js:doesUserExist() - ${e}`);
  }
};

const getStats = async ({ ign, platform = 'pc' }) => {
  if (!ign) throw new Error(`fortnite-api.js:getStats() - provide an IGN`)
  const url = `/${platform}/${ign}`;
  try {
    let response = await instance.get(url);
    return response.data;
  }
  catch (e) {
    console.log(e);
    throw new Error(`fortnite-api.js:getStats - ${e}`);
  }
};

module.exports = { instance, getStats, doesUserExist };