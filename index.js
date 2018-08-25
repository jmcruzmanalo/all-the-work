const express = require('express');
const bodyParser = require('body-parser');
require('./database/mongoose');

const app = express();
app.use(bodyParser.json());

require('./routes/server.routes')(app);

app.get('/', (req, res) => {
  console.log('Hello');
  res.send('Hello');
});

app.listen(5000, () => {
  console.log('Started listening to port 5000');
});