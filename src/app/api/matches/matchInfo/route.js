import { NextResponse } from "next/server";
import db from '@/src/utils/db';

//getMatchInfo
export async function GET(request, { params }) {
  const { matchID } = params;
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid");

  try {
    let query = db
      .select("matchInfo")
      .from("matchInfo")
      .where("matchID", matchID)
      .andWhere("puuid", puuid);

    const matchData = await query;
    return NextResponse.json(matchData);
  } catch (error) {
    return NextResponse.json(
      {
        message: `There was an error retrieving info for match ${req.query.matchID}: ${error}`,
      },
      { status: 500 }
    );
  }
}
