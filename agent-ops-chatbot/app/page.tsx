'use client';

import React, { useState, useRef, useEffect } from 'react';

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePresetClick = async (text: string) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    setShowInput(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploaded file:', file);
      // Add actual file handling logic here
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Left Sidebar: User Profile */}
      <div className="w-1/4 h-full bg-white border-r p-6">
        <h2 className="text-lg font-bold mb-4">Your Profile</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> Jane Doe</p>
          <p><strong>Role:</strong> Software Engineer</p>
          <p><strong>Department:</strong> Product Innovation</p>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Uploaded Skills</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>React</li>
            <li>TypeScript</li>
            <li>Communication</li>
            <li>Team Leadership</li>
          </ul>
        </div>
      </div>

      {/* Chatbot Section */}
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
