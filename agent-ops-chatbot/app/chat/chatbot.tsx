'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Button = ({ onClick, disabled, children }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
  >
    {children}
  </button>
);

const ChatMessage = ({ role, content }: { role: string; content: string }) => {
  const isUser = role === 'user';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`my-1 p-3 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap ${
          isUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

const ChatBot = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handlePresetClick = async (text: string) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    setShowInput(true);

    try {
      const response = await fetch('http://localhost:8000/api/mistral-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          chat_history: newMessages,
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content || 'No response' }]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/mistral-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          chat_history: newMessages,
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content || 'No response' }]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('http://localhost:8000/api/upload-skills', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          console.log('File uploaded successfully:', data);
        })
        .catch(err => console.error('File upload failed:', err));
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="w-1/4 h-full bg-white border-r p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-4">Your Profile</h2>
          {user ? (
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.designation?.title || 'N/A'}</p>
              <p><strong>Department:</strong> {user.department?.name || 'N/A'}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading profile...</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="w-3/4 h-full flex flex-col border-l bg-white">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t px-6 py-4">
          <div className="max-w-2xl mx-auto space-y-2">
            {!showInput ? (
              <div className="flex gap-4">
                <Button onClick={() => handlePresetClick("I'm looking for opportunity")} disabled={loading}>
                  I'm looking for opportunity
                </Button>
                <Button onClick={() => handlePresetClick("I'm posting an opportunity")} disabled={loading}>
                  I'm posting an opportunity
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={sendMessage} disabled={loading}>
                  {loading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            )}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
