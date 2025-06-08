import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import UserSearch from "../components/UserSearch";
import {
  getFriends,
  answerFriendRequest,
  getFriendRequests,
} from "../api/friendsApi";
import { supabase } from "../supabaseClient";
import { getUser } from "../api/userApi";

export default function Friends() {
  const { session, userId } = useUser();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // Listener if we need it in the future
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel("friendships_channel");

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "friendships",
          filter: `friend_id=eq.${userId}`,
        },
        fetchFriendsData
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "friendships",
          filter: `user_id=eq.${userId}`,
        },
        fetchFriendsData
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "friendships",
          filter: `user_id=eq.${userId}`,
        },
        fetchFriendsData
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "friendships",
          filter: `friend_id=eq.${userId}`,
        },
        fetchFriendsData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetchFriendsData();
  }, [userId]);

  if (!session) {
    return (
      <div>
        <h1>Please log in to see your friends.</h1>
      </div>
    );
  }
  const fetchFriendsData = async () => {
    const fetchedFriends = await getFriends(userId, session.access_token);
    let friendUsers = [];
    for (const relation of fetchedFriends.data) {
      const otherId =
        relation.user_id !== userId ? relation.user_id : relation.friend_id;
      const friendUser = await getUser(otherId, session.access_token);
      friendUsers.push(friendUser.data);
    }
    setFriends(friendUsers);

    // get friend requests

    const requestArray = await getFriendRequests(userId, session.access_token);
    const userRequests = await Promise.all(
      requestArray.map(async (request) => {
        const user = await getUser(request.user_id, session.access_token);
        return user.data;
      })
    );
    setFriendRequests(userRequests);
  };

  const handleAcceptFriendRequest = async (friendId, answer) => {
    console.log("Accepting friend request:", friendId, answer);
    await answerFriendRequest(userId, friendId, answer, session.access_token);
  };

  return (
    <div>
      <div className="friends-header">
        <h1 className="second-header-text">Friends</h1>
        {/* <p>{`You have these friends: ${friends
          .map((f) => f.friend_id)
          .join(", ")}`}</p> */}
        <ul>
          {friends.map((friend, index) => (
            <li key={index}>{friend.nickname}</li>
          ))}
        </ul>
        <h1 className="second-header-text">Friends Requests</h1>
        <ul>
          {friendRequests.map((friend) => (
            <li key={friend.id}>
              <p>{friend.nickname}</p>
              <button
                onClick={() => handleAcceptFriendRequest(friend.id, "accepted")}
              >
                Accept
              </button>
              <button
                onClick={() => handleAcceptFriendRequest(friend.id, "rejected")}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      </div>
      <UserSearch />
    </div>
  );
}
