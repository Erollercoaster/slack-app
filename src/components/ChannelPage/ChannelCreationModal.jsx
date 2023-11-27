import React from "react";
import Modal from "react-modal";
import ChannelCreationForm from "./ChannelCreationForm";
import ChatList from "../DirectMessages/ChatList.jsx";
import { createChannel } from "../../utils/API.jsx";
import { useState } from "react";

const ChannelCreationModal = ({ isOpen, onRequestClose }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const handleUsersSelect = (selectedUsers) => {
    setSelectedUserIds(selectedUsers.map((user) => user.id));
  };

  const handleFormSubmit = async (channelName) => {
    try {
      const channelData = {
        name: channelName,
        user_ids: selectedUserIds, // Assuming selectedUserIds holds the IDs of selected users
      };
      const response = await createChannel(channelData);
      console.log("Channel created:", response.data);
      onRequestClose(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating channel:", error);
      // Optionally, handle the error in the UI, like showing a message to the user
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <h2>Create New Channel</h2>
      <ChannelCreationForm
        onSubmit={handleFormSubmit}
        selectedUserIds={selectedUserIds}
      />
      <ChatList onUsersSelect={handleUsersSelect} />
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ChannelCreationModal;
