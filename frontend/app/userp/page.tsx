"use client";
import { UserProvider, useUser } from "@/components/context/UserContext";

const UserProfile = () => {
  const { user, loading, error, refetchUser, setUserNull } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen p-4">
      {user ? (
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Welcome, {user.username}</h1>
          <p className="text-gray-600">Email: {user.email}</p>
          <div className="space-x-4">
            <button 
              onClick={refetchUser}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh User Data
            </button>
            <button 
              onClick={setUserNull}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">No user logged in.</div>
      )}
    </div>
  );
};

export default function App() {
  return <UserProfile />;
}
