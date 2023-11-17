import React, { useState } from "react";
import axios from "axios";

function RegistrationForm() {
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios({
        method: "post",
        url: "http://206.189.91.54/api/v1/auth/",
        data: registrationData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration successful", registrationData);
      // You can handle success, e.g., redirect to login page
    } catch (error) {
      if (error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error("Validation errors:", validationErrors);

        // Display validation errors to the user
        alert(
          `Validation errors:\n${validationErrors.full_messages.join("\n")}`
        );
      } else {
        console.error("Registration failed:", error.response.data);
        // Handle other types of errors
      }
    }
  };

  return (
    <div className="register-wrapper">
      <h2>User Registration</h2>
      <form onSubmit={handleRegistrationSubmit}>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={registrationData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={registrationData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            name="password_confirmation"
            value={registrationData.password_confirmation}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export { RegistrationForm };
