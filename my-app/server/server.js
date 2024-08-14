var express = require("express");
var cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bodyParser = require('body-parser');
var app = express();
const port = 3000;

const summonerRouter = require('./routes/summoner-db-route')

app.use(cors()); // Enable CORS for everywhere
app.use(bodyParser.json()); // Parse JSON bodies


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
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

// Proxy route to be called by controller to fetch iamge data from API endpoint
app.get('/proxyImage', async (req, res) => {
  const apiURL = req.query.url;
  try {
    const response = await fetch(apiURL);
    const data = await response.arrayBuffer();
    res.type(response.headers.get('content-type'));
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image data' });
  }
});

app.use('/summoner', summonerRouter)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
