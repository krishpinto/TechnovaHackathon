"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/components/context/UserContext";
import { createProject } from "@/actions/projects";

export default function CreateProjectForm() {
  const { user } = useUser();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"ongoing" | "completed" | "cancelled">(
    "ongoing"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("User not logged in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newProject = {
        pro_name: projectName,
        proj_des: projectDescription,
        members: [user.userId], // Add the current user as a member
        status: status,
        end_date: endDate,
        tasks: [], // Initialize with an empty task array
      };

      // Call the createProject function
      await createProject(newProject);
      alert("Project created successfully!");

      // Reset the form
      setProjectName("");
      setProjectDescription("");
      setEndDate("");
      setStatus("ongoing");
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="projectName">Project Name</label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="projectDescription">Project Description</label>
        <Textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date</label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "ongoing" | "completed" | "cancelled")
          }
          className="block w-full p-2 border rounded"
          disabled={loading}
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
