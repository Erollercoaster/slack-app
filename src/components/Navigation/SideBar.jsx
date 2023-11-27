import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import ChannelCreationModal from "../ChannelPage/ChannelCreationModal";
import axiosInstance from "../../utils/API";

const SideBar = ({ onChannelSelect, selectedChannelId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState([]);

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

  const onSelectChannel = (channelId) => {
    onChannelSelect(channelId); // Call the function passed from parent
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
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${
              selectedChannelId === channel.id ? "selected" : ""
            }`}
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
      </div>
    </nav>
  );
};

export default SideBar;
