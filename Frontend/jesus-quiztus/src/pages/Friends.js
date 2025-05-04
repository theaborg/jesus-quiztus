import { useUser } from "../context/UserContext";
import UserSearch from "../components/UserSearch";

export default function Friends() {
  const { session } = useUser();

  if (!session) {
    return (
      <div>
        <h1>Please log in to see your friends.</h1>
      </div>
    );
  }

  // TODO: we should display the friends list here
  return (
    <div>
      <h1 className="second-header-text">Friends</h1>
      <UserSearch />
    </div>
  );
}
