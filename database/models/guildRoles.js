
// Mongoose database model for storing the association between role and guild.

// NOTE: The role object can be changed externally. For now we're just storing the value as a reference. The ID though should be consistent throughout. If it is missing we'll just delete the entry

const mongoose = require('mongoose');


const KDRangeSchema = new mongoose.Schema({
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  }
});

const GuildRolesSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true
  },
  // The role object return by the discord API
  discordRoleObject: {
    type: mongoose.Schema.Types.Mixed,
      required: true
  },
  // Some options here are also in discordRoleObject. The above stores what discord returns but this is a reference to what the User (discord admin) has set.
  roleOptions: {
    type: mongoose.Schema.Types.Mixed,
      required: true
  },
  kdRange: {
    type: KDRangeSchema,
      required: true
  },
  position: {
    type: Number
  },
  unique: {
    type: Boolean
  }
});



const GuildRole = mongoose.model('GuildRoles', GuildRolesSchema);

module.exports = { GuildRole };