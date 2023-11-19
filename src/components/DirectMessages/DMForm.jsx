import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/API";

const DMForm = ({ onAddMessage, receiverId, receiverEmail }) => {
  const [message, setMessage] = useState({
    receiverId: receiverId || "",
    receiverClass: "User",
    body: "",
  });

  useEffect(() => {
    setMessage((prevMessage) => ({
      ...prevMessage,
      receiverId: receiverId || "",
    }));
  }, [receiverId]);

  const handleInputChange = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const requestBody = {
        receiver_id: parseInt(message.receiverId),
        receiver_class: message.receiverClass,
        body: message.body,
      };

      const response = await axiosInstance.post("/messages", requestBody, {
        headers: authHeaders,
      });

      console.log("Message sent:", response.data);

      if (onAddMessage) {
        onAddMessage(message.receiverId, {
          body: message.body,
        });
      }

      setMessage({
        ...message,
        body: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Send Direct Message</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Receiver ID:</label>
          <input
            type="text"
            name="receiverId"
            value={message.receiverId}
            onChange={handleInputChange}
            disabled={!!receiverId}
          />
        </div>
        <div className="send-message-container">
          <textarea
            name="body"
            value={message.body}
            onChange={handleInputChange}
            placeholder={`Message ${receiverEmail ? `(${receiverEmail})` : ""}`}
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default DMForm;
