import "./App.css";
import React from "react";
import { LoginForm } from "./components/Login/LoginForm.jsx";
import { RegistrationForm } from "./components/UserRegistration/RegistrationForm.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
