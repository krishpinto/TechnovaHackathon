import { NextResponse, NextRequest } from "next/server";
import { createAdminClient } from "@/lib/server/appwrite";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
  const { pro_name, proj_des, members, status, end_date, tasks } =
    await request.json();

  if (!pro_name || !proj_des || !members || !status || !end_date) {
    return NextResponse.json(
      { message: "All required fields must be provided" },
      { status: 400 }
    );
  }

  try {
    const { database } = await createAdminClient();

    // Create the project in the Projects collection
    const newProject = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS_ID!,
      ID.unique(),
      {
        pro_name,
        proj_des,
        members,
        status,
        end_date,
        tasks: tasks || null,
      }
    );

    return NextResponse.json({ newProject }, { status: 200 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
