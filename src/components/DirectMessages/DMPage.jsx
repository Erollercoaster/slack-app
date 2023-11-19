import React, { useState, useEffect } from "react";
import DMForm from "./DMForm";
import ChatList from "./chatlist";
import SideBar from "../Navigation/SideBar";
import axiosInstance from "../../utils/API";

const DMPage = () => {
  const [messages, setMessages] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
      <div key={index}>{msg.body}</div>
    ));
  };

  // Function to handle user selection from ChatList (not shown here)
  const handleUserSelection = async (userId, userEmail) => {
    console.log("Selected user ID:", userId);
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
    await fetchMessagesForUser(userId);
  };

  // replace 'user1' with dynamic user ID
  return (
    <div className="DM-wrapper">
      <h1>Direct Messages</h1>
      <div className="chatlist-wrapper">
        <ChatList onUserSelect={handleUserSelection} />
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
