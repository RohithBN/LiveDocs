import { liveblocks } from "@/lib/liveblocks";
import { generateRandomColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export async function POST(request: Request) {
    const clerkUser=await currentUser();
    if (!clerkUser) redirect('/sign-in')
  // Get the current user from your database
  const user = {
    id: clerkUser.id,
    info:{
        id:clerkUser.id,
        name: clerkUser.fullName || "",
        email:clerkUser.emailAddresses[0].emailAddress,
        avatar:clerkUser.imageUrl,
        colour: generateRandomColor(), 
    }
  }

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds:[],
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}