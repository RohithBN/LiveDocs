// app/documents/[id]/page.tsx
import CollaborativeRoom from '@/components/CollaborativeRoom';
import { getDocument } from '@/lib/actions/room.actions';
import { getClerkUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const DocumentPage = async ({ params }: { params: { id: string } }) => {
  const { id: roomId } = await params;

  // Fetch the current user (server-side logic)
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect('/sign-in');
  }

  const room = await getDocument({
    userId: clerkUser.emailAddresses[0].emailAddress,
    roomId: roomId,
  });
  if (!room?.metadata?.creatorId || !room?.metadata?.email || !room.metadata?.title) {
    return <div>Invalid room metadata.</div>;
  }

  // Ensure metadata is either RoomMetadata or null
  const metadata: RoomMetadata = {
    creatorId: room.metadata.creatorId as string,
    email: room.metadata.email as string,
    title: room.metadata.title as string
  };
  if (!room) {
    return <div>Room not found.</div>;
  }
  const userIds=Object.keys(room.usersAccesses);
  const users=await getClerkUsers({userIds});
  const usersData=users.map((user:User)=>({
    ...user,
    avatar: user.avatar,
    userType:room.usersAccesses[user.email]?.includes('room:write')?'editor':'viewer'
  }))

  const currentUserType=room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write')?'editor':'viewer'

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom roomId={roomId} roomMetadata={metadata} 
      users={usersData}
      currentUserType={currentUserType}
      />
    </main>
  );
};

export default DocumentPage;
