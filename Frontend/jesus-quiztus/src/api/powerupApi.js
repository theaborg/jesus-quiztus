export async function sendPowerup(
  gameId,
  senderId,
  receiverId,
  powerType,
  accessToken
) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/send-powerup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        game_id: gameId,
        sender_id: senderId,
        receiver_id: receiverId,
        power_type: powerType,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to send power-up");
  }

  return result; // success: true
}
