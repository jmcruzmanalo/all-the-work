
const { ObjectID } = require('mongodb');

const sampleGuildID = '12341234';
const testDocRoles = [
  {
    _id: ObjectID('5b55ad26dc94c80760ebae9f'),
    guildID: '12341234',
    discordRoleObject: {
      'hoist': true,
      'name': 'Senpapi',
      'mentionable': true,
      'color': 986638,
      'position': 1,
      'id': '470899301099241472',
      'managed': false,
      'permissions': 104324161
    },
    'roleOptions': {
      'color': '#0f0e0e',
      'hoist': true,
      'mentionable': true
    },
    'kdRange': {
      '_id': '5b55ad26dc94c80760ebaea0',
      'min': 4,
      'max': 6.99
    },
    'unique': true,
    'position': 0,
    '__v': 0
  },
  {
    '_id': '5b55ad26dc94c80760ebae9d',
    'guildID': '12341234',
    'discordRoleObject': {
      'hoist': true,
      'name': 'Kouhai',
      'mentionable': true,
      'color': 15277667,
      'position': 1,
      'id': '470899300868685846',
      'managed': false,
      'permissions': 104324161
    },
    'roleOptions': {
      'color': '#E91E63',
      'hoist': true,
      'mentionable': true
    },
    'kdRange': {
      '_id': '5b55ad26dc94c80760ebae9e',
      'min': 3,
      'max': 3.99
    },
    'position': 1,
    '__v': 0
  },
  {
    '_id': '5b55ad26dc94c80760ebae9b',
    'guildID': '12341234',
    'discordRoleObject': {
      'hoist': true,
      'name': 'Heikin',
      'mentionable': true,
      'color': 16306937,
      'position': 1,
      'id': '470899301095047188',
      'managed': false,
      'permissions': 104324161
    },
    'roleOptions': {
      'color': '#F8D2F9',
      'hoist': true,
      'mentionable': true
    },
    'kdRange': {
      '_id': '5b55ad26dc94c80760ebae9c',
      'min': 1,
      'max': 2.99
    },
    'position': 2,
    '__v': 0
  },
  {
    '_id': '5b55ad26dc94c80760ebaea1',
    'guildID': '12341234',
    'discordRoleObject': {
      'hoist': true,
      'name': 'DooDoo',
      'mentionable': true,
      'color': 6636321,
      'position': 1,
      'id': '470899301099503636',
      'managed': false,
      'permissions': 104324161
    },
    'roleOptions': {
      'color': '#654321',
      'hoist': true,
      'mentionable': true
    },
    'kdRange': {
      '_id': '5b55ad26dc94c80760ebaea2',
      'min': 0,
      'max': 0.99
    },
    'position': 3,
  }
];

module.exports = { sampleGuildID, testDocRoles };