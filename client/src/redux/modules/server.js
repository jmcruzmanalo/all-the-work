/**
 * ACTION TYPES
 */

export const TOGGLE_FETCHING_SERVER_DETAILS = 'TOGGLE_FETCHING_SERVER_DETAILS';
export const SET_ACTIVE_SERVER = 'SET_ACTIVE_SERVER';
export const SET_ACTIVE_SERVER_PASSWORD_STATUS =
  'SET_ACTIVE_SERVER_PASSWORD_VALIDITY';

export const SET_REQUESTER_DISCORD_ID = 'SET_REQUESTER_DISCORD_ID';

export const FETCH_SERVER_ROLES_RATING = 'FETCH_SERVER_ROLES_RATING';
export const SET_SERVER_RATING_EDIT_DEFAULTS =
  'SET_SERVER_RATING_EDIT_DEFAULTS';

export const SUBMIT_SERVER_ROLES_RATING_EDIT =
  'SUBMIT_SERVER_ROLES_RATING_EDIT';
export const CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD =
  'CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD';

export const SET_ERROR = 'SET_ERROR';

/**
 * ACTION CREATORS
 */

export const toggleFetchingServerDetails = () => {
  return {
    type: TOGGLE_FETCHING_SERVER_DETAILS
  };
};

export const setActiveServer = serverId => {
  return {
    type: SET_ACTIVE_SERVER,
    payload: serverId
  };
};

export const setRequesterDiscordId = requesterDiscordId => {
  return {
    type: SET_REQUESTER_DISCORD_ID,
    payload: requesterDiscordId
  };
};

export const fetchServerMembers = () => {
  return {
    type: 'FETCH_SERVER_MEMBERS'
  };
};

export const fetchServerRolesRating = () => {
  return {
    type: FETCH_SERVER_ROLES_RATING
  };
};

export const checkServerRolesRatingEditPassword = () => {
  return {
    type: CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD
  };
};

export const submitServerRatingEdit = () => {
  return {
    type: SUBMIT_SERVER_ROLES_RATING_EDIT
  };
};

export const setError = errorMessage => {
  return {
    type: SET_ERROR,
    payload: errorMessage
  };
};

/**
 * REDUCER
 */

export default (state = { fetchingServerDetails: true, error: '' }, action) => {
  switch (action.type) {
    case TOGGLE_FETCHING_SERVER_DETAILS:
      return {
        ...state,
        fetchingServerDetails: !state.fetchingServerDetails
      };

    case SET_ACTIVE_SERVER:
      return {
        ...state,
        serverId: action.payload
      };

    case SET_REQUESTER_DISCORD_ID:
      return {
        ...state,
        requesterDiscordId: action.payload
      };

    case SET_ACTIVE_SERVER_PASSWORD_STATUS:
      return {
        ...state,
        serverEditPasswordStatus: action.payload
      };

    case SET_SERVER_RATING_EDIT_DEFAULTS:
      return {
        ...state,
        ...action.payload
      };

    case SET_ERROR:
      return {
        ...state,
        errorMessage: action.payload
      };

    default:
      return state;
  }
};
