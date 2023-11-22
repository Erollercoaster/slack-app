import React, { useState } from "react";

const ChannelCreationForm = () => {
  const [channelName, setChannelName] = useState("");
  const [userEmailsInput, setUserEmailsInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Split the userEmailsInput string into an array
    const userEmails = userEmailsInput.split(",").map((email) => email.trim());

    try {
      // Convert email addresses to user IDs (assuming you have this API function)
      const userIds = await getUserIdsByEmails(userEmails);

      const response = await createChannel({
        name: channelName,
        user_ids: userIds,
      });
      console.log("Channel created:", response.data);
      // Handle success (e.g., clear form, show message)
      // Reset form fields
      setChannelName("");
      setUserEmailsInput("");
    } catch (error) {
      console.error("Error creating channel:", error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Channel Name"
      />
      <input
        type="text"
        value={userIdsInput}
        onChange={(e) => setUserIdsInput(e.target.value)}
        placeholder="User IDs (comma-separated)"
      />
      <button type="submit">Create Channel</button>
    </form>
  );
};

export default ChannelCreationForm;
