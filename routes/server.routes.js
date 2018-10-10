const {
  addNeededRoles,
  getGuildRolesInDatabase,
  removeRole
} = require('../actions/roles/roles');
const { getLinkedServerMembers } = require('../actions/members');
const {
  updateServerRolesConfig,
  getServerRolesConfig
} = require('../actions/roles/roles.edit');
const {
  ServerRolesConfig
} = require('../database/models/serverRolesRatingConfig');

module.exports = app => {
  app.get(`/api/servers/:serverId/details`, async (req, res) => {
    const serverId = req.params.serverId;
    const { getMembers = false, getRolesRating = false } = req.query;
    const response = {};
    try {
      if (getRolesRating) {
        const serverRolesConfig = await getServerRolesConfig(serverId);
        if (serverRolesConfig) {
          const { rolesRating, ratingType } = await getServerRolesConfig(
            serverId
          );
          response.rolesRating = rolesRating;
          response.ratingType = ratingType;
        } else {
          return res.status(404).send({
            errorMessage:
              'Could not find discord server. If you visited this link outside of the discord bot then this can happen.'
          });
        }
      }
      if (getMembers) {
        response.members = await getLinkedServerMembers({ serverId });
      }

      res.send(response);
      return;
    } catch (e) {
      console.log(e);
      res.status(500).send({
        errorMessage: e
      });
    }
  });

  app.get(`/api/servers/:serverId/rolesRating`, async (req, res) => {
    const serverId = req.params.serverId;
    const serverRolesRating = (await getGuildRolesInDatabase({
      guildID: serverId
    })).map(role => {
      return {
        ...role,
        _id: role._id.toString()
      };
    });
    res.send({
      serverRolesRating
    });
  });

  app.post(
    `/api/servers/:serverId/requestUpdateRolesRating`,
    async (req, res) => {
      try {
        const {
          body,
          params: { serverId }
        } = req;

        const paramsIsComplete =
          body.hasOwnProperty('serverRatingEditValues') &&
          body.hasOwnProperty('password');
        if (!paramsIsComplete) {
          res.status(400).send({
            errorMessage:
              'No serverRatingEditValues or password property in body'
          });
          return;
        }

        const {
          password,
          serverRatingEditValues: { ratingType, rolesRating }
        } = body;

        const removedRoles = await updateServerRolesConfig({
          serverId,
          password,
          rolesRating,
          ratingType,
          // Temporary hard-coded ID
          requesterDiscordId: '359314226214600704'
        });

        for (const role of removedRoles) {
          await removeRole({ serverId, roleId: role.discordRoleObject.id });
        }

        // Call sync roles instead
        await addNeededRoles({ serverId });
        const latestServerRolesRating = await getServerRolesConfig(serverId);
        res.status(200).send({
          ...latestServerRolesRating,
          removedRoles
        });
      } catch (e) {
        res.status(401).send({
          message:
            'Probably a wrong password || no server id found. Should handle 500 here',
          errorInfo: e.message
        });
      }
    }
  );

  app.post(
    `/api/servers/:serverId/rolesRating/verifyPassword`,
    async (req, res) => {
      const serverId = req.params.serverId;
      const password = req.body.password;

      const serverRolesConfig = await ServerRolesConfig.findOne({
        serverId,
        password
      });
      if (serverRolesConfig) {
        res.status(200).send({
          isValid: true
        });
      } else {
        res.status(200).send({
          isValid: false
        });
      }
    }
  );
};
