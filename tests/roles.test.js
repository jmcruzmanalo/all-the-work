
const _ = require('lodash');
const expect = require('expect');
const testConfig = require('./test.config');
const clone = require('clone');
const { MainGuildID: guildID, DeveloperDiscordID } = require('../config');
const { checkIfRolesExists, getRolesByName, addRole, removeRole, addNeededRoles, removeAddedRoles, getGuildRolesInDatabase, setUserRolesInGuild, sortNeededRoles } = require('../actions/roles');
const { getUserRoles } = require('../api/discord-api');
const { GuildRole } = require('../database/models/guildRoles');
const { RolesAsDatabaseResults, TestGuildID, RolesAsInput, RoleExistingInServer } = require('./seed/roles.seed');

describe(`Roles file`, () => {
  if (!testConfig['roles']) return;

  const clearAllRoles = async () => {
    const rolesAsInput = clone(RolesAsInput, false);
    const rolesPromises = rolesAsInput.map((roleInputted) => {
      return removeRole({guildID, role: roleInputted});
    });

    await Promise.all(rolesPromises);

    try {
      await GuildRole.remove({});
    } catch (e) {
      console.log(e);
    }
  }

  // Separating unit tests from BDD tests
  describe(`UNIT TESTS`, () => {
    return;
    before(clearAllRoles);

    it(`should check if the roles exist on a guild - checkIfRolesExists`, async () => {
      const rolesAsInput = clone(RolesAsInput, false);
      const expectedMissing = [rolesAsInput[0].name, rolesAsInput[1].name];
      rolesAsInput.push(clone(RoleExistingInServer, false));
      const check = await checkIfRolesExists({
        guildID, roles: rolesAsInput
      });
      expect(check.length).toBe(4);
      expect(check).toEqual(expect.arrayContaining(expectedMissing));
    });

    it(`should be able to get the roles by name`, async () => {
      const roles = await getRolesByName({ guildID, roleName: 'Owner' });
      expect(roles.length).toBe(1);
      expect(roles[0]).toMatchObject({
        name: 'Owner'
      });
    });

    it(`should be able to get the roles by guild in the database`, async () => {
      // This add then removed the roles, should probably be check if the case needs to be implemented better
      // This does not user the main guild since it'd be a pain to insert and remove legit guild roles, so instead we'll be using see data.

      const guildRole1 = new GuildRole(RolesAsDatabaseResults[0]);
      const guildRole2 = new GuildRole(RolesAsDatabaseResults[1]);

      await Promise.all([guildRole1.save(), guildRole2.save()]);

      const rolesFromDatabase = await getGuildRolesInDatabase({ guildID: TestGuildID });

      expect(rolesFromDatabase).toMatchObject([guildRole1.toObject(), guildRole2.toObject()]);
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
          name: testRole.name,
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



  });

  describe(`BEHAVIOR TESTS`, () => {
    before(clearAllRoles);

    describe(`Adding then sorting then removing a bunch of roles`, () => {
      it(`should add the roles similar to what a user would input`, async () => {
        const response = await addNeededRoles({ guildID, rolesInput: RolesAsInput });
        expect(response.length).toBe(4);
        expect(response).toContainEqual(expect.objectContaining({
          name: expect.anything()
        }));
      });

      // SORTING cannot be reliably done for now. Basically the position field on the end point sometimes adds the roles above or below the role occupying the target position
      // it(`should sort the roles based on it's inputted position`, async () => {
      //   expect(await sortNeededRoles({guildID})).toBe(true);
      // });

      it(`should remove the roles that were added by the bot`, async () => {
        const response = await removeAddedRoles({ guildID });
        expect(response).true;
      });

    });

  });
});

