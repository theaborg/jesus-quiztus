import { useUser } from "../context/UserContext";
import "../styles/Header.scss";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { session, userId } = useUser();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className={`header-div ${
        !session?.user ? "login-header-div" : "default-header-div"
      }`}
    >
      <img
        className={`header-img ${
          !session?.user ? "login-header-img" : "default-header-img"
        }`}
        src="/images/jesus-quiztus.png"
        alt="Jesus"
      />
      <h1 className="header-text">Jesus Quiztus</h1>
    </div>
  );
}
