import db from "@/src/utils/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { puuid } = params;
  try {
    const userData = await db.query(
      "SELECT summonerInfo FROM summonerInfo WHERE puuid = ?",
      [puuid]
    );
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { message: `There was an error retrieving summoner info: ${error}` },
      { status: 500 }
    );
  }
}
