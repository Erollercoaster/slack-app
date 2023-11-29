import React from "react";

const ChatHeader = ({ chatName, icon, members }) => {
  return (
    <header className="chat-header">
      <div className="chat-info">
        <div className="chat-icon">{icon}</div>
        <div className="chat-name">{chatName}</div>
        <div className="channel-members">
          {members.map((member) =>
            member.email ? (
              <span key={member.id}>{member.email.split("@")[0]}, </span>
            ) : null
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
