"use server";
import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = await (await cookies()).get("auth-session");
  if (!session || !session.value) {
    return;
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  console.log("Creating admin client...");
  
  if (!process.env.APPWRITE_API_KEY) {
    throw new Error("APPWRITE_API_KEY is not defined in environment variables");
  }

  const client = new Client();
  
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY);

  console.log("Admin client configuration:", {
    hasEndpoint: !!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    hasProjectId: !!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    hasApiKey: !!process.env.APPWRITE_API_KEY,
    apiKey: process.env.APPWRITE_API_KEY.substring(0, 8) + "..." // Log only first 8 chars for security
  });

  const database = new Databases(client);
  
  return { database };
}
