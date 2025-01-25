import { createAdminClient } from "@/lib/server/appwrite";

export interface User {
  $id: string;
  Dob: string;
  Ph_no: string;
  Post: string;
  Department: string;
  Des_position: string;
  Email: string;
  Username: string;
  Userid: string;
  availability: string[];
}

export async function getUsers() {
  try {
    const { database } = await createAdminClient();
    const users = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID!
    );

    return users.documents.map((doc) => ({
      $id: doc.$id,
      Dob: doc.Dob,
      Ph_no: doc.Ph_no,
      Post: doc.Post,
      Department: doc.Department,
      Des_position: doc.Des_position,
      Email: doc.Email,
      Username: doc.Username,
      Userid: doc.Userid,
      availability: doc.availability,
    }));
  } catch (error) {
    console.log(error);
  }
}

export async function completeOnboarding(userId: string) {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS!,
      userId,
      { onboarding: true }
    );
    return { success: true };
  } catch (error) {
    console.log("Error updating onboarding status:", error);
    return { success: false };
  }
}
