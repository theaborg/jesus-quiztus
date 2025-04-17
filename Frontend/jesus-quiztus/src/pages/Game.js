import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Game() {
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
                <h1>Please log in to play the game.</h1>
            </div>
        );
    }
    
}