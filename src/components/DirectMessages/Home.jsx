import React, { useState, useEffect } from "react";
import ChannelForm from "../ChannelPage/ChannelForm";
import DMForm from "./DMForm";
import ChatList from "../DirectMessages/ChatList";
import SideBar from "../Navigation/SideBar";
import axiosInstance from "../../utils/API";
import ChatHeader from "../Navigation/ChatHeader";
import RecentConversations from "./RecentConversations";
import Modal from "react-modal";
import Select from "react-select";
import { UserPlus, MousePointerSquare } from "lucide-react";
import { toast } from "react-toastify";

const HomePage = () => {
  const [messages, setMessages] = useState({});
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [chatName, setChatName] = useState("Chats");
  const [chatIcon, setChatIcon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [channelMembers, setChannelMembers] = useState([]);

  useEffect(() => {
    let interval;

    if (selectedChannelId) {
      fetchMessagesForChannel(selectedChannelId);
      interval = setInterval(() => {
        fetchMessagesForChannel(selectedChannelId);
      }, 5000); // fetch new messages every 5 seconds for the channel
    } else if (selectedUserId) {
      fetchMessagesForUser(selectedUserId);
      interval = setInterval(() => {
        fetchMessagesForUser(selectedUserId);
      }, 5000); // fetch new messages every 5 seconds for the user
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedChannelId, selectedUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedHeaders = localStorage.getItem("authHeaders");
        const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

        const response = await axiosInstance.get("/users", {
          headers: authHeaders,
        });

        setUsers(
          response.data.data.map((user) => ({
            value: user.id,
            label: `${user.email.split("@")[0]} (${user.email})`,
          }))
        );
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const fetchMessagesForUser = async (userId) => {
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const response = await axiosInstance.get(
        `/messages?receiver_id=${userId}&receiver_class=User`,
        {
          headers: authHeaders,
        }
      );

      console.log("API response:", response.data.data);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [userId]: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchMessagesForChannel = async (channelId) => {
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const url = `/messages?receiver_id=${channelId}&receiver_class=Channel`;
      const response = await axiosInstance.get(url, { headers: authHeaders });

      const fetchedMessages = response.data.data || [];

      if (fetchedMessages.length === 0) {
      } else {
      }

      setMessages((prevMessages) => ({
        ...prevMessages,
        [channelId]: fetchedMessages,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchChannelDetails = async (channelId) => {
    console.log("Fetching channel details for ID:", channelId);
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const response = await axiosInstance.get(`/channels/${channelId}`, {
        headers: authHeaders,
      });

      console.log("API response for channel details:", response.data.data);
      const channelData = response.data.data;

      const allUsers = await fetchAllUsers();

      const membersDetails = channelData.channel_members
        .map((member) => allUsers.find((user) => user.id === member.user_id))
        .filter(Boolean);

      setChannelMembers(membersDetails);
      return channelData;
    } catch (error) {
      console.error("Error fetching channel details:", error);
      return null;
    }
  };

  const handleSelection = async (
    selectedOption,
    isChannel = false,
    userEmail = ""
  ) => {
    if (isChannel) {
      setSelectedUserId(null);
      setSelectedUserEmail("");
      setSelectedChannelId(selectedOption);
      await fetchMessagesForChannel(selectedOption);

      const channelDetails = await fetchChannelDetails(selectedOption);
      console.log("Fetched channel details:", channelDetails);

      if (channelDetails && channelDetails.name) {
        setChatName(channelDetails.name);
        setChatIcon(
          <div className="chat-icon">
            {channelDetails.name.charAt(0).toUpperCase()}
          </div>
        );
      } else {
        console.log("Channel details missing or name not found");
        setChatName("Unknown");
        setChatIcon(null);
      }
    } else {
      setSelectedChannelId(null);
      setSelectedUserId(selectedOption);
      setSelectedUserEmail(userEmail);
      await fetchMessagesForUser(selectedOption);

      const recentConversations =
        JSON.parse(localStorage.getItem("recentConversations")) || [];
      const isExistingConversation = recentConversations.some(
        (conversation) => conversation.id === selectedOption
      );

      const userName = userEmail.split("@")[0];
      setChatName(userName);
      setChatIcon(
        <div className="chat-icon">{userName.charAt(0).toUpperCase()}</div>
      );

      if (!isExistingConversation) {
        const newConversation = { id: selectedOption, email: userEmail };
        localStorage.setItem(
          "recentConversations",
          JSON.stringify([newConversation, ...recentConversations])
        );
      }
    }
  };

  const addMessage = (receiverId, newMessage, isChannel = false) => {
    setMessages((prevMessages) => {
      let updatedMessages;

      if (isChannel) {
        //logic for adding a message in a channel
        updatedMessages = prevMessages[receiverId]
          ? [...prevMessages[receiverId]]
          : [];
        updatedMessages.push({
          ...newMessage,
          sender: { email: newMessage.senderEmail },
          created_at: new Date().toISOString(),
        });
      } else {
        //logic for adding a direct message to a user
        updatedMessages = [...(prevMessages[receiverId] || []), newMessage];
      }

      return {
        ...prevMessages,
        [receiverId]: updatedMessages,
      };
    });
  };

  const addMemberToChannel = async (channelId, memberId) => {
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const payload = {
        id: channelId,
        member_id: memberId,
      };

      const response = await axiosInstance.post(
        `/channel/add_member`,
        payload,
        {
          headers: authHeaders,
        }
      );

      console.log("Member added to channel:", response.data);

      toast.success("Member added to channel successfully!");
    } catch (error) {
      console.error("Error adding member to channel:", error);
      toast.error("Failed to add member to channel. Please try again.");
    }
  };

  const renderMessages = () => {
    const storedHeaders = localStorage.getItem("authHeaders");
    const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};
    const currentUserEmail = authHeaders.uid;

    const currentMessages = selectedChannelId
      ? messages[selectedChannelId]
      : messages[selectedUserId];

    if (!currentMessages || currentMessages.length === 0) {
      return [];
    }

    // map over the current messages to generate the message components
    return currentMessages.map((msg, index) => {
      // check if the current user is the sender of the message
      const isCurrentUserSender = msg.sender?.email === currentUserEmail;
      // apply 'sender' class if current user sent the message, if not 'receiver'
      const messageClass = isCurrentUserSender ? "sender" : "receiver";

      const senderInitial = msg.sender?.email
        ? msg.sender.email.charAt(0).toUpperCase()
        : "?"; // fallback character if email is not available

      return (
        <div className="messagebox" key={index}>
          <div className={`${messageClass}`}>
            <div className="chat-icon">{senderInitial}</div>
            <div className="message-body">{msg.body}</div>
          </div>
          <div className={`timestamp-${messageClass}`}>
            {new Date(msg.created_at).toLocaleString()}
          </div>
        </div>
      );
    });
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMembers([]);
  };

  const handleMemberChange = (selectedOptions) => {
    setSelectedMembers(selectedOptions);
  };

  const handleAddMembers = async () => {
    for (const member of selectedMembers) {
      await addMemberToChannel(selectedChannelId, member.value);
    }
    closeModal();
  };

  const fetchAllUsers = async () => {
    try {
      const storedHeaders = localStorage.getItem("authHeaders");
      const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

      const response = await axiosInstance.get("/users", {
        headers: authHeaders,
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  return (
    <div className="wrapper">
      <div className="home-wrapper">
        <div className="chatlist-wrapper">
          <h1>Direct Messages</h1>
          <ChatList
            onChannelSelect={(option) => handleSelection(option, true)}
            onUserSelect={(userId, userEmail) =>
              handleSelection(userId, false, userEmail)
            }
          />
          <RecentConversations
            onSelectUser={(userId, userEmail) =>
              handleSelection(userId, false, userEmail)
            }
          />
        </div>
        <div className="sidebar-wrapper">
          <SideBar
            onChannelSelect={(option) => handleSelection(option, true)}
            selectedChannelId={selectedChannelId}
          />
        </div>
        <div className="chatheader-wrapper">
          <ChatHeader
            chatName={chatName}
            icon={chatIcon}
            members={channelMembers}
          />
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            className="add-members"
          >
            <div className="add-member-wrapper">
              <h2>Add Members to Channel</h2>
              <Select
                value={selectedMembers}
                onChange={handleMemberChange}
                options={users}
                placeholder="Select members..."
                isMulti
                className="add-member-select"
              />
              <div className="add-members-buttons-modal">
                <div className="modal-submit-button">
                  <button onClick={handleAddMembers}>Confirm</button>
                </div>
                <div className="modal-close-button">
                  <button onClick={closeModal}>Cancel</button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <div className="message-wrapper">
          {(selectedChannelId || selectedUserId) &&
          renderMessages().length > 0 ? (
            renderMessages()
          ) : (
            <div className="starter-prompt">
              <MousePointerSquare size={150} strokeWidth={0.5} />
              Start a conversation or select a chat to display messages.
            </div>
          )}
          {selectedChannelId && (
            <button className="add-members-button" onClick={openModal}>
              <UserPlus />
            </button>
          )}
        </div>
        {selectedChannelId ? (
          <ChannelForm
            onAddMessage={(newMessage) =>
              addMessage(selectedChannelId, newMessage, true)
            }
            channelId={selectedChannelId}
          />
        ) : (
          <DMForm
            onAddMessage={(newMessage) =>
              addMessage(selectedUserId, newMessage)
            }
            receiverId={selectedUserId}
            receiverEmail={selectedUserEmail}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
