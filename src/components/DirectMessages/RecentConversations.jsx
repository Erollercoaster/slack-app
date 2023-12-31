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

    updateConversations();

    const interval = setInterval(updateConversations, 5000);

    return () => clearInterval(interval);
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
      <h2>Recent Conversations</h2>
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
