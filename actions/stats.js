const clone = require('clone');
const { getStats } = require('../api/fortnite-api');
const {
  getRolesByName,
  getGuildRolesInDatabase
} = require('./roles/roles');
const { GuildRole } = require('../database/models/guildRoles');
const { updateServerMemberStats } = require('./members');

const CONST_PROPS = {
  C_SQUADS: 'curr_p9',
  C_DUOS: 'curr_p10',
  C_SOLOS: 'curr_p2',

  SOLOS: 'solos',
  DUOS: 'duos',
  SQUADS: 'squads'
};

// TODO: Rename this file

/**
 * Gets an object representing the users KD in solo, duos, and squads
 * The results seem to be:
 * `curr` seems to mean current season. p9 is squads, p10 is duos,
 * curr_p9 = squads
 * curr_p10 = duos
 * curr_p2 = solos
 * @param {String} ign The ign of the fortnite player
 */
const getKDs = async ign => {
  if (!ign) throw new Error(`kd.js:getKDs() - no ign provided`);
  try {
    const stats = await getStats({ ign });
    const solosStat = stats.hasOwnProperty(CONST_PROPS.C_SOLOS)
      ? stats[CONST_PROPS.C_SOLOS].kd.valueDec
      : 'N/A';
    const duosStat = stats.hasOwnProperty(CONST_PROPS.C_DUOS)
      ? stats[CONST_PROPS.C_DUOS].kd.valueDec
      : 'N/A';
    const squadsStat = stats.hasOwnProperty(CONST_PROPS.C_SQUADS)
      ? stats[CONST_PROPS.C_SQUADS].kd.valueDec
      : 'N/A';

    const kds = {
      solos: solosStat,
      duos: duosStat,
      squads: squadsStat
    };

    return kds;
  } catch (e) {
    console.log(e);
    throw new Error(`kd.js:getKDs() - ${e}`);
  }
};

const getTRN = async ({ epicIGN }) => {
  if (!epicIGN) throw new Error(`no epicIGN provided`);
  try {
    const stats = await getStats({ ign: epicIGN });
    return stats[CONST_PROPS.C_SQUADS].trnRating.valueInt;
  } catch (e) {
    throw new Error(`kd.js:getTRN() - ${e}`);
  }
};

/**
 * Gets a users deserved role. basedOn should be CONST_PROPS[SOLOS || DUOS || SQUADS]
 */
const getDeservedRole = async ({
  guildID,
  ign,
  userKDs,
  basedOn,
  roles,
  userDiscordId
}) => {
  if (!ign) throw new Error(`kd.js:getDeservedRole() - no ign provided`);
  if (!userKDs) userKDs = await getKDs({ ign });
  if (
    basedOn &&
    (basedOn !== CONST_PROPS.SOLOS ||
      basedOn !== CONST_PROPS.DUOS ||
      basedOn !== CONST_PROPS.SQUADS)
  ) {
    throw new Error(
      `kd.js:getDeservedRole() - basedOn should be CONST_PROPS[SOLOS || DUOS || SQUADS]`
    );
  }
  if (!basedOn) basedOn = CONST_PROPS.SQUADS;

  // TODO: Setup get guild roles
  if (!roles) roles = await getGuildRolesInDatabase({ guildID });

  let deservedRoles = [];
  let invalidRoles = [];

  roles.forEach(role => {
    const { min, max } = role.kdRange;
    const userKD = userKDs[basedOn];
    if (userKD > min && userKD < max) {
      deservedRoles.push(clone(role, false));
    } else {
      invalidRoles.push(clone(role, false));
    }
  });

  // TODO: Update this - should be unit tested first Async Task
  updateServerMemberStats({
    serverId: guildID,
    userDiscordId,
    stats: {
      latestKD: userKDs[basedOn]
    }
  });

  return {
    deservedRoles,
    invalidRoles
  };
};

const getDeservedRoleBasedOnTRN = async ({
  serverId,
  epicIGN,
  trn,
  serverRolesRating
}) => {
  if (!serverId || !epicIGN)
    throw new Error(`serverId or epicIGN not provided`);

  if (!trn) trn = await getTRN({ epicIGN });

  // TODO: Make the role comparison
};

module.exports = {
  getKDs,
  getTRN,
  getDeservedRole,
  getDeservedRoleBasedOnTRN
};
