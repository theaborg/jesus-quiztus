import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { editNickname } from "../api/editNickname";
import { updateProfilePicture } from "../api/updateProfilePicture";
import "../styles/UpdateProfileForm.scss";

export default function UpdateProfileForm() {
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
    if (data.profile_picture) {
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
        console.log("Public URL:", result.publicUrl);
        setAvatarUrl(result.publicUrl);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error.message);
      alert("Something went wrong. Please try again.");
    }
    getProfileImage();
  };

  const handleNicknameChange = async (e) => {
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

  const [isEditable, setIsEditable] = useState("");

  return (
    <div className="profile-form">
      <div className="nickname-container">
        {/* <div className="profile-picture-container"> */}
        <label className="second-header-text">Profile picture</label>
        <img
          src={avatarUrl || "/profile_picture.jpg"}
          alt="Profile"
          className="profile-image"
        />
        <input
          type="file"
          id="upload-input"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />

        <label htmlFor="upload-input" className="upload-button">
          Upload new
        </label>
        {/* </div> */}

        <label className="second-header-text">Nickname</label>
        <input
          className={`nickname-input ${
            !isEditable ? "display-nickname-input" : "edit-nickname-input"
          }`}
          type="Nickname"
          placeholder={displayName}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          readOnly={!isEditable}
        />
        <button
          className="in-app-button"
          onClick={() => {
            if (isEditable) {
              handleNicknameChange();
            }
            setIsEditable(!isEditable);
          }}
        >
          {isEditable ? "Save nickname" : "Edit nickname"}
        </button>
      </div>
    </div>
  );
}
