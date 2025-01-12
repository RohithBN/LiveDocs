'use client';

import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { createDocument } from '@/lib/actions/room.actions';
import { useRouter } from 'next/navigation';

interface AddDocumentBtnProps {
  userId: string;
  email: string;
}

const AddDocumentBtn: React.FC<AddDocumentBtnProps> = ({ userId, email }) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email });
      if (room) {
        router.push(`/documents/${room.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button type="submit" onClick={addDocumentHandler} className="gradient-blue flex gap-1 mt-4 ml-20 shadow-md">
      <Image 
        src="/assets/icons/add.svg" alt="add" width={24} height={24}
      />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};

export default AddDocumentBtn;