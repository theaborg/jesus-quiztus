export async function editNickname(nickname, user_id, access_token) {
  //console.log('Adding friend:', friendId, userId, access_token);
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/update_nickname",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ nickname: nickname, user_id: user_id }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to edit nickname");
  }

  return result; // success: true
}
