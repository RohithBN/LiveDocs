'use server';
import { clerkClient } from "@clerk/nextjs/server";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
   const client=await clerkClient();
    const userResponse = await client.users.getUserList({
      emailAddress: userIds, 
    });
    const users=userResponse.data

    const mappedUsers = users.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "", 
      name: `${user.firstName} ${user.lastName}`, 
      avatar: user.imageUrl,
    }));

    const sortedUsers = userIds.map((email) =>
      mappedUsers.find((user) => user.email === email)
    );

    return JSON.parse(JSON.stringify(sortedUsers));
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; 
  }
};

export const getDocumentUsers=async({roomId,currentUser,text}:{roomId:string,currentUser:string,text:string})=>{
  try {
    const room=await liveblocks.getRoom(roomId)
    const users=Object.keys(room.usersAccesses).filter((email)=>email!==currentUser)
    if(text.length){
      const filteredUsers=users.filter((email:string)=>email.toLowerCase().includes(text.toLowerCase()))
    
    return JSON.parse(JSON.stringify(filteredUsers));
    }

    
  } catch (error) {
    console.error("Error fetching users:", error);
    
  }

}
