import { getDB } from "@/src/utils/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { puuid } = params;
  try {
    const db = getDB();
    const userData = await db
      .select("summonerInfo")
      .from("summonerInfo")
      .where("puuid", puuid);
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { message: `There was an error retrieving summoner info: ${error}` },
      { status: 500 }
    );
  }
}
