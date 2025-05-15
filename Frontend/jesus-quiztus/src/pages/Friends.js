import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import UserSearch from "../components/UserSearch";
import { getFriends, setFriendStatus } from "../CRUD/friends";
import { getFriendRequests } from "../CRUD/friends";
import { supabase } from "../supabaseClient";
import { getUser } from "../CRUD/users";

export default function Friends() {
  const { session } = useUser();
  const { userId } = useUser();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // Listener if we need it in the future
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("friendships_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "friendships",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("New friend request received:", payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchFriendsData = async () => {
      // get friends
      const fetchedFriends = await getFriends(userId);
      console.log("Fetched friends: ", fetchedFriends);
      let friendUsers = [];
      for (const relation of fetchedFriends) {
        const otherId =
          relation.user_id !== userId ? relation.user_id : relation.friend_id;
        const friendUser = await getUser(otherId);
        friendUsers.push(friendUser);
      }
      console.log("friend users: ", friendUsers);
      setFriends(friendUsers);

      // get friend requests
      const fetchedRequests = await getFriendRequests(userId);
      const requestArray = Object.values(fetchedRequests);
      const userRequests = await Promise.all(
        requestArray.map(async (request) => {
          const user = await getUser(request.user_id);
          return user;
        })
      );
      setFriendRequests(userRequests);
    };
    fetchFriendsData();
  }, [userId]);

  if (!session) {
    return (
      <div>
        <h1>Please log in to see your friends.</h1>
      </div>
    );
  }

  const handleAcceptFriendRequest = async (friendId, answer) => {
    console.log("accept request");
    await setFriendStatus(userId, friendId, answer);
  };

  return (
    <div>
      <h1 className="second-header-text">Friends</h1>
      <p>{`You have these friends: ${friends
        .map((f) => f.friend_id)
        .join(", ")}`}</p>
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
      <UserSearch />
    </div>
  );
}
