
const expect = require('expect');
const api = require('../api/fortnite-api');
const testConfig = require('./test.config');

const myIGN = `ATW_Seensei`;

describe(`Fortnite API JS`, () => {
  if (!testConfig['fortnite-api']) return;
  it(`should get the stats of a user`, async () => {
    const stats = await api.getStats(myIGN);
    expect(stats).toMatchObject({
      br: {}
    });
  })
});