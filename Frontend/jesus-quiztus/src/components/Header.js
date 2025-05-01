import { useUser } from "../context/UserContext";
import "../styles/Header.scss";

export default function Header() {
  const { session, userId } = useUser();

  return (
    <div
      className={`header-div ${
        !session?.user ? "login-header-div" : "default-header-div"
      }`}
    >
      <img
        className={`header-img ${
          !session?.user ? "login-header-img" : "default-header-img"
        }`}
        src="temp_logo.png"
        alt="Jesus"
      />
      <h1 className="header-text">Jesus Quiztus</h1>
    </div>
  );
}
