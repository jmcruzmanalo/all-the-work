const { ObjectID } = require('mongodb');

const testPassword = 'qwer1234';

const serverId = '415506140840067076';

const rolesAsClientUIInput = {
  ratingType: 'TRN Rating',
  trnRange: [
    {
      min: 0,
      max: 2000
    },
    {
      min: 2001,
      max: 3250
    },
    {
      min: 3251,
      max: 4000
    },
    {
      min: 4001,
      max: 5000
    }
  ],
  trnRangeNames: ['TEST3', 'TEST2', 'TEST1', 'TEST0']
};

const TestGuildID = '12341234';

// An array of what a result from GuildRole.find() would be
const RolesAsDatabaseResults = [
  {
    _id: ObjectID('5b55ad26dc94c80760ebae9f'),
    guildID: '12341234',
    name: 'TEST_RANK_1',
    discordRoleObject: {
      hoist: true,
      name: 'TEST_RANK_1',
      mentionable: true,
      color: 986638,
      position: 1,
      id: '470899301099241472',
      managed: false,
      permissions: 104324161
    },
    roleOptions: {
      color: '#0f0e0e',
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 4,
      max: 6.99
    },
    unique: true,
    position: 0,
    __v: 0
  },
  {
    _id: ObjectID('5b55ad26dc94c80760ebae9d'),
    guildID: '12341234',
    name: 'TEST_RANK_2',
    discordRoleObject: {
      hoist: true,
      name: 'TEST_RANK_2',
      mentionable: true,
      color: 15277667,
      position: 1,
      id: '470899300868685846',
      managed: false,
      permissions: 104324161
    },
    roleOptions: {
      color: '#E91E63',
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 3,
      max: 3.99
    },
    position: 1,
    __v: 0
  },
  {
    _id: ObjectID('5b55ad26dc94c80760ebae9b'),
    guildID: '12341234',
    name: 'TEST_RANK_3',
    discordRoleObject: {
      hoist: true,
      name: 'TEST_RANK_3',
      mentionable: true,
      color: 16306937,
      position: 1,
      id: '470899301095047188',
      managed: false,
      permissions: 104324161
    },
    roleOptions: {
      color: '#F8D2F9',
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 1,
      max: 2.99
    },
    position: 2,
    __v: 0
  }
];

// An Object representing what input would be from the user
const RolesAsInput = [
  {
    name: 'TEST_RANK_1',
    roleOptions: {
      color: '#2E88F7', // BLUE
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 4,
      max: 6.99
    },
    position: 1,
    unique: true // Only one user
  },
  {
    name: 'TEST_RANK_2',
    roleOptions: {
      color: '#E91E63', // GREEN
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 3,
      max: 3.99
    },
    position: 2
  },
  {
    name: 'TEST_RANK_3', // Meaning average
    roleOptions: {
      color: '#F8D2F9', // PINK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 1,
      max: 2.99
    },
    position: 3
  },
  {
    name: 'TEST_RANK_4', // Meaning average
    roleOptions: {
      color: '#F8D2F9', // PINK
      hoist: true,
      mentionable: true
    },
    kdRange: {
      min: 1,
      max: 2.99
    },
    position: 4
  }
];

const RoleExistingInServer = {
  name: 'Owner',
  roleOptions: {
    color: '#0f0e0e', // BLACK
    hoist: true,
    mentionable: true
  },
  kdRange: {
    min: 4,
    max: 6.99
  },
  position: 0,
  unique: true // Only one user
};

module.exports = {
  testPassword,
  serverId,
  rolesAsClientUIInput,
  RolesAsDatabaseResults,
  RolesAsInput,
  RoleExistingInServer
};
