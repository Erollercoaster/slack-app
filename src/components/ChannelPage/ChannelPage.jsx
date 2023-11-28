import React, { useState, useEffect } from "react";
import ChannelForm from "./ChannelForm";
import ChatList from "../DirectMessages/ChatList";
import SideBar from "../Navigation/SideBar";
import axiosInstance from "../../utils/API";
import ChatHeader from "../Navigation/ChatHeader";

const ChannelPage = () => {
  const [messages, setMessages] = useState({});
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

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

      const url = `/messages?receiver_id=${channelId}&receiver_class=Channel`;
      const response = await axiosInstance.get(url, { headers: authHeaders });

      // Access the messages array correctly
      const fetchedMessages = response.data.data || [];

      if (fetchedMessages.length === 0) {
      } else {
        console.log("Fetched messages:", fetchedMessages);
      }

      setMessages((prevMessages) => ({
        ...prevMessages,
        [channelId]: fetchedMessages,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const addMessage = (channelId, newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages[channelId]
        ? [...prevMessages[channelId]]
        : [];
      updatedMessages.push({
        ...newMessage,
        sender: { email: newMessage.senderEmail },
        created_at: new Date().toISOString(),
      });
      return {
        ...prevMessages,
        [channelId]: updatedMessages,
      };
    });
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

  const handleChannelSelection = (selectedOptions) => {
    console.log("Selected Options:", selectedOptions);

    if (typeof selectedOptions === "number") {
      setSelectedChannelId(selectedOptions);
      fetchMessagesForChannel(selectedOptions);
    } else if (Array.isArray(selectedOptions)) {
    } else {
      const channelId = selectedOptions?.value;
      console.log("Selected Channel ID:", channelId);
      setSelectedChannelId(channelId);
      if (channelId) {
        fetchMessagesForChannel(channelId);
      }
    }
  };
  return (
    <div className="channel-wrapper">
      <div className="chatlist-wrapper">
        <h1>Channels</h1>
        <ChatList onChannelSelect={handleChannelSelection} isMulti={true} />
      </div>
      <div className="sidebar-wrapper">
        <SideBar
          onChannelSelect={handleChannelSelection}
          selectedChannelId={selectedChannelId}
        />
      </div>
      <div className="chatheader-wrapper">
        <ChatHeader chatName="Chat Name" />
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
