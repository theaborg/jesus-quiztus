## Game Start Flow


---

### Overview

1. User navigates to the `/game` route
2. Fills in game options via the setup form
3. Clicks **Start Game**
4. Frontend sends config to Supabase Edge Function
5. Edge Function:
   - Fetches questions from OpenTDB API
   - Creates a new `QuestionsSet`
   - Inserts questions with a foreign key to the set
   - Creates a new `Game` linked to that set
6. User is redirected to `/lobby/:gameId`

---

### Key Files

| File                          | Purpose                                                      |
|------------------------------|--------------------------------------------------------------|
| `src/pages/Game.js`          | Page that contains the game setup logic                     |
| `src/components/GameSetup.jsx` | Form for selecting game settings                           |
| `src/api/startGame.js`       | Calls Supabase Edge Function with user-selected options      |
| `supabase/functions/start-game/index.ts` | Edge Function that handles all backend logic       |
| `src/supabaseClient.js`      | Supabase client instance and auth handling                   |

---

### How Game Start Works

#### 1. `Game.js` Loads
User visits `/game`, which loads `Game.js`. It renders the `GameSetupForm`.

#### 2. `GameSetupForm`
Form UI lets the user configure:
- Category
- Difficulty
- Type
- Encoding
- Number of Questions

On submit, it calls `onStart(formData)`.

#### 3. `handleStart()` in `Game.js`
- Gets the Supabase session and access token
- Calls `startGame(formData, token)` from `startGame.js`

#### 4. `startGame.js`
Sends a `POST` request to the Edge Function:
```http
POST /functions/v1/start-game
Authorization: Bearer <access_token>
Content-Type: application/json

{
  amount, category, difficulty, type, encoding
}
```

#### 5. `start-game/index.ts`
Edge Function does the following:
- Authenticates the user
- Calls OpenTDB API to fetch questions
- Creates a new `QuestionsSet` (uuid generated)
- Inserts each question to `Questions` with `set = QuestionsSet.id`
- Creates a new row in `games` table with `question_set = QuestionsSet.id`
- Returns the `gameId`

#### 6. Redirect
Frontend redirects user to `/lobby/:gameId`.

---

### Supabase Data Relationships

```text
QuestionsSet (id, name, user, category)
    ↑
Questions (id, set → QuestionsSet.id, question, answer, alt_1, alt_2, alt_3)

Games (id, question_set → QuestionsSet.id, state, name, statistics)
```

---

### Notes
- `QuestionsSet.id` must use `uuid_generate_v4()` as default
- Edge Function must pass the user's `access_token` in global headers
- Ensure all foreign keys are properly defined in Supabase schema

