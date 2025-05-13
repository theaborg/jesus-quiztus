import UpdateProfileForm from "../components/UpdateProfileForm";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const { session } = useUser("");

  if (!session) {
    return (
      <div>
        <h1>Please log in to see your profile.</h1>
      </div>
    );
  }

  return (
    <div>
      <UpdateProfileForm />
    </div>
  );
}
