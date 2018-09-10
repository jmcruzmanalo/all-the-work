import { submitServerRatingEdit, sendServerEditDetails } from './sagas';
import { select, call } from 'redux-saga/effects';
import {
  getServerId,
  getServerRatingEditValues,
  getEnteredPassword
} from '../reducers/selectors';

describe(`Saga side effects`, () => {
  it(`should run a sanity check`, () => {
    expect(true).toBeTruthy();
  });

  it(`should select the values from the redux-form reducer (saga test)`, () => {
    const generator = submitServerRatingEdit();

    expect(generator.next().value).toMatchObject(
      select(getServerRatingEditValues)
    );
    expect(generator.next().value).toMatchObject(select(getServerId));
    expect(generator.next().value).toMatchObject(select(getEnteredPassword));
    expect(generator.next().value).toMatchObject(
      call(sendServerEditDetails, undefined, undefined, undefined)
    );
  });
});
