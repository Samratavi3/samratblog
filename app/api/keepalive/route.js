import mongoose from "mongoose";
import { connectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Vercel Cron calls this daily (vercel.json). The node-cron ping in
// server.js never fires on serverless, and an idle free Atlas cluster
// gets paused.
export async function GET() {
  try {
    await connectDB();
    await mongoose.connection.db.admin().ping();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
