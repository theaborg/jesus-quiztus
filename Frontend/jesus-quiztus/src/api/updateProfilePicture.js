export async function updateProfilePicture(file, user_id, access_token) {
  console.log("Updating profile picture:", file, user_id, access_token);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", user_id);
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/update_profile_picture",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to update profile picture");
  }

  return result;
}
