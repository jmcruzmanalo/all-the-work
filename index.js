const express = require('express');

const app = express();

app.get('/', (req, res) => {
  console.log('Hello');
  res.send('Hello');
});

app.listen(3000, () => {
  console.log('Started listening to port 3000');
});