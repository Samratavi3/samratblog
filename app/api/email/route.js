import { connectDB } from "@/lib/config/db";
import emailModel from "@/lib/models/emailModel";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/config/nodemailer";

const loadDB = async () => {
  await connectDB();
};

// Email validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

loadDB();

export async function GET(request) {
  try {
    const subscriptions = await emailModel.find({}).sort({ date: -1 });
    return NextResponse.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("GET /api/email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString().trim().toLowerCase();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await emailModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already subscribed" },
        { status: 409 }
      );
    }

    // Create new subscription
    const newSubscription = await emailModel.create({ email });

    // Send acknowledgment email
    try {
      await sendMail({
        to: email,
        subject: "Thank you for subscribing!",
        html: `<h2>Welcome to Samrat Blog!</h2><p>Thank you for subscribing to our newsletter. You'll receive updates when new blogs are published.</p>`,
      });
    } catch (err) {
      console.error("Failed to send acknowledgment email:", err.message);
    }

    return NextResponse.json({
      success: true,
      msg: "Successfully subscribed to newsletter!",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("POST /api/email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  // Check admin authentication for DELETE requests
  const adminAuth = request.headers.get("x-admin-auth");
  if (adminAuth !== "authenticated") {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription ID" },
        { status: 400 }
      );
    }

    const subscription = await emailModel.findByIdAndDelete(id);
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      msg: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
