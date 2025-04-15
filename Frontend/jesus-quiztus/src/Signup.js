import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  //const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  

  function generateFakeEmail(domain = "example.com") {
    const randomString = Math.random().toString(36).substring(2, 10); // 8-char random string
    const username = `user_${randomString}`;
    return `${username}@${domain}`;
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    let fake_email = generateFakeEmail("jesusquiztus.se");
    console.log("Fake email:", fake_email);
    const { data, error } = await supabase.auth.signUp({
      email: fake_email,
      password: password,
      options: {
        data: {
          name: name,
          nickname: username,
        }
      }
    });

    if (error) {
      setMessage(`Fel: ${error.message}`);
    } else {
      setMessage("Konto skapat! Kolla din mejl för bekräftelse.");

      //const user = data.user;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (supabase.auth.getUser()) {
        console.log("User ID:", userData.user.id);
        //await createUser(username, user.UID);
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
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Registrera</button>
      {message && <p>{message}</p>}
    </form>
  );
}
