
const expect = require('expect');
const {bot} = require('../discord-bot/bot-instance');
const { MainGuildID: guildID } = require('../config');
const { checkIfRolesExists, getRolesByName, addRole, removeRole } = require('../commands/roles');

const ROLE_KD_RANGE = {
  '100': 'Owner', // Should exist
  '101': 'bot-dev-should-not-exist', // Should not exist
  '102': 'bot-dev-should-have-been-created' // Should be created if not exist
};

describe(`Roles file`, () => {

  it(`should be able to get the roles by name`, async () => {
    const roles = await getRolesByName({guildID, roleName: 'Owner'});
    expect(roles.length).toBe(1);
    expect(roles[0]).toMatchObject({
      name: 'Owner'
    });
  });


  it(`should check if the roles exist on a guild - checkIfRolesExists`, async () => {
    const expectedMissing = ['bot-dev-should-not-exist', 'bot-dev-should-have-been-created'];
    const check = await checkIfRolesExists({ guildID, rolesRange: ROLE_KD_RANGE });
    expect(check.length).toBe(2);
    expect(check).toEqual(expect.arrayContaining(expectedMissing));
  });


  describe(`Adding then removing a role`, () => {
    const testRole = 'test-role';
    let r;
    it(`should add a role that did not exist - addRoleToGuild`, async () => {
      const role = await addRole({guildID, roleName: testRole});
      
      // TODO: Maybe also add an assertion that checks if the role really does exist with the discord-api
      r = role;
      expect(role).toMatchObject({
        name: 'test-role',
      });
    });

    it(`should remove the test role - removeRoleFromGuild`, async () => {
      // Expect a 204
      expect(await removeRole({guildID, roleName: testRole})).true;
    });

  })
});