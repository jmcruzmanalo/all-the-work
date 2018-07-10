const ftnAPI = require('../ftnAPI').ftnAPI;

const setKD = async (message) => {
  const KD = await getKD('ATW_Seensei');
};

const getKD = async (ign) => {
  const url = `/player/${ign}`;
  let response;
  try {
    response = await ftnAPI.get(url);
  } catch (e) {
    console.log(`Error in getKD()`);
    console.log(e);
  }

  const stats = getStatsFromResponse(response);
  console.log(stats);
};

const getStatsFromResponse = (response) => {
  let data;
  try {
    data = response.data.br.stats.pc;
  } catch(e) {
    console.log(`Error in getStatsFromResponse`);
    console.log(e);
  }
  return data;
}

module.exports.setKD = setKD;
module.exports.getKD = getKD;