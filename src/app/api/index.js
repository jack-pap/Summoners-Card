const express = require("express");
const next = require("next");
const cors = require("cors");
const fetch = (...args) =>
  import("isomorphic-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const port = 3000;

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 10000, checkperiod: 120 });

const whiteListSites = [
  "https://raw.communitydragon.org/",
  "https://ddragon.leagueoflegends.com/",
  "api.riotgames.com",
];


app.prepare().then(() => {
  const server = express();

  server.get("/p/:id", (req, res) => {
    const actualPage = "/post";
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  server.disable("x-powered-by");
  server.use(cors());
  server.use(bodyParser.json());
  server.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", req.get("Origin") || "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Private-Network", "true");
      return res.status(200).end();
    }
    next();
  });

  server.get("/", (req, res) => {
    res.send("Welcome to Summoners Card!");
  });

  // Proxy route to be called by controller to fetch data from API endpoint
  server.get("/api", async (req, res) => {
    try {
      const apiURL = req.query.url;
      if (!whiteListSites.some((word) => apiURL.includes(word))) return;

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
