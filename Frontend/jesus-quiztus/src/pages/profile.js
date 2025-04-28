import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { editNickname } from "../api/editNickname";
import { updateProfilePicture } from "../api/updateProfilePicture";

export default function Profile() {
  const { session, displayName } = useUser("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nickname, setNickname] = useState("");

  const getProfileImage = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("users")
      .select("profile_picture")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile_url:", error.message);
      return;
    }

    if (data) {
      const { data: urlData, error: urlError } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(`${session.user.id}/${data.profile_picture}`);

      if (urlError) {
        console.error("Error getting public URL:", urlError.message);
      } else {
        setAvatarUrl(urlData.publicUrl);
      }
    }
  };

  useEffect(() => {
    getProfileImage();
  }, [session]);

  const handleImageUpload = async (e) => {
    try {
      const result = await updateProfilePicture(
        e.target.files[0],
        session.user.id,
        session.access_token
      );
      if (result.success) {
        alert("Profile picture updated successfully!");
        console.log("Public URL:", result.publicUrl);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleNicknameChange = async (e) => {
    e.preventDefault();

    try {
      const result = await editNickname(
        nickname,
        session.user.id,
        session.access_token
      );
      if (result.success) {
        alert("Nickname updated successfully!");
      }
    } catch (error) {
      console.error("Error updating nickname:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!session) {
    return (
      <div>
        <h1>Please log in to see your profile.</h1>
      </div>
    );
  }
  // TODO: ta bort <br> efter image när vi lägger till css
  // TODO: to bort style på bilden när vi lägger till css
  getProfileImage();

  return (
    <div>
      <h1>Profile Page</h1>
      <img
        src={avatarUrl || "/profile_picture.jpg"}
        alt="Profile"
        className="profile-image"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
      <br />
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <form>
        <input
          type="Nickname"
          placeholder={displayName}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button className="edit-nickname" onClick={handleNicknameChange}>
          Edit nickname
        </button>
      </form>
    </div>
  );
}
