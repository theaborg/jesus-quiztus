import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  //const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  function generateFakeEmail(domain = "example.com") {
    const randomString = Math.random().toString(36).substring(2, 10); // 8-char random string
    const username = `user_${randomString}`;
    return `${username}@${domain}`;
  }

  const createUser = async (nickname, user_id) => {
    const { data, error } = await supabase.rpc("insert_user", {
      user_name: user_id,
      user_nickname: nickname,
    });

    if (error) {
      console.error("Error inserting user:", error.message);
    } else {
      console.log("User inserted:", data);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    let fake_email = generateFakeEmail("jesusquiztus.se");
    console.log("Fake email:", fake_email);
    const { data, error } = await supabase.auth.signUp({
      email: fake_email,
      password,
    });

    if (error) {
      setMessage(`Fel: ${error.message}`);
    } else {
      setMessage("Konto skapat! Kolla din mejl för bekräftelse.");

      //const user = data.user;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (supabase.auth.getUser()) {
        console.log("User ID:", userdata.user.id);
        await createUser(username, user.UID);
      } else {
        console.log("Waiting for user confirmation before DB insert.");
      }
    }
  };

  //   <input
  //   type="email"
  //   placeholder="Email"
  //   value={email}
  //   onChange={(e) => setEmail(generateFakeEmail("jesusquiztus.se"))}
  //   required
  // />

  return (
    <form onSubmit={handleSignUp}>
      <h2>Skapa konto</h2>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <button type="submit">Registrera</button>
      {message && <p>{message}</p>}
    </form>
  );
}
