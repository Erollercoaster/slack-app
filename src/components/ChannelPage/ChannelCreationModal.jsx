import React, { useState } from "react";
import Modal from "react-modal";
import ChannelCreationForm from "./ChannelCreationForm";
import ChatList from "../DirectMessages/ChatList.jsx";
import { createChannel } from "../../utils/API.jsx";

const ChannelCreationModal = ({ isOpen, onRequestClose }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const handleUsersSelect = (userIds) => {
    setSelectedUserIds(userIds);
    console.log("user ID's: ", userIds);
  };

  const handleFormSubmit = async (channelName) => {
    try {
      const channelData = {
        name: channelName,
        user_ids: selectedUserIds,
      };
      console.log(channelData);
      const response = await createChannel(channelData);
      console.log("Channel created:", response.data);
      onRequestClose();
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <h2>Create New Channel</h2>
      <ChannelCreationForm onSubmit={handleFormSubmit} />
      <ChatList onUserSelect={handleUsersSelect} isMulti={true} />
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ChannelCreationModal;
