export async function addFriend(friendId, userId, access_token) {
    //console.log('Adding friend:', friendId, userId, access_token);
    const response = await fetch('https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/add-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        friend_id: friendId,
      }),
    });
  
    const result = await response.json();
  
    
  if (!response.ok) {
    throw new Error(result.error || 'Failed to add friend');
  }

  return result; // success: true
  };


  