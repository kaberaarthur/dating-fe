import React, { useState } from 'react';

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface ConversationProps {
  conversation: {
    name: string;
    profilePicture: string;
    conversation: Message[];
  };
}

const Conversation: React.FC<ConversationProps> = ({ conversation }) => {
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add a new message to the conversation (For simplicity, we're adding it manually here)
      const newMessageObj: Message = {
        sender: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      conversation.conversation.push(newMessageObj); // This should ideally update state in a parent or global store
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl">{conversation.name}</h2>
      <div className="h-64 overflow-y-auto border-b p-2">
        {conversation.conversation.map((msg, index) => (
          <div key={index} className={msg.sender === 'You' ? 'text-right' : 'text-left'}>
            <p><strong>{msg.sender}</strong>: {msg.message}</p>
            <small>{msg.timestamp}</small>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 py-4 px-6 bg-[#8207D1] text-white font-semibold rounded"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Conversation;
