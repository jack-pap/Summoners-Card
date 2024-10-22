import db from "@/src/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    await db.query(
      `
      INSERT INTO summonerInfo (RiotID, puuid, summonerInfo, lastUpdatedDate)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
          RiotID = VALUES(RiotID),
          summonerInfo = VALUES(summonerInfo),
          lastUpdatedDate = VALUES(lastUpdatedDate);
    `,
      [
        body.RiotID,
        body.puuid,
        body.summonerInfo,
        body.lastUpdatedDate,
      ]
    );
    return NextResponse.json({
      message: `Summoner '${body.RiotID}' entry created/updated.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: `There was an error creating/updating summoner entry: ${err}`,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const RiotID = searchParams.get("RiotID");
  try {
    const userData = await db.query(
      "SELECT * FROM summonerInfo WHERE RiotID = ?",
      [RiotID]
    );
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { message: `There was an error retrieving summoner info: ${error}` },
      { status: 500 }
    );
  }
}
