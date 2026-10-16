import { NextRequest, NextResponse } from "next/server";
import { app } from "@kidzone/api/app";

/**
 * Next.js catch-all route handler that delegates /api/* requests to Hono app.
 */
async function handle(req: NextRequest) {
  return app.fetch(req);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
