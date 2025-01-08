"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUsers } from "@/lib/actions/user.actions";

export function Provvider({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"} 
    resolveUsers={async({userIds})=>{
      const users = await getClerkUsers({userIds});
      return users;
    }}
    >
      
        <ClientSideSuspense fallback={<Loader/>}>
          {children}
        </ClientSideSuspense>
     
    </LiveblocksProvider>
  );
}