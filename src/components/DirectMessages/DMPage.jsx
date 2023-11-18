import React, { useState, useEffect } from "react";
import DMForm from "./DMForm";
import ChatList from "./chatlist";
import SideBar from "../Navigation/SideBar";

const DMPage = () => {
  const [messages, setMessages] = useState({});

  const addMessage = (userId, newMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [userId]: [...(prevMessages[userId] || []), newMessage],
    }));
  };

  const renderMessagesForUser = (userId) => {
    return messages[userId]?.map((msg, index) => (
      <div key={index}>{msg.body}</div>
    ));
  };

  // replace 'user1' with dynamic user ID
  return (
    <div className="DM-wrapper">
      <h1>Direct Messages</h1>
      <div className="chatlist-wrapper">
        <ChatList />
      </div>
      <div className="sidebar-wrapper">
        <SideBar />
      </div>
      <DMForm onAddMessage={addMessage} />
      <div>
        <h2>Messages</h2>
        {renderMessagesForUser("user1")}
      </div>
    </div>
  );
};

export default DMPage;
