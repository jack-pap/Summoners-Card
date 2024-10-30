require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("isomorphic-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

const API_KEY = process.env.API_KEY;

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 10000, checkperiod: 120 });

const allowedOrigins = ["https://summonerscard.com", "http://localhost:3000"];
const whiteListSites = [
  "https://raw.communitydragon.org/",
  "https://ddragon.leagueoflegends.com/",
  "api.riotgames.com",
];

app.disable("x-powered-by");
app.use(bodyParser.json());
//CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to check referer for /api route to check origin
app.use("/api", (req, res, next) => {
  const referer = req.get("Referer") || req.get("Origin");
  
  if (!referer || !allowedOrigins.some((allowedOrigin) => referer.startsWith(allowedOrigin))) {
    return res.status(403).json({ error: "Access forbidden" });
  }

  next();
});

// Explicit handling of preflight OPTIONS requests for all routes
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Welcome to Summoners Card!");
});

// Proxy route to be called by controller to fetch data from API endpoint
app.get("/api", async (req, res) => {
  try {
    var apiURL = req.query.url;
    if (!whiteListSites.some((word) => apiURL.includes(word))) return;
    if (apiURL.includes("api.riotgames.com")) {
      apiURL += apiURL.includes("?")
        ? `&api_key=${API_KEY}`
        : `?api_key=${API_KEY}`;
    }
    console.log(apiURL);
    const response = await fetch(apiURL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch data` });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
