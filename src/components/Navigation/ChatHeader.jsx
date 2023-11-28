import React from "react";

const ChatHeader = ({ chatName }) => {
  return (
    <header className="chat-header">
      <div className="chat-info">
        <div className="chat-name">{chatName}</div>
        <div className="chat-icons">{/* Icons can be added here */}</div>
      </div>
      {/* Additional elements like search or settings can go here */}
    </header>
  );
};

export default ChatHeader;
