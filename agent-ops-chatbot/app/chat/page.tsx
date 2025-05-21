'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBot from './chatbot';

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return <ChatBot />;
}
