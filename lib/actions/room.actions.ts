'use server';
import {nanoid} from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType } from '../utils';
import { clerkClient } from '@clerk/nextjs/server';
export const createDocument=async({userId,email}:CreateDocumentParams)=>{
    const roomId=nanoid();

    try {
        const metadata={
            creatorId:userId,
            email,
            title:"Untitled"
        }
        const room = await liveblocks.createRoom(roomId, {
            defaultAccesses: [],
            metadata,
            usersAccesses: {
              [email]: ["room:write"],
            },
          });
          revalidatePath('/')
          return JSON.parse(JSON.stringify(room));
        
    } catch (error) {
        console.error(error,"Error Creating room");

        
    }
}
export const getDocument=async({userId,roomId}:{userId:string,roomId:string})=>{
    try {
        const room = await liveblocks.getRoom(roomId);
        if(!room){
            return null;
        }
        const hasAccess=Object.keys(room.usersAccesses).includes(userId)
        if(!hasAccess){
            return "No access to the room";
        }
        return JSON.parse(JSON.stringify(room));
        
    } catch (error) {
        console.log(error)
    }
}

export const updateDocument=async({roomId,title}:{roomId:string,title:string})=>{
    try {
        const room=await liveblocks.getRoom(roomId)
        if(!room){
            return null;
            }
            console.log("title:",title)
            await liveblocks.updateRoom(roomId,{
                metadata:{
                    title:title
                    }
            });
            return title;
        }
     catch (error) {
        console.log(error)
        
    }

}

export const getDocuments=async(email:string)=>{
    try {
        const rooms = await liveblocks.getRooms({userId:email});
        
        return JSON.parse(JSON.stringify(rooms));
        
    } catch (error) {
        console.log(error,"Error Fetching all the documents")
        
    }
}

export const updateDocumentAccess=async({roomId,email,userType,updatedBy}:ShareDocumentParams)=>{
    try {
        const emailid=[email]
        const client=await clerkClient();
        const userResponse = await client.users.getUserList({
          emailAddress: emailid, 
        });
        if (userResponse.data.length === 0) {
            return false;
          }
        const usersAccesses:RoomAccesses={
            [email]:getAccessType(userType) as AccessType
        }
        const room=await liveblocks.updateRoom(roomId,{
            usersAccesses
        })
        if(room) {
            const notificationId = nanoid();
      
            await liveblocks.triggerInboxNotification({
              userId: email,
              kind: '$documentAccess',
              subjectId: notificationId,
              activityData: {
                userType,
                title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
                updatedBy: updatedBy.name,
                avatar: updatedBy.avatar,
                email: updatedBy.email
              },
              roomId
            })
          }
        revalidatePath(`/document/${roomId}`);
        return JSON.parse(JSON.stringify(room))
        
    } catch (error) {
        console.log(error)
        
    }
}

export const removeCollaborator=async({roomId,email}:{roomId:string,email:string})=>{
    try {
        const room=liveblocks.getRoom(roomId);
        if((await room).metadata.email===email){
            throw new Error("You cannot remove yourself")
        }
        const removedroom=liveblocks.updateRoom(roomId,{
            usersAccesses:{
                [email]:null}
        })
        revalidatePath(`/document/${roomId}`);
        return JSON.parse(JSON.stringify(removedroom))
        
    } catch (error) {
        console.log(error)
        
    }
}

export const deleteDocument=async({roomId}:{roomId:string})=>{
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath(`/`);
        return true
    } catch (error) {
        console.log(error)
        
    }
}