// App.js eller App.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Home from "./pages/Home";
import Signup from "./components/Signup";
import Login from "./components/LoginForm";
import Game from "./pages/Game";
import Profile from "./pages/profile";
import Friends from "./pages/Friends";
import GameLobby from "./pages/GameLobby";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

const supabase = createClient(
  //TODO: använd miljövariabler istället för att hårdkoda
  //process.env.SUPABASE_URL,
  "https://rixhhkmrhhmiajvxrfli.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDAxODcwOCwiZXhwIjoyMDU5NTk0NzA4fQ.RkbgDMDjUyJGr4Ilg4ppvBbQog3JX3yv8899tbpcyAc"
);

export default function App() {
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  console.log("App laddades!");

  // return (
  //   <div>
  //     {!session && (
  //       <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  //     )}

  //     <div>
  //       {session ? <p>Logged in!</p> : <p>Not logged in</p>}
  //       <button onClick={sendMessage}>Skicka meddelande</button>
  //       <button onClick={createUser}>Skapa användare</button>
  //       <ul>
  //         {messages.map((msg) => (
  //           <li key={msg.id}>{msg.content}</li>
  //         ))}
  //       </ul>
  //     </div>
  //   </div>
  // );

  return (
    <Router>
      <div>
        <h1>Jesus Quiztus!</h1>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new-game" element={<Game />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/lobby/:gameId" element={<GameLobby />} />
          </Routes>
        </UserProvider>
      </div>
    </Router>
  );
}
