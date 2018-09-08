const { getGuildRolesInDatabase } = require('../actions/roles');
const { getLinkedServerMembers } = require('../actions/members');
const { requestRoleUpdate } = require('../actions/roles/roles.edit');

module.exports = app => {
  app.get(`/api/servers/:serverId/details`, async (req, res) => {
    const serverId = req.params.serverId;
    const { getMembers = false, getRolesRating = false } = req.query;
    const response = {};

    if (getRolesRating) {
      response.rolesRating = (await getGuildRolesInDatabase({
        guildID: serverId
      })).map(role => {
        return {
          ...role,
          _id: role._id.toString()
        };
      });
    }

    if (getMembers) {
      response.members = await getLinkedServerMembers({ serverId });
    }

    res.send(response);
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
      const {
        body: { ratingType, trnRange = [], trnRangeNames = [] },
        params: { serverId }
      } = req;

      let rolesRating;

      switch (ratingType) {
        case 'TRN Rating':
          rolesRating = trnRangeNames.map((name, index) => {
            return {
              name,
              range: trnRange[index],
              type: ratingType
            };
          });
          break;
        default:
          res.status(400).send({
            errorMessage: 'Unknown Rating Type'
          });
          return;
      }

      await requestRoleUpdate({
        serverId,
        rolesRating,
        // Temporary hard-coded ID
        requesterDiscordId: '359314226214600704'
      });

      res.send({
        message: 'Request to update roles rating saved. Waiting for approval.'
      });
    }
  );

  app.fetch(
    `/api/servers/:serverId/rolesRating/verifyPassword`,
    async (req, res) => {
      const serverId = req.params.serverId;
      const password = req.body.password;
    }
  );
};
