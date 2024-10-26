import { NextResponse } from "next/server";

const whiteListSites = [
  "https://raw.communitydragon.org/",
  "https://ddragon.leagueoflegends.com/",
  "api.riotgames.com",
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiURL = searchParams.get("url");
    if (!whiteListSites.some((word) => apiURL.includes(word))) return;

    if (!apiURL) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Add CORS headers
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
