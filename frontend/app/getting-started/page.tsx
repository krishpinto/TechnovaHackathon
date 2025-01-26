"use client";

import { useUser } from "@/components/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const user = useUser();
  const [formData, setFormData] = useState({
    Ph_no: "",
    Post: "",
    Department: "",
    Des_position: "",
    github: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { refetchUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const userId = user.user?.$id; // Assuming 'id' is the correct property

    try {
      const response = await fetch("/api/add-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ...formData }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Failed to update user data");
      } else {
        setSuccess(true);
        console.log("User data updated successfully:", result.user);
        // Optionally, redirect the user to the next step or dashboard
      }
      refetchUser();
      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred while updating user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.user?.onboarding === true) {
      router.push("/dashboard");
    }
  }, [user, router]);
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Getting Started</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="Ph_no"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="Ph_no"
            type="number"
            value={formData.Ph_no}
            onChange={(e) =>
              setFormData({ ...formData, Ph_no: e.target.value })
            }
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="Post"
            className="block text-sm font-medium text-gray-700"
          >
            Post/Role
          </label>
          <input
            id="Post"
            type="text"
            value={formData.Post}
            onChange={(e) => setFormData({ ...formData, Post: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="Department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            id="Department"
            type="text"
            value={formData.Department}
            onChange={(e) =>
              setFormData({ ...formData, Department: e.target.value })
            }
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="Des_position"
            className="block text-sm font-medium text-gray-700"
          >
            Position Description
          </label>
          <input
            id="Des_position"
            type="text"
            value={formData.Des_position}
            onChange={(e) =>
              setFormData({ ...formData, Des_position: e.target.value })
            }
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="github"
            className="block text-sm font-medium text-gray-700"
          >
            GitHub Profile
          </label>
          <input
            id="github"
            type="text"
            value={formData.github}
            onChange={(e) =>
              setFormData({ ...formData, github: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {success && (
          <p className="text-sm text-green-500">
            User data updated successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Page;
