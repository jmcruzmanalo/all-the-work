
const expect = require('expect');
const api = require('../api/fortnite-api');

const myIGN = `ATW_Seensei`;

describe(`Fortnite API JS`, () => {
  it(`should get the stats of a user`, async () => {
    const stats = await api.getStats(myIGN);
    expect(stats).toMatchObject({
      br: {}
    });
  })
});