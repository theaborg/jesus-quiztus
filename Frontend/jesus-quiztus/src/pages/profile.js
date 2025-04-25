import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

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
    const file = e.target.files[0];
    if (!file || !session?.user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `profile.${fileExt}`; // valfritt namn på bilden
    const filePath = `${session.user.id}/${fileName}`; // mapp = user id

    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return;
    }

    // Sparar bildens namn i databasen, för användaren kan ladda upp flera bilder
    await supabase
      .from("users")
      .update({ profile_picture: fileName })
      .eq("id", session.user.id);

    // Hämta public URL för bilden
    const { data: urlData, error: urlError } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);

    if (urlError) {
      console.error("Could not get public URL:", urlError.message);
    } else {
      setAvatarUrl(urlData.publicUrl);
    }
  };

  if (!session) {
    return (
      <div>
        <h1>Please log in to see your profile.</h1>
      </div>
    );
  }

  const handleNicknameChange = async (e) => {
    e.preventDefault();
    await supabase
      .from("users")
      .update({ nickname: nickname })
      .eq("id", session.user.id);

    console.log("Nickname changed to:", nickname);
  };

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
        <button className="edit-username" onClick={handleNicknameChange}>
          Edit username
        </button>
      </form>
    </div>
  );
}
