// App.js eller App.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rixhhkmrhhmiajvxrfli.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg3MDgsImV4cCI6MjA1OTU5NDcwOH0.0vubc3l45l2WK8QBlFZNqZwjzJ-1TopoHC1cljVD7RM"
);

export default function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    await fetch("https://rixhhkmrhhmiajvxrfli.supabase.co/smart-service", {
      method: "POST",
      body: { name: "Functions" },
    });
  };

  const createUser = async () => {
    //const res = await fetch("https://rixhhkmrhhmiajvxrfli.functions.supabase.co/create-user", {
    const res = await fetch("http://localhost:54321/functions/v1/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "jesus1234",
        username: "godmaker600",
        name: "Jesus",
      }),
    });
  
    const data = await res.json();
    console.log(data);
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
    <div>
      <button onClick={sendMessage}>Skicka meddelande</button>
      <button onClick={createUser}>Skapa användare</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.content}</li>
        ))}
      </ul>
    </div>
  );
}
