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
    // Hashed
    type: String,
    required: true
  },
  lastUpdatedBy: {
    type: String,
    required: true
  }
});

ServerRolesConfigSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const ServerRolesConfig = mongoose.model(
  'ServerRolesConfig',
  ServerRolesConfigSchema
);

module.exports = { ServerRolesConfig };
