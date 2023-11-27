import React, { useState, useEffect } from "react";
import ChannelForm from "./ChannelForm";
import ChatList from "../DirectMessages/ChatList";
import SideBar from "../Navigation/SideBar";
import axiosInstance from "../../utils/API";

const ChannelPage = () => {
  const [messages, setMessages] = useState({});
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  useEffect(() => {
    if (selectedChannelId) {
      fetchMessagesForChannel(selectedChannelId);
      const interval = setInterval(() => {
        fetchMessagesForChannel(selectedChannelId);
      }, 5000); // Fetch new messages every 5 seconds

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [selectedChannelId]);

  const fetchMessagesForChannel = async (channelId) => {
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const response = await axiosInstance.get(
        `/messages?receiver_id=${channelId}&receiver_class=Channel`,
        { headers: authHeaders }
      );

      setMessages((prevMessages) => ({
        ...prevMessages,
        [channelId]: response.data.messages || [],
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const addMessage = (channelId, newMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [channelId]: [...(prevMessages[channelId] || []), newMessage],
    }));
  };

  const renderMessagesForChannel = (channelId) => {
    return messages[channelId]?.map((msg, index) => (
      <div key={index}>
        <div>From: {msg.sender?.email}</div>
        <div>At: {new Date(msg.created_at).toLocaleString()}</div>
        <div>{msg.body}</div>
      </div>
    ));
  };

  const handleChannelSelection = (channelId) => {
    setSelectedChannelId(channelId);
    fetchMessagesForChannel(channelId);
  };

  return (
    <div className="channel-wrapper">
      <div className="chatlist-wrapper">
        <h1>Channels</h1>
        <ChatList onChannelSelect={handleChannelSelection} />
      </div>
      <div className="sidebar-wrapper">
        <SideBar
          onChannelSelect={handleChannelSelection}
          selectedChannelId={selectedChannelId}
        />
      </div>
      <div className="message-wrapper">
        <h2>Channel Messages</h2>
        {selectedChannelId && renderMessagesForChannel(selectedChannelId)}
      </div>
      <ChannelForm onAddMessage={addMessage} channelId={selectedChannelId} />
    </div>
  );
};

export default ChannelPage;
