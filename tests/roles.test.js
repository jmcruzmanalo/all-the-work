
const _ = require('lodash');
const expect = require('expect');
const testConfig = require('./test.config');
const { bot } = require('../discord-bot/bot-instance');
const { MainGuildID: guildID } = require('../config');
const { checkIfRolesExists, getRolesByName, addRole, removeRole, addNeededRoles, removeAddedRoles } = require('../commands/roles');

const TEST_ROLES = {
  Owner: {
    name: 'Owner',
    roleOptions: {
      color: '#0f0e0e', // BLACK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 2,
      max: 2.99
    },
    unique: true // Only one user
  },
  BOT1: {
    name: 'BOT1',
    roleOptions: {
      color: '#0f0e0e', // BLACK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 1,
      max: 1.99
    },
    unique: true // Only one user
  },
  BOT2: {
    name: 'BOT2',
    roleOptions: {
      color: '#E91E63', // GREEN
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 0,
      max: 0.99
    }
  }
};

describe(`Roles file`, () => {
  if (!testConfig['roles']) return;

  it(`should be able to get the roles by name`, async () => {
    const roles = await getRolesByName({ guildID, roleName: 'Owner' });
    expect(roles.length).toBe(1);
    expect(roles[0]).toMatchObject({
      name: 'Owner'
    });
  });


  it(`should check if the roles exist on a guild - checkIfRolesExists`, async () => {
    const expectedMissing = ['BOT1', 'BOT2'];
    const check = await checkIfRolesExists({
      guildID, rolesRange: TEST_ROLES
    });
    expect(check.length).toBe(2);
    expect(check).toEqual(expect.arrayContaining(expectedMissing));
  });

  describe(`Adding then removing a role`, () => {
    const testRole = {
      name: 'TestRole',
      roleOptions: {
        color: '#0f0e0e', // BLACK
        hoist: true,
        mentionable: true
      },
      kdRange: {
        min: 0,
        max: 0.99
      },
      unique: true // Only one user
    };
    let r;
    it(`should add a role that did not exist - addRoleToGuild`, async () => {
      const role = await addRole({ guildID, role: testRole });

      // TODO: Maybe also add an assertion that checks if the role really does exist with the discord-api
      let { hoist, mentionable } = testRole.roleOptions;
      expect(role).toMatchObject({
        name: 'TestRole',
        hoist, mentionable
      });
    });

    it(`should remove the test role - removeRoleFromGuild`, async () => {
      // Expect a 204
      expect(await removeRole({ guildID, role: testRole })).true;
    });

  });

  describe(`Adding then removing a bunch of roles`, () => {
    it(`should add the Objects representing the roles that have not yet been added`, async () => {
      const response = await addNeededRoles({ guildID, rolesRange: TEST_ROLES });
      expect(response.length).toBe(2);
      expect(response).toContainEqual(expect.objectContaining({
        name: expect.anything()
      }));
    });

    it(`should remove the roles that were added by the bot`, async () => {
      const rolesRange = _.pick(TEST_ROLES, ['BOT1', 'BOT2']);
      const response = await removeAddedRoles({ guildID, rolesRange: rolesRange });
      expect(response).true;
    });

  });

});