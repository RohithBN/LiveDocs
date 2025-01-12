"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

export function Provvider({ children }: { children: ReactNode }) {
  const {user:clerkUser}= useUser();
  return (
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"} 
    resolveUsers={async({userIds})=>{
      const users = await getClerkUsers({userIds});
      return users;
    }}
    resolveMentionSuggestions={async({roomId,text})=>{
      if (!text) {
        return []; 
      }
      const users = await getDocumentUsers({roomId,
        currentUser:clerkUser?.emailAddresses[0].emailAddress||""
        ,text})
        return users;
    }
  }
    >
      
        <ClientSideSuspense fallback={<Loader/>}>
          {children}
        </ClientSideSuspense>
     
    </LiveblocksProvider>
  );
}