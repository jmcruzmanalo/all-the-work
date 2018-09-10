const {
  getGuildRolesInDatabase,
  getServerRolesInDatabase
} = require('../actions/roles/roles');
const { getLinkedServerMembers } = require('../actions/members');
const { updateServerRolesConfig } = require('../actions/roles/roles.edit');
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
        const serverRolesConfig = await getServerRolesInDatabase(serverId);
        response.rolesRating = serverRolesConfig.rolesRating;
        response.ratingType = serverRolesConfig.ratingType;
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
      const {
        body,
        params: { serverId }
      } = req;

      if (!body.hasOwnProperty('serverRatingEditValues')) {
        res.status(400).send({
          errorMessage: 'No serverRatingEditValues property in body'
        });
        return;
      }

      const {
        password,
        serverRatingEditValues: {
          ratingType,
          trnRange = [],
          trnRangeNames = []
        }
      } = body;

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

      try {
        await updateServerRolesConfig({
          serverId,
          password,
          rolesRating,
          ratingType,
          // Temporary hard-coded ID
          requesterDiscordId: '359314226214600704'
        });
        res.status(200).send({
          message: 'Finished updating the database'
        });
      } catch (e) {
        console.log(e);
        res.status(401).send({
          message:
            'Probably a wrong password || no server id found. Should handle 500 here',
          errorInfo: e
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
