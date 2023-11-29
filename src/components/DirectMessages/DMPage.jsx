import React, { useState, useEffect } from "react";
import DMForm from "./DMForm";
import ChatList from "./ChatList";
import SideBar from "../Navigation/SideBar";
import axiosInstance from "../../utils/API";
import RecentConversations from "./RecentConversations";
import ChatHeader from "../Navigation/ChatHeader";

const DMPage = () => {
  const [messages, setMessages] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [chatName, setChatName] = useState("Chats");
  const [chatIcon, setChatIcon] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessagesForUser(selectedUserId);
      const interval = setInterval(() => {
        fetchMessagesForUser(selectedUserId);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  const fetchMessagesForUser = async (userId) => {
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

  const handleChannelSelection = async (selectedOptions) => {
    console.log("Handling channel selection:", selectedOptions);

    if (typeof selectedOptions === "number") {
      setSelectedChannelId(selectedOptions);
      fetchMessagesForChannel(selectedOptions);

      const channelDetails = await fetchChannelDetails(selectedOptions);
      console.log("Fetched channel details:", channelDetails);

      if (channelDetails && channelDetails.name) {
        setChatName(channelDetails.name);
        setChatIcon(
          <div className="chat-icon">
            {channelDetails.name.charAt(0).toUpperCase()}
          </div>
        );
      } else {
        console.log("Channel details missing or name not found");
        setChatName("Unknown");
        setChatIcon(null);
      }
    } else if (Array.isArray(selectedOptions)) {
      // Handle array case
    } else {
      // Handle other cases
    }

    // Add logic for user selection here
  };

  const fetchMessagesForChannel = async (channelId) => {
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const url = `/messages?receiver_id=${channelId}&receiver_class=Channel`;
      const response = await axiosInstance.get(url, { headers: authHeaders });

      // Access the messages array correctly
      const fetchedMessages = response.data.data || [];

      if (fetchedMessages.length === 0) {
      } else {
      }

      setMessages((prevMessages) => ({
        ...prevMessages,
        [channelId]: fetchedMessages,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchChannelDetails = async (channelId) => {
    console.log("Fetching channel details for ID:", channelId);
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const response = await axiosInstance.get(`/channels/${channelId}`, {
        headers: authHeaders,
      });

      console.log("API response for channel details:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching channel details:", error);
      return null; // or handle the error as per your application's needs
    }
  };

  const renderMessagesForUser = (userId) => {
    return messages[userId]?.map((msg, index) => (
      <div key={index}>
        <div>{msg.sender?.email}</div>
        <div>At: {new Date(msg.created_at).toLocaleString()}</div>
        <div>{msg.body}</div>
      </div>
    ));
  };

  const handleUserSelection = async (userId, userEmail) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
    await fetchMessagesForUser(userId);

    const recentConversations =
      JSON.parse(localStorage.getItem("recentConversations")) || [];

    const isExistingConversation = recentConversations.some(
      (conversation) => conversation.id === userId
    );

    const userName = userEmail.split("@")[0]; // Get the part before '@'
    setChatName(userName);
    setChatIcon(
      <div className="chat-icon">{userName.charAt(0).toUpperCase()}</div>
    );

    if (!isExistingConversation) {
      const newConversation = { id: userId, email: userEmail };
      localStorage.setItem(
        "recentConversations",
        JSON.stringify([newConversation, ...recentConversations])
      );
    }
  };

  const renderMessagesForChannel = (channelId) => {
    return messages[channelId]?.map((msg, index) => (
      <div className="messagebox" key={index}>
        <div>{msg.sender?.email}</div>
        <div>At: {new Date(msg.created_at).toLocaleString()}</div>
        <div>{msg.body}</div>
      </div>
    ));
  };

  return (
    <div className="DM-wrapper">
      <div className="chatlist-wrapper">
        <h1>Direct Messages</h1>
        <ChatList onUserSelect={handleUserSelection} />
        <RecentConversations onSelectUser={handleUserSelection} />
      </div>
      <div className="sidebar-wrapper">
        <SideBar
          onChannelSelect={handleChannelSelection}
          selectedChannelId={selectedChannelId}
        />
      </div>
      <div className="chatheader-wrapper">
        <ChatHeader chatName={chatName} icon={chatIcon} />
      </div>
      <div className="message-wrapper">
        <h2>Messages</h2>
        {selectedUserId && renderMessagesForUser(selectedUserId)}{" "}
        {selectedChannelId && renderMessagesForChannel(selectedChannelId)}
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
