import { getFormValues, formValueSelector } from 'redux-form';

const serverRatingEditSelector = formValueSelector('serverRatingEdit');

export const getServerId = state => {
  if (!state) return null;
  return state.server.serverId;
};

export const getRequesterDiscordId = state => {
  if (!state) return null;
  return state.server.requesterDiscordId;
};

export const getServerRatingEditValues = state =>
  getFormValues('serverRatingEdit')(state);

export const getEnteredPassword = state => {
  return serverRatingEditSelector(state, 'password');
};
export const getServerEditPasswordStatus = state => {
  if (!state) return null;
  return state.server.serverEditPasswordStatus;
};

export const getErrorMessage = state =>{ 
  if (!state) return null;
  return state.server.errorMessage;
}
