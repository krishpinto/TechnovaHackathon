"use server";

import { ID, Query, AppwriteException, OAuthProvider } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

// const validateEmail = (email: string) => {
//   const emailRegex =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return emailRegex.test(email);
// };

export const getUserDetails = async (userId: string) => {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID!,
      [Query.equal("userId", [userId])]
    );
    return user.documents[0] || null;
  } catch (error) {
    console.log(error);
  }
};

export async function signUp(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { account, database } = await createAdminClient();

    // Check if the email already exists in the database
    const existingUser = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID!,
      [Query.equal("email", [email])]
    );

    if (existingUser.documents.length > 0) {
      return { error: "An account with this email already exists." };
    }

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    const newUser = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID!,
      ID.unique(),
      {
        userId: newUserAccount.$id,
        email: email,
        username: username,
      }
    );

    if (!newUser) throw new Error("Failed to create user document");

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during sign up.",
    };
  }
}

export async function getLoggedInUser() {
  const sessionClient = await createSessionClient();
  if (!sessionClient) return null;

  try {
    const { account } = sessionClient;
    const result = await account.get();
    let user;
    if (result) {
      user = await getUserDetails(result.$id);
      if (!user) {
        await createNewUser(result.name, result.email, result.$id);
        user = await getUserDetails(result.$id);
      }
    }
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error getting logged in user:", error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  const sessionClient = await createSessionClient();
  if (!sessionClient) redirect("/sign-in");
  const { account } = sessionClient;

  (await cookies()).delete("auth-session");
  await account.deleteSession("current");

  return redirect("/sign-in");
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const { account, database } = await createAdminClient();

    // Check if the user exists in the database
    const existingUser = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID!,
      [Query.equal("email", [email])]
    );

    if (existingUser.documents.length === 0) {
      return { error: "No account found with this email address." };
    }

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("auth-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Signin error:", error);
    return {
      error: "Invalid email or password.",
    };
  }
}

// export async function signIn_google() {
//   const { account } = await createAdminClient();

//   const origin = (await headers()).get("origin") || "http://localhost:3000";

//   const redirectUrl = await account.createOAuth2Token(
//     OAuthProvider.Google,
//     `${origin}/api/oauth`,
//     `${origin}/login`
//   );

//   //   const result = await account.get();
//   //   let user;
//   //   if (result) {
//   //     user = await getUserData(result.$id);
//   //   }

//   return redirectUrl;
// }
export async function signIn_google() {
  const { account } = await createAdminClient();

  const origin = (await headers()).get("origin") || "http://localhost:3000";

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${origin}/api/oauth`,
    `${origin}/sign-in`
  );

  //   const result = await account.get();
  //   let user;
  //   if (result) {
  //     user = await getUserData(result.$id);
  //   }

  return redirectUrl;
}

export async function createNewUser(name: string, email: string, id: string) {
  const { database } = await createAdminClient();

  const newUser = await database.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID!,
    ID.unique(),
    {
      userId: id,
      email: email,
      username: name,
    }
  );

  if (!newUser) throw new Error("Error creating user");
}
