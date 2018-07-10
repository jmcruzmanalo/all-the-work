const axios = require('axios');

const ftnAPI = axios.create({
  baseURL: `https://fortnite.y3n.co/v2`,
  headers: {
    'X-Key': 'JhhfPQCUkvCHeJFqM2Bl',
    'User-Agent': 'nodejs request'
  }
});

module.exports.ftnAPI = ftnAPI;