import db from "@/src/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    await db("summonerInfo")
      .insert({
        RiotID: body.RiotID,
        puuid: body.puuid,
        summonerInfo: body.summonerInfo,
        lastUpdatedDate: body.lastUpdatedDate,
      })
      .onConflict("puuid")
      .merge(["RiotID", "puuid", "summonerInfo", "lastUpdatedDate"]);

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
    const userData = await db
      .select("*")
      .from("summonerInfo")
      .where("RiotID", RiotID);
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { message: `There was an error retrieving summoner info: ${error}` },
      { status: 500 }
    );
  }
}
