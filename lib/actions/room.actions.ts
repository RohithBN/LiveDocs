'use server';
import {nanoid} from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
export const createDocument=async({userId,email}:CreateDocumentParams)=>{
    const roomId=nanoid();

    try {
        const metadata={
            creatorId:userId,
            email,
            title:"Untitled"
        }
        const room = await liveblocks.createRoom(roomId, {
            defaultAccesses: ['room:write'],
            metadata,
            usersAccesses: {
              [email]: ["room:write"],
            },
          });
          revalidatePath('/')
          return room;
        
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
        //const hasAccess=Object.keys(room.usersAccesses).includes(userId)
        //if(!hasAccess){
          //  return "No access to the room";
        //}
        return room;
        
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

export const getDocuments=async({userId}:{userId:string})=>{
    try {
        const rooms = await liveblocks.getRooms();
        console.log("Rooms:",rooms)
        return rooms;
        
    } catch (error) {
        console.log(error,"Error Fetching all the documents")
        
    }
}