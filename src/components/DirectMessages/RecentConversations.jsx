import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const RecentConversations = ({ onSelectUser }) => {
  const [recentConversations, setRecentConversations] = useState([]);

  useEffect(() => {
    const updateConversations = () => {
      const storedConversations =
        JSON.parse(localStorage.getItem("recentConversations")) || [];
      setRecentConversations(storedConversations);
    };

    updateConversations(); // Initial update on component mount

    const interval = setInterval(updateConversations, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const handleDeleteConversation = (id, event) => {
    event.stopPropagation();
    const updatedConversations = recentConversations.filter(
      (conversation) => conversation.id !== id
    );
    setRecentConversations(updatedConversations);
    localStorage.setItem(
      "recentConversations",
      JSON.stringify(updatedConversations)
    );
  };
  return (
    <div>
      <h1>Recent Conversations</h1>
      {recentConversations.map((conversation, index) => (
        <div key={index} className="recent-conversation-item">
          <span
            className="conversation-email"
            onClick={() => onSelectUser(conversation.id, conversation.email)}
          >
            {conversation.email}
          </span>
          <button
            className="delete-button"
            onClick={(event) =>
              handleDeleteConversation(conversation.id, event)
            }
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecentConversations;
