import React, { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios({
        method: "post",
        url: "http://206.189.91.54/api/v1/auth/sign_in", // Adjust the URL as needed
        data: loginData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login successful", response.data);

      // Storing user details in local storage
      localStorage.setItem("userDetails", JSON.stringify(response.data));

      // Additional logic for successful login, e.g., redirect
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error
      );
      // Handle errors, e.g., show error message to the user
    }
  };

  return (
    <div className="login-wrapper">
      <h2>User Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export { LoginForm };
