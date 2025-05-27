export async function addFriend(friendId, userId, accessToken) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/add-friend",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        friendId: friendId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to add friend");
  }

  return result; // success: true
}

export async function getFriends(userId, accessToken) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-friends",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to get friends");
  }

  return result; // success: true
}

export async function answerFriendRequest(
  friendId,
  userId,
  answer,
  accessToken
) {
  console.log("Answering friend request:", friendId, userId, answer);
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/answer-friend-request",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        friendId: friendId,
        answer: answer, // "accepted" for accept, "rejected" for reject
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to answer friend request");
  }

  return result; // success: true
}

export async function getFriendRequests(userId, accessToken) {
  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-friend-requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userId }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to get friend requests");
  }

  return result.data;
}
