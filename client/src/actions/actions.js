import * as actionTypes from './actionTypes';

export const setActiveServer = (serverId) => {
  return {
    type: actionTypes.SET_ACTIVE_SERVER,
    payload: serverId
  }
}

export const fetchServerMembers = () => {
  return {
    type: 'FETCH_SERVER_MEMBERS'
  }
};

export const fetchServerRolesRating = () => {
  return {
    type: actionTypes.FETCH_SERVER_ROLES_RATING
  }
}