import { getFormValues } from 'redux-form';
import { formValueSelector } from 'redux-form';

const serverRatingEditSelector = formValueSelector('serverRatingEdit');

export const getServerId = state => {
  if (!state.server) return null;
  return state.server.serverId;
};

export const getServerRatingEditValues = state =>
  getFormValues('serverRatingEdit')(state);

export const getEnteredPassword = state => {
  return serverRatingEditSelector(state, 'password');
};
export const getServerEditPasswordStatus = state => {
  if (!state.server) return null;
  return state.server.serverEditPasswordStatus;
};
