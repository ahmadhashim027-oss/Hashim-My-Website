import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function PATCH(req) {
  try {
    await connectDB();

    const { email, approved } = await req.json();

    if (!email || approved === undefined) {
      return NextResponse.json(
        { message: "Email and approval status required" },
        { status: 400 }
      );
    }

    const apprentice = await Apprentice.findOneAndUpdate(
      { email },
      { approved },
      { new: true }
    );

    if (!apprentice) {
      return NextResponse.json(
        { message: "Apprentice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Apprentice ${
          approved ? "approved" : "rejected"
        } successfully`,
        apprentice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
