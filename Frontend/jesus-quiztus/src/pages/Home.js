import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Home() {
  const [session, setSession] = useState(null);
  const { displayName } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {session.user.email}</h1>
      <h1>User ID: {session.user.id}</h1>
      <h1>Nickname: {displayName}</h1>
      <button onClick={() => navigate("/new-game")}>New Game</button>
      <button onClick={console.log("Join Game")}>Join Game</button>
      <button onClick={console.log("Inv")}>Invitations</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button onClick={() => navigate("/friends")}>Friends</button>
      <button onClick={async () => await supabase.auth.signOut()}>
        Log Out
      </button>
    </div>
  );
}
