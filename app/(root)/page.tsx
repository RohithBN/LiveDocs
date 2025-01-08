// app/page.tsx
'use client';

import AddDocumentBtn from '@/components/AddDocumentBtn';
import Header from '@/components/Header';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDocuments } from '@/lib/actions/room.actions';

const Home = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const documents: any[] = []; // Placeholder for documents

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return null;
  }
  

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notification
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {documents.length > 0 ? (
        <div>
          {/* Render documents here */}
        </div>
      ) : (
        <div className="empty-docs">
          <Image
            src="/assets/icons/doc.svg"
            alt="document"
            width={40}
            height={40}
          />
          <AddDocumentBtn 
            userId={user.id}
            email={user.emailAddresses[0].emailAddress} 
          />
        </div>
      )}
    </main>
  );
};

export default Home;