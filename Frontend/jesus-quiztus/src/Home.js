import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import Signup from "./Signup";

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
    return <div> <Signup /> <Login /></div>;
  }

  return (
    <div>
      <h1>Welcome {session.user.email}</h1>
      <button onClick={async () => await supabase.auth.signOut()}>
        Log Out
      </button>
    </div>
  );
}
