// App.js eller App.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  //TODO: använd miljövariabler istället för att hårdkoda
  //process.env.SUPABASE_URL,
  "https://rixhhkmrhhmiajvxrfli.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDAxODcwOCwiZXhwIjoyMDU5NTk0NzA4fQ.RkbgDMDjUyJGr4Ilg4ppvBbQog3JX3yv8899tbpcyAc"
);



export default function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    await fetch("https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/smart-service", {
      method: "POST",
      body: { name: "Functions" },
    });
  };

  const createUser = async () => {
    const res = await fetch("https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Jesus",
        nickname: "godmaker600",
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
