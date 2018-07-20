// https://fortnite.y3n.co/v2 - api key: JhhfPQCUkvCHeJFqM2Bl

const axios = require('axios');

const instance = axios.create({
  baseURL: `https://api.fortnitetracker.com/v1/profile`,
  headers: {
    'TRN-Api-Key': 'c51e316a-6b62-4317-8636-be93b3185894'
  }
});

const getStats = async (ign, options = {}) => {
  const url = `/player/${ign}`;
  let data;
  try {
    let response = await instance.get(url);
    data = response.data;
  } catch (e) {
    console.log(e);
    throw new Error(`fortnite-api:getStats`);
  }
  return data;
};

const getStatsBySeason = async ({ ign, platform = 'pc' }) => {
  if (!ign) throw new Error(`fortnite-api.js:getStatsBySeason() - provide an IGN`)
  const url = `/${platform}/${ign}`;
  try {
    let response = await instance.get(url);
    return response.data;
  }
  catch (e) {
    console.log(e);
    throw new Error(`fortnite-api.js:getStatsBySeason - ${e}`);
  }

};

module.exports = { instance, getStatsBySeason};