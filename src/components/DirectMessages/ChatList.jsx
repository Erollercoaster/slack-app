import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/API";
import Select from "react-select";

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Retrieve auth headers from storage
        const storedHeaders = localStorage.getItem("authHeaders");
        const authHeaders = storedHeaders ? JSON.parse(storedHeaders) : {};

        const response = await axiosInstance.get("/users", {
          headers: authHeaders,
        });

        // Use response.data.data to access the actual user data
        setUsers(
          response.data.data.map((user) => {
            // Extract the part of the email before the '@'
            const emailName = user.email.split("@")[0];
            return {
              value: user.id,
              label: `${emailName} (${user.email})`,
            };
          })
        );
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedUser(selectedOption);
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
      />
      {selectedUser && <div>You have selected: {selectedUser.label}</div>}
    </div>
  );
};

export default ChatList;
