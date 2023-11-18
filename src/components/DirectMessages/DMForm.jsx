import React, { useState } from "react";
import axiosInstance from "../../utils/API";

const DMForm = () => {
  const [message, setMessage] = useState({
    receiverId: "",
    receiverClass: "User", // Defaulting to 'User', change as needed
    body: "",
  });

  const handleInputChange = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your auth headers here
      const authHeaders = {
        "access-token": "your-access-token",
        client: "your-client",
        expiry: "your-expiry",
        uid: "your-uid",
      };

      const response = await axiosInstance.post("/messages", message, {
        headers: authHeaders,
      });
      console.log("Message sent:", response.data);
      // Clear the form or handle the response as needed
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
          />
        </div>
        <div>
          <textarea
            name="body"
            value={message.body}
            onChange={handleInputChange}
            placeholder="Message"
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default DMForm;
