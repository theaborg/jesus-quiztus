import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/LoginForm.scss";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Fel: ${error.message}`);
    } else {
      setMessage("Konto skapat!");

      //const user = data.user;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (supabase.auth.getUser()) {
        console.log("User ID:", userData.user.id);
      } else {
        console.log("Waiting for user confirmation before DB insert.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-div">
          {message}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="input-div">
          {message}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="login-register-buttons">
          <div className="login-button-div">
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="register-button-div">
            <button onClick={handleSignUp} className="register-button">
              {loading ? "Registering ..." : "Register"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
