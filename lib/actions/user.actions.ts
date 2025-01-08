'use server';
import { clerkClient } from "@clerk/nextjs/server";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
   const client=await clerkClient();
    const userResponse = await client.users.getUserList({
      emailAddress: userIds, 
    });
    const users=userResponse.data

    const mappedUsers = users.map((user:any) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "", 
      name: user.username || user.firstName || "Unknown", 
      avatar: user.profileImageUrl,
    }));

    const sortedUsers = userIds.map((email) =>
      mappedUsers.find((user:any) => user.email === email)
    );

    return sortedUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; 
  }
};
