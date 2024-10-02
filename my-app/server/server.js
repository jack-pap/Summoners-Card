var express = require("express");
var cors = require('cors')
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //Allows usage of fetch
const bodyParser = require('body-parser');
var app = express();
const port = 3001;

const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 10000, checkperiod: 120 });

const summonerRouter = require('./routes/summoner-db-route')
const matchRouter = require('./routes/match-db-route')

// Middleware to cache responses
const cacheMiddleware = (req, res, next) => {
  const key = req.query.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for URL: ${key}`);
    res.json(cachedResponse);
  } else {
    console.log(`Cache miss for URL: ${key}`);
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body);
      res.sendResponse(body);
    };
    next();
  }
};

app.use(cors()); // Enable CORS for everywhere
app.use(bodyParser.json()); // Parse JSON bodies

//Database middleware routes
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  maxAge: 10000000 
 })); 
app.use('/summoner', summonerRouter);
app.use('/match', matchRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Summoners Card!');
});

// Proxy route to be called by controller to fetch data from API endpoint
app.get('/proxy', cacheMiddleware, async (req, res) => {
  const apiURL = req.query.url;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch data`});
  }
});

// Proxy route to be called by controller to fetch data from API endpoint without caching
app.get('/proxyNoCache', async (req, res) => {
  const apiURL = req.query.url;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch data`});
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
