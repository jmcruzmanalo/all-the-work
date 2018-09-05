// Mongoose database model for storing the association between role and guild.

// NOTE: The role object can be changed externally. For now we're just storing the value as a reference. The ID though should be consistent throughout. If it is missing we'll just delete the entry

const mongoose = require('mongoose');
const { Schema } = mongoose;

const GuildRoleInput = new Schema({
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

const GuildRolesUpdateRequestSchema = new Schema({
  serverId: {
    type: String,
    required: true
  },
  rolesRating: [
    {
      type: GuildRoleInput,
      required: true
    }
  ],
  requesterDiscordId: {
    type: String,
    required: true
  },
  approverId: {
    type: String
  }
});

GuildRolesUpdateRequestSchema.pre('save', function(next) {
  this.requestedAt = Date.now();
  next();
});

const GuildRolesUpdateRequest = mongoose.model(
  'GuildRolesUpdateRequest',
  GuildRolesUpdateRequestSchema
);

module.exports = { GuildRolesUpdateRequest };
