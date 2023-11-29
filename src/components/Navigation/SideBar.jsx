import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import ChannelCreationModal from "../ChannelPage/ChannelCreationModal";
import axiosInstance from "../../utils/API";
import { ContextMenu } from "../ChannelPage/ContextMenu";
import { Plus, MessagesSquare } from "lucide-react";

const SideBar = ({ onChannelSelect, selectedChannelId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axiosInstance.get("/channels");
        let apiChannels = response.data.data;

        // Retrieve left channels from local storage
        const leftChannelIds =
          JSON.parse(localStorage.getItem("leftChannels")) || [];

        // Filter out channels that the user has left
        apiChannels = apiChannels.filter(
          (channel) => !leftChannelIds.includes(channel.id)
        );

        setChannels(apiChannels);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, []);

  const onSelectChannel = (channelId) => {
    if (typeof onChannelSelect === "function") {
      onChannelSelect(channelId);
    } else {
      console.error("onChannelSelect is not a function", onChannelSelect);
    }
  };

  const handleContextMenu = (event, channelId) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      channelId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const leaveChannel = (channelId) => {
    // Add channelId to the list of left channels in local storage
    const leftChannelIds =
      JSON.parse(localStorage.getItem("leftChannels")) || [];
    if (!leftChannelIds.includes(channelId)) {
      leftChannelIds.push(channelId);
      localStorage.setItem("leftChannels", JSON.stringify(leftChannelIds));
    }

    // Update state to remove the channel
    const updatedChannels = channels.filter(
      (channel) => channel.id !== channelId
    );
    setChannels(updatedChannels);
    setContextMenu(null); // Close the context menu
  };

  const handleLogout = () => {
    localStorage.removeItem("authHeaders");
    window.location.href = "/";
  };

  return (
    <nav>
      <div className="sidebar-wrapper">
        <button onClick={handleLogout} className="logout-button">
          <LogOut />
        </button>
        <div
          className="home-button"
          // onClick={handleHomeClick}
        >
          <MessagesSquare />
        </div>
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${
              selectedChannelId === channel.id ? "selected" : ""
            }`}
            onClick={() => onSelectChannel(channel.id)}
            onContextMenu={(e) => handleContextMenu(e, channel.id)}
          >
            {channel.name.charAt(0).toUpperCase()}
          </div>
        ))}
        <button
          className="create-channel-button"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus />
        </button>
        <ChannelCreationModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        />
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onLeaveChannel={() => leaveChannel(contextMenu.channelId)}
          onMuteChannel={() =>
            console.log("Mute channel", contextMenu.channelId)
          }
          onClose={closeContextMenu}
        />
      )}
    </nav>
  );
};

export default SideBar;
