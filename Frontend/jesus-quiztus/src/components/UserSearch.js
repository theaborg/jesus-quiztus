import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

const UserSearch = ({ currentUserId }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [addedIds, setAddedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session } = useUser();


  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
    .from('users')
    .select('id, nickname')
    .ilike('nickname', `%${search}%`);

    if (error) {
      console.error(error);
      setResults([]);
    } else {
      setResults(data);
    }

    setLoading(false);
  };

  const addFriend = async (friendId) => {
    const { error } = await supabase.from('friendships').insert({
      user_id: session.user.id,
      friend_id: friendId,
      status: 'pending',
    });

    if (error) {
      console.error('Error adding friend:', error.message);
    } else {
      setAddedIds([...addedIds, friendId]);
    }
  };

  return (
    <div>
      <h2>Search Users</h2>
      <div>
        <input
          type="text"
          placeholder="Enter nickname"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Searching...</p>}

      <ul>
        {results.map((user) => (
          <li key={user.id}>
            {user.nickname}{' '}
            <button
              onClick={() => addFriend(user.id)}
              disabled={addedIds.includes(user.id)}
            >
              {addedIds.includes(user.id) ? 'Request Sent' : 'Add Friend'}
            </button>
          </li>
        ))}
      </ul>

      {results.length === 0 && !loading && <p>No users found.</p>}
    </div>
  );
};

export default UserSearch;
