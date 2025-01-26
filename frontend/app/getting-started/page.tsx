"use client";

import { useUser } from "@/components/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const user = useUser();
  const router = useRouter();
  const { refetchUser } = useUser();
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

  useEffect(() => {
    if (user.user?.onboarding === true) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const userId = user.user?.$id;

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
        refetchUser();
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred while updating user data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Getting Started</h1>
          <p className="mt-2 text-gray-600">Complete your profile to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="Ph_no" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="Ph_no"
                type="number"
                value={formData.Ph_no}
                onChange={(e) => setFormData({ ...formData, Ph_no: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="Post" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="Department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                id="Department"
                type="text"
                value={formData.Department}
                onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="Des_position" className="block text-sm font-medium text-gray-700">
                Position Description
              </label>
              <input
                id="Des_position"
                type="text"
                value={formData.Des_position}
                onChange={(e) => setFormData({ ...formData, Des_position: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                GitHub Profile
              </label>
              <input
                id="github"
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">User data updated successfully!</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
