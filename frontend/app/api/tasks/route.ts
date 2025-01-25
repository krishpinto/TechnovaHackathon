import { NextResponse, NextRequest } from "next/server";
import { createAdminClient } from "@/lib/server/appwrite";
import { ID } from "node-appwrite";

export async function GET(request: NextRequest) {
  try {
    const { database } = await createAdminClient();

    // Fetch all tasks
    const tasks = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS_ID!
    );

    return NextResponse.json(tasks.documents);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { database } = await createAdminClient();
    const { project_id, task_name, priority, deadline, assigned_users } =
      await request.json();

    // Create a new task
    const newTask = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS_ID!,
      ID.unique(),
      {
        project_id,
        task_name,
        priority,
        deadline,
        assigned_users,
      }
    );

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { database } = await createAdminClient();
    const { taskId, updates } = await request.json();

    // Update an existing task
    const updatedTask = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS_ID!,
      taskId,
      updates
    );

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { database } = await createAdminClient();
    const { taskId } = await request.json();

    // Delete a task
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS_ID!,
      taskId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
