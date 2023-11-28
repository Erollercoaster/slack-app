import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/API";
import Select from "react-select";

const ChatList = ({ onUserSelect, isMulti = false }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(isMulti ? [] : null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (selectedOptions) => {
    setSelectedUser(selectedOptions);

    if (isMulti) {
      const userIds = selectedOptions.map((option) => option.value);
      onUserSelect(userIds);
    } else {
      if (selectedOptions) {
        const userId = selectedOptions.value;
        const userEmail = selectedOptions.label
          .split(" ")[1]
          .replace(/[()]/g, "");
        onUserSelect(userId, userEmail);
      } else {
        onUserSelect(null, null);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div>
      <h2>Available Users</h2>
      <Select
        value={selectedUser}
        onChange={handleChange}
        options={users}
        placeholder="Search by email..."
        isClearable
        isSearchable
        isMulti={isMulti}
      />
    </div>
  );
};

export default ChatList;
