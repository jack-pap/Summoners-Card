const express = require("express");
const next = require("next");
const cors = require("cors");
const fetch = (...args) =>
  import("isomorphic-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const port = 3001;

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 10000, checkperiod: 120 });

// const summonerRouter = require("./summoner-db-route");
// const matchRouter = require("./match-db-route");

// Middleware to cache responses
// const cacheMiddleware = (req, res, next) => {
//   const key = req.query.url;
//   const cachedResponse = cache.get(key);

//   if (cachedResponse) {
//     console.log(`Cache hit for URL: ${key}`);
//     res.json(cachedResponse);
//   } else {
//     console.log(`Cache miss for URL: ${key}`);
//     res.sendResponse = res.json;
//     res.json = (body) => {
//       cache.set(key, body);
//       res.sendResponse(body);
//     };
//     next();
//   }
// };

app.prepare().then(() => {
  const server = express();

  // Custom route example
  server.get("/p/:id", (req, res) => {
    const actualPage = "/post";
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  server.use(cors()); // Enable CORS for everywhere
  server.use(bodyParser.json()); // Parse JSON bodies
  server.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", req.get("Origin") || "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      // Allow private network access
      res.setHeader("Access-Control-Allow-Private-Network", "true");
      return res.status(200).end();
    }
    next();
  });

  //Database middleware routes
  // app.use("/summoner", summonerRouter);
  // app.use("/match", matchRouter);

  server.get("/", (req, res) => {
    res.send("Welcome to Summoners Card!");
  });

  // Proxy route to be called by controller to fetch data from API endpoint
  server.get("/proxy", async (req, res) => {
    const apiURL = req.query.url;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch data` });
    }
  });

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});

module.exports = app;
