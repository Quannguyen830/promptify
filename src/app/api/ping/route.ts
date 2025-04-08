import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import searchContent from "~/server/services/opensearch-service";

export async function GET(request: NextRequest) {
    // const { query } = await request.json() as { query: string };
    const results = await searchContent("Capstone");
    return NextResponse.json(results);
}