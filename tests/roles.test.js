
const _ = require('lodash');
const expect = require('expect');
const testConfig = require('./test.config');
const { MainGuildID: guildID, DeveloperDiscordID } = require('../config');
const { checkIfRolesExists, getRolesByName, addRole, removeRole, addNeededRoles, removeAddedRoles, getGuildRolesInDatabase, setUserRolesInGuild } = require('../actions/roles');
const { getUserRoles } = require('../api/discord-api');
const { GuildRole } = require('../database/models/guildRoles');
const { testDocRoles, sampleGuildID } = require('./seed/testDocRoles');

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

  before(async () => {
    await GuildRole.remove({});
  });

  it(`should be able to get the roles by name`, async () => {
    const roles = await getRolesByName({ guildID, roleName: 'Owner' });
    expect(roles.length).toBe(1);
    expect(roles[0]).toMatchObject({
      name: 'Owner'
    });
  });


  it(`should be able to get the roles by guild`, async () => {
    // This add then removed the roles, should probably be check if the case needs to be implemented better
    // This does not user the main guild since it'd be a pain to insert and remove legit guild roles, so instead we'll be using see data.


    const guildRole1 = new GuildRole(testDocRoles[0]);
    const guildRole2 = new GuildRole(testDocRoles[1]);

    await Promise.all([guildRole1.save(), guildRole2.save()]);

    const rolesFromDatabase = await getGuildRolesInDatabase({ guildID: sampleGuildID });

    expect(rolesFromDatabase).toMatchObject([guildRole1.toObject(), guildRole2.toObject()]);
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
      position: 0,
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
      r = role;

      const savedRole = await GuildRole.findOne({
        guildID,
        discordRoleObject: role
      });

      expect(savedRole).toMatchObject({
        guildID,
        discordRoleObject: role
      });

    });

    it(`should add the test role to ATW_Seensei`, async () => {
      await setUserRolesInGuild({ guildID, roleID: r.id, userID: DeveloperDiscordID });
      const currentUserRoles = await getUserRoles(guildID, DeveloperDiscordID);

      expect(currentUserRoles).toContain(r.id);

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