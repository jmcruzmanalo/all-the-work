const expect = require('expect');
const { doesUserExist } = require('../api/fortnite-api');

const myIGN = 'ATW_Seensei';

describe.only('Fortnite API JS', () => {
  describe('check if a user exists or not', () => {
    it('should return true', async () => {
      const res = await doesUserExist({ ign: myIGN });
      expect(res).true;
    });

    it('should return false', async () => {
      const res = await doesUserExist({ ign: 'ATTW_Seense' });
      expect(res).false;
    });
  });

  // it(`should get the stats of a user`, async () => {
  //   const stats = await getStats({ ign: myIGN });
  //   expect(stats).toMatchObject({
  //     br: {}
  //   });
  // })
});
