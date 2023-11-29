import React, { useState } from "react";
import axiosInstance from "../../utils/API";
import { Send } from "lucide-react";

const ChannelForm = ({ onAddMessage, channelId }) => {
  const [message, setMessage] = useState({
    body: "",
  });

  const handleInputChange = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const requestBody = {
        receiver_id: channelId,
        receiver_class: "Channel",
        body: message.body,
      };

      const response = await axiosInstance.post("/messages", requestBody, {
        headers: authHeaders,
      });

      console.log("Message sent:", response.data);

      if (onAddMessage) {
        onAddMessage(channelId, {
          body: message.body,
        });
      }

      setMessage({ body: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="send-message-container">
          <input
            type="text"
            name="body"
            value={message.body}
            onChange={handleInputChange}
            placeholder={`Message #${channelId}`}
            className="send-message-input"
          />
          <button type="submit" className="send-message-button">
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChannelForm;
