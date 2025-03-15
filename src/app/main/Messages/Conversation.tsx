import React, { useState, useEffect } from 'react';
import config from "../../data/config.json";
import { setActiveLink } from "../../../app/Redux/Reducers/activeLinkSlice";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/Redux/Store"; 


// Interface for message limit response
interface MessageLimitResponse {
  messageLimit: number;
  hasActiveSubscription: boolean;
  daysSinceCreation: number;
  gender: string;
}

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
  const [messageLimit, setMessageLimit] = useState<number>(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  // Fetch message limit when component mounts
  useEffect(() => {
    const fetchMessageLimit = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/api/messages/messages-limit`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch message limit');
        }

        const data: MessageLimitResponse = await response.json();
        setMessageLimit(data.messageLimit);
      } catch (error) {
        console.error("Error fetching message limit:", error);
        setError("Failed to load message limit");
      }
    };

    fetchMessageLimit();
  }, [accessToken]);

  // Function to handle "See Plans" button click
  const handleSeePlans = () => {
    console.log("Redirecting to subscription plans page...");
    dispatch(setActiveLink("premium"));
    setShowSubscriptionModal(false);
  };

  const handleSendMessage = async (receiver_id: number) => {
    // Check message limit before sending
    if (messageLimit === 0) {
      setShowSubscriptionModal(true);
      return;
    }

    if (newMessage.trim()) {
      try {
        const response = await fetch(`${config.baseUrl}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            receiver_id,
            message: newMessage,
          }),
        });

        if (!response.ok) {
          setError("Failed to send message");
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Message sent successfully:", data);

        const updatedConversation = {
          ...conversation,
          conversation: [...conversation.conversation, {
            sender: 'You',
            message: newMessage,
            timestamp: new Date().toISOString(),
          }]
        };
        updateConversation(updatedConversation);
        setNewMessage('');
      } catch (error) {
        setError("Failed to send message");
        console.error("Error sending message:", error);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

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

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Subscription Required
            </h3>
            <p className="mb-6">
              You need to subscribe to a Premium Subscription to continue sending messages
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSeePlans}
                className="py-2 px-4 bg-[#8207D1] text-white rounded hover:bg-purple-700"
              >
                See Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversation;