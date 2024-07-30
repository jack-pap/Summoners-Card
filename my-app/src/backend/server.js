var express = require("express");
var cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bodyParser = require('body-parser');
var app = express();
const port = 3000;

app.use(cors()); // Enable CORS for everywhere
app.use(bodyParser.json()); // Parse JSON bodies

app.get('/', (req, res) => {
  res.send('Welcome to the proxy server!');
});

// Proxy route to be called by controller to fetch data from API endpoint
app.get('/proxy', async (req, res) => {
  const apiURL = req.query.url;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
