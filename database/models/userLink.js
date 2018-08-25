const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  latestKD: {
    type: Number,
    default: 0
  },
  latestTRN: {
    type: Number,
    default: 0
  }
});

const UserLinkSchema = new mongoose.Schema({
  serverId: {
    type: String,
    required: true,
  },
  userDiscordId: {
    type: String,
    required: true
  },
  epicIGN: {
    type: String,
    required: true
  },
  stats: StatsSchema
});

const UserLink = mongoose.model('UserLink', UserLinkSchema);

module.exports = { UserLink };