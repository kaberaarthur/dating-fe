import React, { useState } from 'react';
import config from "../../data/config.json";

interface Message {
  sender: string;
  message: string;
  timestamp: string;
  receiver_id?: number;
}

interface ConversationProps {
  conversation: {
    name: string;
    id: number;
    profilePicture: string;
    conversation: Message[];
  };
  updateConversation: (updatedConversation: {
    name: string;
    id: number;
    profilePicture: string;
    conversation: Message[];
  }) => void;
}

const Conversation: React.FC<ConversationProps> = ({ conversation, updateConversation }) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const accessToken = localStorage.getItem("accessToken");

  const handleSendMessage = async (receiver_id: number) => {
    if (newMessage.trim()) {
      try {
        const response = await fetch(`${config.baseUrl}/api/messages`, {
          method: "POST", // Use POST for sending new data
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Pass the accessToken
          },
          body: JSON.stringify({
            receiver_id, // Include receiver ID
            message: newMessage, // The message content
          }),
        });

        if (!response.ok) {
          setError("Failed to send message");
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Message sent successfully:", data);

        // Update the conversation in the parent component state
        const updatedConversation = {
          ...conversation,
          conversation: [...conversation.conversation, {
            sender: 'You',
            message: newMessage,
            timestamp: new Date().toISOString(),
          }]
        };
        updateConversation(updatedConversation);

        // Clear the input field after sending the message
        setNewMessage('');
      } catch (error) {
        setError("Failed to send message");
        console.error("Error sending message:", error);
      }
    }
  };

  // Helper function to format timestamps into time (HH:MM AM/PM)
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to format the date to be used as a separator
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = conversation.conversation.reduce((acc, msg, index, array) => {
    const currentDate = formatDate(msg.timestamp);
    const prevDate = index > 0 ? formatDate(array[index - 1].timestamp) : null;

    if (currentDate !== prevDate) {
      acc.push({ date: currentDate, messages: [] });
    }

    acc[acc.length - 1].messages.push(msg);
    return acc;
  }, [] as { date: string, messages: Message[] }[]);

  return (
    <div>
      <h2 className="font-bold text-xl">{conversation.name}</h2>
      <div className="h-64 overflow-y-auto border-b p-2">
        {groupedMessages.map((group, index) => (
          <div key={index}>
            <div className="text-center text-sm text-gray-500 mt-4 mb-2">
              <strong>{group.date}</strong>
            </div>
            {group.messages.map((msg, index) => (
              <div key={index} className={msg.sender === 'You' ? 'text-right' : 'text-left'}>
                <p><strong>{msg.sender}</strong>: {msg.message}</p>
                <small>{formatTime(msg.timestamp)}</small>
              </div>
            ))}
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
        <p className='text-sm text-red-600'>{error}</p>
        <button
          onClick={() => handleSendMessage(conversation.id)}
          className="mt-2 py-4 px-6 bg-[#8207D1] text-white font-semibold rounded"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Conversation;
