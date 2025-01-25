import { createAdminClient } from "@/lib/server/appwrite";
import { ID } from "node-appwrite";

// export interface Project {
//   pro_name: string;
//   proj_des: string;
//   members: string[]; // Array of user IDs
//   status: "ongoing" | "completed" | "cancelled"; // Enum for status
//   end_date: string; // ISO date string
//   tasks: string[]; // Array of task IDs (if using a separate Tasks collection)
// }

export async function createProject(project: {
  pro_name: string;
  proj_des: string;
  members: string[];
  status: "ongoing" | "completed" | "cancelled";
  end_date: string;
  tasks: string[];
}) {
  try {
    const response = await fetch("/api/db/project-add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    const data = await response.json();
    return data.newProject;
  } catch (error) {
    console.error("Error in createProject:", error);
    throw error;
  }
}
