import db from "@/src/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    db.query(
      `
      INSERT IGNORE INTO matchInfo (puuid, matchID, matchInfo, matchDate)
      VALUES (?, ?, ?, ?);
    `,
      [body.puuid, body.matchID, JSON.stringify(body.matchInfo), body.matchDate]
    );
    return NextResponse.json({
      message: `Match '${body.matchID}' entry created.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `There was an error creating match entry: ${error}`,
      },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
}

//getMatches or getMoreMatches
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid");
  const matchDate = searchParams.get("matchDate");
  const matchID = searchParams.get("matchID");

  if (matchID) return getMatchSpecific(matchID, puuid);
  if (matchDate) return getExtendedMatchIDs(matchDate, puuid);
  return getMatchIDs(puuid);
}

async function getMatchSpecific(matchID, puuid) {
  try {
    const match = await db.query(
      `
      SELECT * FROM matchInfo 
      WHERE matchID = ? AND puuid = ?
      LIMIT 1;
    `,
      [matchID, puuid]
    );
    console.log(match);
    return NextResponse.json(match, {
      headers: {
        "Cache-Control": "public, max-age=120, must-revalidate",
        Pragma: "cache",
        Expires: new Date(Date.now() + 120000).toUTCString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `There was an error retrieving summoner match ${matchID}: ${error}`,
      },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
}

async function getExtendedMatchIDs(matchDate, puuid) {
  try {
    const matchIDs = await db.query(
      `
      SELECT matchID FROM matchInfo 
      WHERE puuid = ? AND matchDate < ? 
      ORDER BY matchDate DESC 
      LIMIT 10;
    `,
      [puuid, matchDate]
    );
    console.log(matchIDs);
    await db.end();
    return NextResponse.json(matchIDs, {
      headers: {
        "Cache-Control": "public, max-age=120, must-revalidate",
        Pragma: "cache",
        Expires: new Date(Date.now() + 120000).toUTCString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `There was an error retrieving summoner ${puuid} extended matchIDs : ${error}`,
      },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
}

async function getMatchIDs(puuid) {
  try {
    const matchIDs = await db.query(
      `
      SELECT matchID FROM matchInfo 
      WHERE puuid = ? 
      ORDER BY matchDate DESC
      LIMIT 100;
    `,
      [puuid]
    );
    console.log(matchIDs);
    await db.end();
    return NextResponse.json(matchIDs, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `There was an error retrieving summoner ${puuid} matchIDs : ${error}`,
      },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
}
