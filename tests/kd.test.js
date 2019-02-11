const expect = require('expect');
const { getKDs } = require('../actions/stats');

describe('KD.js', () => {
  describe('Getting the KD of ATW_Seensei', () => {
    it('should get the KD of ATW_Seensei', async () => {
      const kds = await getKDs('ATW_Seensei');
      // TODO: For now expect anything as long as it exists I guess.
      expect(kds).toMatchObject({
        solos: expect.anything(),
        duos: expect.anything(),
        squads: expect.anything()
      });
    });
  });
});
