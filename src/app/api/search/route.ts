import { type NextRequest } from "next/server";
import searchContent from "~/server/services/opensearch-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return Response.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const results = await searchContent(query);
    return Response.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json({ error: "Failed to perform search" }, { status: 500 });
  }
} 