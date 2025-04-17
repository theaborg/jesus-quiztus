import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Game from "./Game";
import { Navigate } from "react-router-dom";
import { navigatorLock } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.unsubscribe?.();
    };
  }, []);
  if (!session) {
    return (
      <div>
        {" "}
        <Signup /> <Login />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {session.user.email}</h1>
      <button onClick={() => Navigate('/Game')}>New Game</button>
      <button onClick={console.log("Join Game")}>Join Game</button>
      <button onClick={console.log("Inv")}>Invitations</button>
      <button onClick={console.log("Profile")}>Profile</button>
      <button onClick={async () => await supabase.auth.signOut()}>
        Log Out
      </button>
    </div>
  );
}
