// app/api/add-data/route.ts
import { addData } from "@/actions/users";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Request Body:", body); // Log the request body

    const { userId, Ph_no, Post, Department, Des_position, github } = body;

    // Validate the required fields
    if (!userId || !Ph_no || !Post || !Department || !Des_position) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the addData function
    const result = await addData(userId, {
      Ph_no,
      Post,
      Department,
      Des_position,
      github,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update user data" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, user: result.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
