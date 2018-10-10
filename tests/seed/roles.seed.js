const password = 'qwer1234';
const userDiscordId = '359314226214600704';
const serverId = '415506140840067076';

const rolesAsClientUIInput = {
  ratingType: 'TRN Rating',
  rolesRating: [
    {
      name: 'TEST3',
      range: {
        min: 0,
        max: 2000
      },
      type: 'TRN Rating'
    },
    {
      name: 'TEST2',
      range: {
        min: 2001,
        max: 3000
      },
      type: 'TRN Rating'
    },
    {
      name: 'TEST1',
      range: {
        min: 3001,
        max: 4500
      },
      type: 'TRN Rating'
    },
    {
      name: 'TEST0',
      range: {
        min: 4501,
        max: 5000
      },
      type: 'TRN Rating'
    }
  ],
  password: 'qwer1234'
};

// Just assume the values for now.
const roleNames = rolesAsClientUIInput.rolesRating.map(roleInput => {
  return roleInput.name
});
roleNames.push('TEST4');

module.exports = {
  password,
  userDiscordId,
  serverId,
  rolesAsClientUIInput,
  roleNames
};
