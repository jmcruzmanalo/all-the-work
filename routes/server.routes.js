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
      const serverId = req.params.serverId;
      console.log(serverId);
      console.log(req.body);

      const rolesRating = req.body;

      await requestRoleUpdate({
        serverId,
        rolesRating,
        // Temporary hard-coded ID
        requesterDiscordId: '359314226214600704'
      });

      res.send('Alrayt');
    }
  );
};
