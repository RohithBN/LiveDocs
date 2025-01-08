'use client';

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react';
import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Editor } from './editor/Editor';
import ActiveCollaborators from './ActiveCollaborators';
import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';


const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({ roomId, roomMetadata }) => {
  const currentUserType = 'editor'; 
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(roomMetadata?.title || 'Untitled');
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler for saving the title
  const updateTitleHandler = async(e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === 'Enter') {
        setIsLoading(true);
        if(title!==roomMetadata.title){
          const updatedDocument=await updateDocument({roomId,title})
          console.log(updateDocument)
          setIsLoading(false);
        }
      }
      
    } catch (error) {
      console.error(error,"Error trying to update titele");
      
    }
    finally{
      setIsLoading(false);
    }
      
    
  };
  useEffect(() => {
    if(isEditing && inputRef.current){
      inputRef.current.focus();
    }
  },[isEditing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <div className="w-full min-h-screen">
      <RoomProvider id={roomId} initialPresence={{}}>
        <ClientSideSuspense
          fallback={
            <div className="flex items-center justify-center min-h-screen w-full">
              <p>Loading…</p>
            </div>
          }
        >
          {() => (
            <>
              <Header>
                <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
                  {isEditing && !isLoading ? (
                    <Input
                      type="text"
                      value={title}
                      ref={inputRef}
                      placeholder="Enter title"
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={updateTitleHandler}
                      disabled={isLoading}
                      className="document-title-input"
                    />
                  ) : (
                    <p className="document-title" onClick={() => setIsEditing(true)}>
                      {title}
                    </p>
                  )}
                  {currentUserType === 'editor' && !isEditing && (
                    <Image
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={24}
                      height={24}
                      onClick={() => setIsEditing(true)}
                      className="pointer cursor-pointer"
                    />
                  )}
                  {currentUserType !== 'editor' && !isEditing && <p>View Only</p>}
                  {isLoading && <p>Saving...</p>}
                </div>
                <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                  <ActiveCollaborators />
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </Header>
              <div className="w-full">
                <Editor />
              </div>
            </>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </div>
  );
};

export default CollaborativeRoom;
