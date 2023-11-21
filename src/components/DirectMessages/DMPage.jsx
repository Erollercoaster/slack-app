import React, { useState, useEffect } from "react";
import DMForm from "./DMForm";
import ChatList from "./chatlist";
import SideBar from "../Navigation/SideBar";
import axiosInstance from "../../utils/API";
import RecentConversations from "./RecentConversations";

const DMPage = () => {
  const [messages, setMessages] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  useEffect(() => {
    if (selectedUserId) {
      fetchMessagesForUser(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchMessagesForUser = async (userId) => {
    console.log("Selected user ID:", userId);
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const response = await axiosInstance.get(
        `/messages?receiver_id=${userId}&receiver_class=User`,
        {
          headers: authHeaders,
        }
      );

      console.log("API response:", response.data);
      // Assuming the response has a data field containing the messages
      setMessages((prevMessages) => ({
        ...prevMessages,
        [userId]: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const addMessage = (userId, newMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [userId]: [...(prevMessages[userId] || []), newMessage],
    }));
  };

  const renderMessagesForUser = (userId) => {
    return messages[userId]?.map((msg, index) => (
      <div key={index}>
        <div>From: {msg.sender?.email}</div>
        <div>At: {new Date(msg.created_at).toLocaleString()}</div>
        <div>{msg.body}</div>
      </div>
    ));
  };

  const handleUserSelection = async (userId, userEmail) => {
    console.log("Selected user ID:", userId);
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
    await fetchMessagesForUser(userId);

    const recentConversations =
      JSON.parse(localStorage.getItem("recentConversations")) || [];

    const isExistingConversation = recentConversations.some(
      (conversation) => conversation.id === userId
    );

    if (!isExistingConversation) {
      const newConversation = { id: userId, email: userEmail };
      localStorage.setItem(
        "recentConversations",
        JSON.stringify([newConversation, ...recentConversations])
      );
    }
  };

  return (
    <div className="DM-wrapper">
      <div className="chatlist-wrapper">
        <h1>Direct Messages</h1>
        <ChatList onUserSelect={handleUserSelection} />
        <RecentConversations onSelectUser={handleUserSelection} />
      </div>
      <div className="sidebar-wrapper">
        <SideBar />
      </div>
      <div className="message-wrapper">
        <h2>Messages</h2>
        {selectedUserId && renderMessagesForUser(selectedUserId)}
      </div>
      <DMForm
        onAddMessage={addMessage}
        receiverId={selectedUserId}
        receiverEmail={selectedUserEmail}
      />
    </div>
  );
};

export default DMPage;
