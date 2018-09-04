import { getFormValues } from 'redux-form';

export const getServerId = state => state.server.serverId;
export const getServerRatingEditValues = state =>
  getFormValues('serverRatingEdit')(state);
