"use client";
import { UserProvider, useUser } from "@/components/context/UserContext";

const App = () => {
  return <UserProfile />;
};

const UserProfile = () => {
  const { user, loading, error, refetchUser, setUserNull } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}</h1>
          <p>Email: {user.email}</p>
          <button onClick={refetchUser}>Refresh User Data</button>
          <button onClick={setUserNull}>Log Out</button>
        </div>
      ) : (
        <div>No user logged in.</div>
      )}
    </div>
  );
};

export default App;
