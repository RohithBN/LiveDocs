// app/page.tsx

import AddDocumentBtn from '@/components/AddDocumentBtn';
import Header from '@/components/Header';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';
import { redirect } from 'next/navigation';
import { getDocuments } from '@/lib/actions/room.actions';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import {DeleteModal} from '@/components/DeleteModal';
import Notifications from '@/components/Notification';
import { RoomData } from '@liveblocks/node';

const Home = async() => {
  const clerkUser=await currentUser();
  if(!clerkUser){
    redirect('/sign-in');
  }
  
  const roomDocuments=await getDocuments(clerkUser?.emailAddresses[0].emailAddress as string);
  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications/>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn 
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map((document:RoomData) => (
              <li key={document.id} className="document-list-item">
                <Link href={`/documents/${document.id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image 
                      src="/assets/icons/doc.svg"
                      alt="file"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{document.metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created about {document.createdAt.toLocaleString()}</p>
                  </div>
                </Link>
                <DeleteModal roomId={document.id}/>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty-docs w-96 h-32 rounded-lg bg-gray-600 py-2">
          <Image
            src="/assets/icons/doc.svg"
            alt="document"
            width={50}
            height={50}
            className='ml-40'
          />
          <AddDocumentBtn 
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress} 
          />
        </div>
      )}
    </main>
  );
};

export default Home;