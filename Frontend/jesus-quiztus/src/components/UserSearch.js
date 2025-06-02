import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useUser } from "../context/UserContext";
import { addFriend } from "../api/friendsApi";
import "../styles/UserSearch.scss";

const UserSearch = ({ currentUserId }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [addedIds, setAddedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session, userId } = useUser();

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, nickname")
      .ilike("nickname", `%${search}%`);

    if (error) {
      console.error(error);
      setResults([]);
    } else {
      setResults(data);
    }

    setLoading(false);
  };

  const handleAddFriend = async (friendId) => {
    try {
      const result = await addFriend(friendId, userId, session.access_token);
      if (result.success) {
        setAddedIds([...addedIds, friendId]);
        alert("Friend request sent successfully!");
      }
    } catch (error) {
      console.error("Error sending friend request:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="user-search-container">
      <label className="second-header-text">Search Users</label>

      <input
        className="edit-nickname-input"
        type="text"
        placeholder="Enter nickname"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Searching...</p>}

      <ul>
        {results.map((user) => (
          <li key={user.id}>
            {user.nickname}{" "}
            <button
              onClick={() => handleAddFriend(user.id)}
              disabled={addedIds.includes(user.id)}
            >
              {addedIds.includes(user.id) ? "Request Sent" : "Add Friend"}
            </button>
          </li>
        ))}
      </ul>

      {results.length === 0 && !loading && (
        <p className="user-result-text">No users found.</p>
      )}

      <button className="in-app-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default UserSearch;
