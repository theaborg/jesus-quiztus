import { resizeImageFile } from "../resizeImageFile.js";

export async function updateProfilePicture(file, userId, accessToken) {
  const resizedFile = await resizeImageFile(file);
  const formData = new FormData();
  formData.append("file", resizedFile);
  formData.append("userId", userId);
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/update-profile-picture",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export async function editNickname(nickname, userId, accessToken) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/update-nickname",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ nickname: nickname, userId: userId }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to edit nickname");
  }

  return result; // success: true
}

export async function getUser(userId, accessToken) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userId: userId }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to get user");
  }

  return result;
}

export async function setGameForUser(gameId, userId, accessToken) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/set-game-for-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userId: userId, gameId: gameId }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to set game for user");
  }

  return result; // success: true
}

// I believe this function is unneeded, but keeping it for now
export async function getUserAvatar(userId, accessToken) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-user-avatar",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userId: userId }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to get user avatar");
  }

  return result.profilePictureUrl; // success: true
}
