import { useEffect, useState, React } from "react";
import Home from "./pages/Home";
import Signup from "./components/Signup";
import Login from "./components/LoginForm";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import GameLobby from "./pages/GameLobby";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import "./styles/App.scss";
import Header from "./components/Header";

export default function App() {
  const [messages, setMessages] = useState([]);
  const { supabase } = useUser();

  const sendMessage = async () => {
    await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/smart-service",
      {
        method: "POST",
        body: { name: "Functions" },
      }
    );
  };

  useEffect(() => {
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("Nytt meddelande:", payload.new);
          setMessages((msgs) => [...msgs, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
          </Routes>
        </UserProvider>
      </div>
    </Router>
  );
}
