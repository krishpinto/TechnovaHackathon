import { getLoggedInUser } from "@/actions/auth";
// import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

export default async function Dashboard() {
  const user = await getLoggedInUser();
console.log(user);
  // if (!user) {
  //   redirect("/sign-in");
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      <DashboardContent user={user} />
    </div>
  );
}
