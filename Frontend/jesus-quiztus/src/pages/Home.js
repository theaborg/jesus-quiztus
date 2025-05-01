import React, { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import { useUser } from "../context/UserContext";
import Navigation from "../components/Navigation";

export default function Home() {
  //const [session, setSession] = useState(null);
  const { displayName, session } = useUser();

  /*
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
  */

  if (!session) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <Navigation />
    </div>
  );
}
