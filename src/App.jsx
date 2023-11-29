import "./App.css";
import React from "react";
import SignIn from "./components/Login/LoginForm.jsx";
import { RegistrationForm } from "./components/UserRegistration/RegistrationForm.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DMPage from "./components/DirectMessages/DMPage.jsx";
import ChannelPage from "./components/ChannelPage/ChannelPage.jsx";
import HomePage from "./components/DirectMessages/Home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/messages" element={<DMPage />} />
        <Route path="/channels" element={<ChannelPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
