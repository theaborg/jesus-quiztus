import { useEffect, useState, React } from "react";
import Home from "./pages/Home";
import Signup from "./components/Signup";
import Login from "./components/LoginForm";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import GameLobby from "./pages/GameLobby";
import CustomQuestions from "./pages/CustomQuestions";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import "./styles/App.scss";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new-game" element={<Game />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/lobby/:gameId" element={<GameLobby />} />
            <Route path="/lobby" element={<GameLobby />} />
            <Route path="/custom-questions" element={<CustomQuestions />} />
          </Routes>
        </UserProvider>
      </div>
    </Router>
  );
}
