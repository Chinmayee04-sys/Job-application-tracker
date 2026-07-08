function encodeBasicAuth(username: string): string {
  const input = `${username}:`;
  if (typeof btoa === "function") {
    return btoa(input);
  }
  return input;
}

async function fetchReed(keywords: string, location: string, apiKey: string) {
  const query = new URLSearchParams({
    keywords,
    ...(location && { locationName: location }),
  });

  const response = await fetch(
    `https://www.reed.co.uk/api/1.0/search?${query}`,
    {
      headers: {
        Authorization: `Basic ${encodeBasicAuth(apiKey)}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Reed API returned ${response.status}`);
  }

  return response.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get("keywords") || "developer";
  const location = searchParams.get("location") || "";
  const apiKey = process.env.REED_API_KEY || searchParams.get("apiKey") || "";

  try {
    const data = await fetchReed(keywords, location, apiKey);
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { keywords, location, apiKey: bodyApiKey } = await request.json();
  const apiKey = process.env.REED_API_KEY || bodyApiKey || "";

  try {
    const data = await fetchReed(
      keywords || "developer",
      location || "",
      apiKey
    );
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}
