import { NextResponse } from "next/server";
import db from "@/src/utils/db";

export async function POST(request) {
  try {
    const body = await request.json();
    await db("matchInfo").insert({
      puuid: body.puuid,
      matchID: body.matchID,
      matchInfo: body.matchInfo,
      matchDate: body.matchDate,
    });
    return NextResponse.json({
      message: `Match '${body.matchID}' entry created.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: `There was an error creating match ${body.matchID} entry: ${err}`,
      },
      { status: 500 }
    );
  }
}

//getMatches or getMoreMatches
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid");
  const matchDate = searchParams.get("matchDate");
  const matchID = searchParams.get("matchID");

  try {
    if (matchID) return getMatchSpecific(matchID, puuid);
    if (matchDate) return getExtendedMatchIDs(matchDate, puuid);
    return getMatchIDs(puuid);
  } catch (error) {
    return NextResponse.json(
      { message: `There was an error retrieving summoner's matches: ${error}` },
      { status: 500 }
    );
  }
}

async function getMatchSpecific(matchID, puuid) {
  var query = db
    .select("*")
    .from("matchInfo")
    .where("matchID", matchID)
    .andWhere("puuid", puuid);
  const match = await query;
  console.log(match);
  return NextResponse.json(match);
}

async function getExtendedMatchIDs(matchDate, puuid) {
  var query = db
    .select("matchID")
    .from("matchInfo")
    .limit(10)
    .where("puuid", puuid)
    .andWhere("matchDate", "<", matchDate)
    .orderBy("matchDate", "desc");
  const matchIDs = await query;
  console.log(matchIDs);
  return NextResponse.json(matchIDs);
}

async function getMatchIDs(puuid) {
  var query = db
    .select("matchID")
    .from("matchInfo")
    .where("puuid", puuid)
    .orderBy("matchDate", "desc");
  const matchIDs = await query;
  console.log(matchIDs);
  return NextResponse.json(matchIDs);
}
