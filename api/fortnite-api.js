const axios = require('axios');

const instance = axios.create({
  baseURL: `https://fortnite.y3n.co/v2`,
  headers: {
    'X-Key': 'JhhfPQCUkvCHeJFqM2Bl',
    'User-Agent': 'nodejs request'
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

module.exports = { instance, getStats };