import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * UserContext provides user stuff that can be shared all around the other components
 * un the app. 
 * Currently shared:
 *  - Session
 *  - Displayname
 *  - UserId
 *  - Supabase client
 */

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    
    if (session) {
      setUserId(session.user.id);
    } else {
      setUserId(null);
    }
  }, [session]);

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", session.user.id)
        .single();

      if (!error && data) {
        setDisplayName(data.nickname);
      }
    };

    fetchDisplayName();
  }, [session]);

  return (
    <UserContext.Provider value={{ session, displayName, userId, supabase }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
