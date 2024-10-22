require("dotenv").config();
import knex from "knex";

var cachedDb;

export function getDB() {
  if (!cachedDb) {
    cachedDb = knex({
      client: "mysql",
      connection: {
        host: process.env.AWS_ENDPOINT,
        port: 3306,
        user: "admin",
        password: process.env.SQL_PASSWORD,
        database: "summonerscard",
      },
      pool: {
        min: 0,
        max: 20,
        idleTimeoutMillis: 10000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
    });
  }
  return cachedDb;
}

console.log("Knex instance created successfully " + Date.now());

async function initDatabase() {
  try {
    const summonerTableExists = await cachedDb.schema.hasTable("summonerInfo");
    const matchTableExists = await cachedDb.schema.hasTable("matchInfo");

    if (!summonerTableExists) {
      await cachedDb.schema.createTable("summonerInfo", (table) => {
        table.string("puuid").primary();
        table.json("summonerWinrate").notNullable();
        table.dateTime("lastUpdatedDate").notNullable();
      });
      console.log("summonerInfo table created");
    }

    if (!matchTableExists) {
      await cachedDb.schema.createTable("matchInfo", (table) => {
        table.string("puuid").notNullable();
        table.string("matchID").primary();
        table.json("matchInfo").notNullable();
        table.dateTime("matchDate").notNullable();
        table
          .foreign("puuid")
          .references("summonerInfo.puuid")
          .onDelete("CASCADE");
      });
      console.log("matchInfo table created");
    }

    console.log("Database initialization complete");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Run the initialization
// initDatabase();
