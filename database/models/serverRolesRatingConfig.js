// Mongoose database model for storing the association between role and guild.

// NOTE: The role object can be changed externally. For now we're just storing the value as a reference. The ID though should be consistent throughout. If it is missing we'll just delete the entry

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServerRoleRating = new Schema({
  name: {
    type: String,
    required: true
  },
  range: {
    type: Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const ServerRolesConfigSchema = new Schema({
  serverId: {
    type: String,
    required: true,
    unique: true
  },
  rolesRating: [
    {
      type: ServerRoleRating
    }
  ],
  password: {
    type: String,
    required: true
  },
  ratingType: {
    // The active form of rating that a server uses
    type: String
  },
  lastUpdatedBy: {
    type: String,
    required: true
  }
});

ServerRolesConfigSchema.methods.getRolesByRatingType = function() {
  const serverRoleConfig = this;
  const ratingType = this.ratingType;
  const rolesRatings = serverRoleConfig.rolesRating.filter(
    role => ratingType === role.type
  );
  return [...rolesRatings.map(r => r.toObject())];
};

ServerRolesConfigSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const ServerRolesConfig = mongoose.model(
  'ServerRolesConfig',
  ServerRolesConfigSchema
);

module.exports = { ServerRolesConfig };
