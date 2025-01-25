import { createAdminClient } from "@/lib/server/appwrite"


export interface User {
  $id: string
  Dob: string
  Ph_no: string
  Post: string
  Department: string
  Des_position: string
  Email: string
  Username: string
  Userid: string
  availability: string[]
}

export async function getUsers(): Promise<User[]> {
    try{
        const { database } = await createAdminClient();
        const users = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,

            )
        return users.documents
    }catch(error){
        console.log(error)
    }
    }

export async function updateUserAvailability(userId: string, availability: string[]): Promise<void> {
    const { database } = await createAdminClient();
  await database.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, { availability })
}

export async function createUser(userData: Omit<User, "$id">): Promise<User> {
    const { database } = await createAdminClient();
  const response = await database.createDocument(DATABASE_ID, USERS_COLLECTION_ID, "unique()", userData)
  return response as User
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const { database } = await createAdminClient();
  const response = await database.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, userData)
  return response as User
}

export async function deleteUser(userId: string): Promise<void> {
    const { database } = await createAdminClient();
  await database.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, userId)
}

