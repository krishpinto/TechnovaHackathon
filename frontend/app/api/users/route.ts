// app/api/users/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createAdminClient } from "@/lib/server/appwrite";

export async function GET(request: NextRequest) {
  try {
    const { database } = await createAdminClient();

    // Fetch all users
    const users = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID! // Replace with your users collection ID
    );

    return NextResponse.json(users.documents);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
