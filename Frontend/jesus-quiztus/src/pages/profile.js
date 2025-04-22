import { useUser } from "../context/UserContext";

export default function Profile() {
  const { displayName } = useUser();
  const { session } = useUser();

  if (!session) {
    return (
      <div>
        <h1>Please log in to see your profile.</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Profile Picture</p>
      <p>Username: {displayName}</p>
      <button> </button>
    </div>
  );
}
