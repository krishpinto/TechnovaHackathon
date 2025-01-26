import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse, NextRequest } from "next/server";

import { ID } from "node-appwrite";

export async function GET() {
  console.log("API: Starting to fetch projects");
  try {
    const { database } = await createAdminClient();
    console.log("API: Admin client created");

    const projects = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS_ID!
    );
    
    console.log("API: Projects fetched", {
      count: projects.documents.length,
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      collectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS_ID
    });

    return NextResponse.json(projects.documents);
  } catch (error) {
    console.error("API: Failed to fetch projects:", error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { database } = await createAdminClient();
    const { pro_name, proj_des, members, status, end_date, tasks } =
      await request.json();

    // Create a new project
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
        tasks: tasks || [],
      }
    );

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { database } = await createAdminClient();
    const { projectId, updates } = await request.json();

    // Update an existing project
    const updatedProject = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS_ID!,
      projectId,
      updates
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { database } = await createAdminClient();
    const { projectId } = await request.json();

    // Delete a project
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS_ID!,
      projectId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
