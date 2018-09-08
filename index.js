const express = require('express');
const bodyParser = require('body-parser');
const runBot = require('./discord-bot/bot');
const ngrok = require('ngrok');
require('./database/mongoose');

const app = express();
app.use(bodyParser.json());

require('./routes/server.routes')(app);

app.use(express.static('client/build'));

const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

app.get('/', (req, res) => {
  console.log('Hello');
  res.send('Hello');
});

app.listen(5000, () => {
  console.log('Started listening to port 5000');
});

if (process.env.NODE_ENV === 'DEVELOPMENT_WITH_BOT') {
  ngrok
    .connect({ port: 5000, region: 'ap' })
    .then(url => {
      process.env.NGROK_TUNNEL = url;
      console.log(`Server accessible at - ${process.env.NGROK_TUNNEL}`);
      runBot();
    })
    .catch(e => {
      console.log(e);
    });
}

module.exports = { app };
