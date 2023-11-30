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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="modal-react-wrapper"
    >
      <div className="modal-wrapper">
        <div className="modal-header">
          <h2>Create New Channel</h2>
        </div>
        <div className="modal-react-select">
          <ChatList onUserSelect={handleUsersSelect} isMulti={true} />
        </div>

        <div className="modal-submit-button">
          <ChannelCreationForm onSubmit={handleFormSubmit} />
        </div>
        <div className="modal-close-button">
          <button onClick={onRequestClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default ChannelCreationModal;
