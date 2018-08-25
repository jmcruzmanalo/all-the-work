const { getGuildRolesInDatabase } = require('../actions/roles');
const { getLinkedServerMembers } = require('../actions/members');

module.exports = (app) => {

  app.get(`/api/servers/:serverId/details`, async (req, res) => {
    const serverId = req.params.serverId;
    const { getMembers = false, getRolesRating = false } = req.query;
    const response = {};
    
    if (getRolesRating) {
      response.rolesRating = (await getGuildRolesInDatabase({ guildID: serverId }))
        .map((role) => {
          return {
            ...role,
            _id: role._id.toString()
          }
        });
    }

    if (getMembers) {
      response.members = (await getLinkedServerMembers({ serverId }));
    }


    res.send(response);

  });

  app.get(`/api/servers/:serverId/rolesRating`, async (req, res) => {
    const serverId = req.params.serverId;
    const serverRolesRating = (await getGuildRolesInDatabase({ guildID: serverId }))
      .map((role) => {
        return {
          ...role,
          _id: role._id.toString()
        }
      });
    res.send({
      serverRolesRating
    });
  });
}