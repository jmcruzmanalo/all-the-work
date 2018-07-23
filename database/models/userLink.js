const mongoose = require('mongoose');

const UserLinkSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  discordID: {
    type: 'String',
    required: true
  },
  epicIGN: {
    type: String,
    required: true
  }
});

const UserLink = mongoose.model('Link', UserLinkSchema);

module.exports = { UserLink };