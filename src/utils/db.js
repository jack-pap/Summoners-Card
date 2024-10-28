require("dotenv").config();
import * as mysql2 from "mysql2";

const db = require("serverless-mysql")({
  config: {
    host: process.env.AWS_ENDPOINT,
    user: "admin",
    password: process.env.SQL_PASSWORD,
    database: "summonerscard",
  },
  library: mysql2,
});

async function initDatabase() {
  try {
    const summonerTableExists = await db.schema.hasTable("summonerInfo");
    const matchTableExists = await db.schema.hasTable("matchInfo");

    if (!summonerTableExists) {
      await db.schema.createTable("summonerInfo", (table) => {
        table.string("puuid").primary();
        table.json("summonerWinrate").notNullable();
        table.dateTime("lastUpdatedDate").notNullable();
      });
      console.log("summonerInfo table created");
    }

    if (!matchTableExists) {
      await db.schema.createTable("matchInfo", (table) => {
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

// CREATE TABLE `matchInfo` (
//   `puuid` varchar(255) NOT NULL,
//   `matchID` varchar(255) NOT NULL,
//   `matchInfo` json DEFAULT NULL,
//   `matchDate` datetime DEFAULT NULL,
//   PRIMARY KEY (`puuid`,`matchID`),
//   KEY `idx_puuid_matchDate` (`puuid`,`matchDate` DESC)
// )

// CREATE TABLE `summonerInfo` (
//   `RiotID` varchar(255) NOT NULL,
//   `puuid` varchar(255) NOT NULL,
//   `summonerInfo` json DEFAULT NULL,
//   `lastUpdatedDate` datetime DEFAULT NULL,
//   PRIMARY KEY (`puuid`),
//   KEY `idx_summonerInfo_puuid` (`puuid`),
//   KEY `idx_summonerInfo_RiotID` (`RiotID`)
// )

// Run the initialization
// initDatabase();

export default db;
