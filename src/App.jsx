import "./App.css";
import React from "react";
import SignIn from "./components/Login/LoginForm.jsx";
import { RegistrationForm } from "./components/UserRegistration/RegistrationForm.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DMPage from "./components/DirectMessages/DMPage.jsx";
import ChannelPage from "./components/ChannelPage/ChannelPage.jsx";
import HomePage from "./components/DirectMessages/Home.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./utils/PrivateRoute.jsx";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
