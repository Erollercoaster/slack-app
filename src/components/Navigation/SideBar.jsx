import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import ChannelCreationModal from "../ChannelPage/ChannelCreationModal";
import axiosInstance from "../../utils/API";

const NavBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null); // Added state for selected channel
  const [channelMessages, setChannelMessages] = useState([]); // Added state for channel messages

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axiosInstance.get("/channels");
        console.log("Channels data:", response.data);
        setChannels(response.data.data);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, []);

  const fetchMessagesForChannel = async (channelId) => {
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const response = await axiosInstance.get(`/messages`, {
        params: {
          receiver_id: channelId,
          receiver_class: "Channel",
        },
        headers: authHeaders, // Using the retrieved auth headers
      });
      setChannelMessages(response.data); // Update the state with messages
      console.log("Fetched messages:", response.data);
      setChannelMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const onSelectChannel = (channelId) => {
    setSelectedChannelId(channelId);
    fetchMessagesForChannel(channelId);
  };

  const handleLogout = () => {
    localStorage.removeItem("authHeaders");
    window.location.href = "/";
  };

  return (
    <nav>
      <div className="sidebar-wrapper">
        <button onClick={handleLogout} className="logout-button">
          <LogOut /> Logout
        </button>
        {Array.isArray(channels) &&
          channels.map((channel) => (
            <div
              key={channel.id}
              className="channel-item"
              onClick={() => onSelectChannel(channel.id)}
            >
              {channel.name}
            </div>
          ))}
        <button onClick={() => setIsModalOpen(true)}>+ Create Channel</button>
        <ChannelCreationModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        />
        {selectedChannelId && (
          <div className="channel-messages">
            {/* Render the messages for the selected channel */}
            {Array.isArray(channelMessages) &&
              channelMessages.map((message, index) => (
                <div key={index}>{message.body}</div> // Adjust based on your message object structure
              ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
