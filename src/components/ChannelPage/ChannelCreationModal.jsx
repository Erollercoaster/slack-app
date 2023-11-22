import React from "react";
import Modal from "react-modal";
import ChannelCreationForm from "./ChannelCreationForm";

const ChannelCreationModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <h2>Create New Channel</h2>
      <ChannelCreationForm />
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ChannelCreationModal;
