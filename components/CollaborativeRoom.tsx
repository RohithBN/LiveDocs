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
import Loader from './Loader';
import ShareModal from './ShareModal';

const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({ roomId, roomMetadata, users, currentUserType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(roomMetadata?.title || 'Untitled');
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevTitleRef = useRef(title);

  // Handler for saving the title
  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title !== prevTitleRef.current && !isLoading) {
      try {
        setIsLoading(true);
        prevTitleRef.current = title;  // Update ref to track the latest title
        const updatedDocument = await updateDocument({ roomId, title });
        console.log(updatedDocument); // You can add more specific logging here
      } catch (error) {
        console.error("Error trying to update title:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        if (title !== prevTitleRef.current) {
          updateDocument({ roomId, title });
          prevTitleRef.current = title;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roomId, title]);

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <div className="w-full min-h-screen">
      <RoomProvider id={roomId} initialPresence={{}}>
        <ClientSideSuspense fallback={<Loader />}>
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
                  <ShareModal roomId={roomId} collaborators={users} creatorId={roomMetadata.creatorId} currentUserType={currentUserType}/>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </Header>
              <div className="w-full">
                <Editor roomId={roomId} currentUserType={currentUserType} />
              </div>
            </>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </div>
  );
};

export default CollaborativeRoom;
