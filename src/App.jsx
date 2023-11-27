import "./App.css";
import React from "react";
import { LoginForm } from "./components/Login/LoginForm.jsx";
import { RegistrationForm } from "./components/UserRegistration/RegistrationForm.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DMPage from "./components/DirectMessages/DMPage.jsx";
import ChannelPage from "./components/ChannelPage/ChannelPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/messages" element={<DMPage />} />
        <Route path="/channels" element={<ChannelPage />} />
      </Routes>
    </Router>
  );
}

export default App;
