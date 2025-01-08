import { liveblocks } from "@/lib/liveblocks";
import { generateRandomColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";



export async function POST(request: Request) {
    const clerkUser=await currentUser();
    if (!clerkUser) redirect('/sign-in')
  // Get the current user from your database
  const user = {
    id: clerkUser.id,
    info:{
        id:clerkUser.id,
        name:clerkUser.username || "Anonymous",
        email:clerkUser.emailAddresses[0].emailAddress,
        avatar:clerkUser.imageUrl,
        colour: generateRandomColor(), 
    }
  }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds:[], // Optional
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}