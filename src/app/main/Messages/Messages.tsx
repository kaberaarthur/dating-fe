import React, { useState, useEffect } from 'react';
import Conversation from './Conversation';
import config from "../../data/config.json";

interface Message {
  sender: string;
  message: string;
  timestamp: string;
  receiver_id?: number;
}

interface MessageList {
  id: number;
  name: string;
  profilePicture: string;
  conversation: Message[];
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageList[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<MessageList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const accessToken = localStorage.getItem("accessToken");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.baseUrl}/api/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data); // Save the messages in state
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("An error occurred when fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); // Fetch every 5 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [accessToken]);  

  const handleSelectConversation = (conversation: MessageList) => {
    setSelectedConversation(conversation);
  };

  const updateConversation = (updatedConversation: MessageList) => {
    setMessages((prevMessages) => 
      prevMessages.map((person) => 
        person.id === updatedConversation.id ? updatedConversation : person
      )
    );
    setSelectedConversation(updatedConversation); // Update the selected conversation in the state
  };

  return (
    <div className="flex max-w-4xl mx-auto">
      <div className="w-1/3 p-4 overflow-y-auto">
        <h2 className="font-bold text-xl">Messages</h2>
        {loading && <p>Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {messages.map((person) => (
            <li
              key={person.id}
              onClick={() => handleSelectConversation(person)}
              className="flex items-center p-2 border-b hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={person.profilePicture}
                alt={person.name}
                className="w-12 h-12 rounded-sm object-cover"
              />
              <span className="ml-4">{person.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {selectedConversation && (
        <div className="w-2/3 p-4">
          <Conversation 
            conversation={selectedConversation} 
            updateConversation={updateConversation} 
          />
        </div>
      )}
    </div>
  );
};

export default Messages;
