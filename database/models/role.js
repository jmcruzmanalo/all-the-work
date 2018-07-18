const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = {Role};