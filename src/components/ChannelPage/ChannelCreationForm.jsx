import { useState } from "react";

const ChannelCreationForm = ({ onSubmit }) => {
  const [channelName, setChannelName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(channelName);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="channelName">Channel Name:</label>
        <input
          type="text"
          id="channelName"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Channel</button>
    </form>
  );
};

export default ChannelCreationForm;
