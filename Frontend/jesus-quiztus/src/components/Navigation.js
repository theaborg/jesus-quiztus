import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Navigation.scss";

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <div className="navigation">
      <button className="nav-button" onClick={() => navigate("/new-game")}>
        New Game
      </button>
      {/* <button className="nav-button" onClick={() => navigate("/lobby")}>
        Join Game
      </button> */}
      {/* <button onClick={() => pass}>Invitations</button> */}
      <button
        className="nav-button"
        onClick={async () => navigate("/custom-questions")}
      >
        Custom questions
      </button>
      <button className="nav-button" onClick={() => navigate("/profile")}>
        Profile
      </button>
      <button className="nav-button" onClick={() => navigate("/friends")}>
        Friends
      </button>
      <button
        className="nav-button"
        onClick={async () => await supabase.auth.signOut()}
      >
        Log Out
      </button>
    </div>
  );
}
