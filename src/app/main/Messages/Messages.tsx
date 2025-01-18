import React, { useState } from 'react';
import Conversation from './Conversation'; // Import the Conversation component

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface MessageList {
  id: number;
  name: string;
  profilePicture: string;
  conversation: Message[];
}

interface MessagesProps {
  messageList: MessageList[];
}

const Messages: React.FC<MessagesProps> = ({ messageList }) => {
  const [selectedConversation, setSelectedConversation] = useState<MessageList | null>(null);

  const handleSelectConversation = (conversation: MessageList) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex max-w-4xl mx-auto">
      <div className="w-1/3 p-4 overflow-y-auto">
        <h2 className="font-bold text-xl">Messages</h2>
        <ul>
          {messageList.map((person) => (
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
          <Conversation conversation={selectedConversation} />
        </div>
      )}
    </div>
  );
};

export default Messages;
