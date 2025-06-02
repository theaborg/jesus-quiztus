import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { editNickname, updateProfilePicture, getUser } from "../api/userApi";
import "../styles/UpdateProfileForm.scss";

export default function UpdateProfileForm() {
  const { session, displayName } = useUser();
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  async function getProfile() {
    try {
      const profile = await getUser(session.user.id, session.access_token);
      if (profile.success) {
        setProfilePictureUrl(
          profile.data.profilePictureUrl || "/images/profile_picture.jpg"
        );
        setNickname(profile.data.nickname || displayName);
      } else {
        console.error("Failed to fetch user profile:", profile.error);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  }

  useEffect(() => {
    if (!session) return;
    getProfile();
  }, [session]);

  const handleImageUpload = async (e) => {
    try {
      const result = await updateProfilePicture(
        e.target.files[0],
        session.user.id,
        session.access_token
      );
      if (result.success) {
        setProfilePictureUrl(result.publicUrl);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error.message);
      alert("Something went wrong. Please try again.");
    }
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

  return (
    <div className="profile-form">
      <div className="nickname-container">
        {/* <div className="profile-picture-container"> */}
        <label className="second-header-text">Profile picture</label>
        <img
          src={profilePictureUrl || "/images/profile_picture.jpg"}
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
          type="text"
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
