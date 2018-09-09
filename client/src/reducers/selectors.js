import { getFormValues } from 'redux-form';
import { formValueSelector } from 'redux-form';

const serverRatingEditSelector = formValueSelector('serverRatingEdit');

export const getServerId = state => state.server.serverId;
export const getServerRatingEditValues = state =>
  getFormValues('serverRatingEdit')(state);
export const getEnteredPassword = state => {
  return serverRatingEditSelector(state, 'password');
};
