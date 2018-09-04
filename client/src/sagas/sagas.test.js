import { submitServerRatingEdit, sendServerEditDetails } from './sagas';
import { select, call } from 'redux-saga/effects';
import { getServerId, getServerRatingEditValues } from '../reducers/selectors';

describe(`Saga side effects`, () => {
  it(`should run a sanity check`, () => {
    expect(true).toBeTruthy();
  });
  describe(`Submitting server edit entries`, () => {
    it(`should select the values from the redux-form reducer`, () => {
      const generator = submitServerRatingEdit();

      expect(generator.next().value).toMatchObject(
        select(getServerRatingEditValues)
      );
      expect(generator.next().value).toMatchObject(select(getServerId));
      expect(generator.next().value).toMatchObject(
        call(sendServerEditDetails, undefined, undefined)
      );
    });

    it(`should attempt to submit data to the express server`, async () => {
      const serverId = '415506140840067076';

      const trnRange = {
        trnRangeNames: ['DooDoo', 'Kouhai', 'Senpapi'],
        trnRange: [
          {
            min: 0,
            max: 1500
          },
          {
            min: 1501,
            max: 2600
          },
          {
            min: 2601,
            max: 5000
          }
        ]
      };

      const response = await sendServerEditDetails(serverId, trnRange);
      expect(response.status).toBe(200);
    });
  });
});
