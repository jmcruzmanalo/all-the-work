const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
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

const Link = mongoose.model('Link', LinkSchema);

module.exports = { Link };