import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/API";

function RegistrationForm() {
  const navigate = useNavigate();
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
      await axiosInstance.post("/auth", registrationData);

      console.log("Registration successful", registrationData);

      setRegistrationData({
        email: "",
        password: "",
        password_confirmation: "",
      });

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error("Validation errors:", validationErrors);

        alert(
          `Validation errors:\n${validationErrors.full_messages.join("\n")}`
        );
      } else {
        console.error("Registration failed:", error.response.data);
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
