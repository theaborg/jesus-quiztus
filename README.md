# Run project

You can check out the app at https://jesus-quiztus.vercel.app/

Alternatively, you can follow these steps (note that you'll have to reach out to us to get the environment variables):


1. Clone the repo.
2. Run these commands in the terminal:
- cd Frontend/jesus-quiztus/
- npm install
- npm start
3. Check the app out at localhost.

# Jesus Quiztus specification

The aim of this project is to create a focused and detailed project, without using a lot of boilerplate code. The project should also be focused around frontend. This specification will be a so-called living document, meaning we will update it as needed during the project.

## Functional specifications

In this section we will explain what our web app will look like from a user perspective.

### System overview

We plan on creating a web app where the user can play a quiz with one or multiple other people. The game is intended for social gatherings where all players play at the same time, but if we have enough time we intend to also enable asynchronous participation (i.e. one player may answer the quiz before the other participant/s). 

### Functional requirements

The priorities in table 1 have been defined as follows:   
Priority 1 \= Basic, mandatory functionality making up the MVP  
Priority 2 \= Mandatory extended functionality to implement after creating the MVP  
Priority 3 \= Optional functionality to add if we have the time after meeting the requirements with priority 1 and 2\.

***Table 1: A user should be able to do the following***

| Requirement | Priority |
| :---- | :---- |
| Log in. | 1 |
| Log out. | 1 |
| Start game. | 1 |
| Select a category of questions which are fetched from a trivia API when starting the game. | 1 |
| Add a custom set of questions. | 2 |
| Create a custom question consisting of a text followed by 4 alternatives (in text). | 2 |
| Create a custom question consisting of a picture followed by a map, where the players are supposed to mark the correct location where the picture was taken | 3 |
| Select a custom set of questions added by the user when starting a game. | 2 |
| Select a set of AI generated questions when starting a game. | 3 |
| Join an existing game created by another user, by entering some unique code. | 1 |
| Play a game by answering a series of trivia questions. | 1 |
| Send power ups and debuffs to other game participants during a game. | 1 |
| See statistics from previously finished games. | 2 |
| Compare statistics with other users | 3 |
| Edit profile name and picture. | 1 |
| Search for other users. | 1 |
| Mark other users as *favorites.* | 2 |
| Send and respond to friend requests between users. | 3 |
| Send messages between users. | 3  |
| Send game invitations to users. | 3 |
| Play a game with one or more other users asynchronously. | 3 |
| Use the web app in a web browser. | 1 |

### User handling

The user should be able to perform all activities mentioned in table 1 in an app with components similar to the pictured prototypes in the folder called *Figma prototyping*. 

## Technical specifications

Below are the libraries, frameworks and tools that we have chosen for this project.

### Tech Stack

**Frontend**

- React: In this project React has been chosen as the frontend framework. React is a “east-to-understand” framework that gives the project team a intuitive way of forming the frontend. This offers good opportunities to come up with new ideas and ways to use it.  
- Supabase Realtime: We plan on using the WebSockets.IO-based Supabase Realtime to transfer information between connected clients. 

**Backend/logic**

- Supabase RestAPI: For simple CRUD operations in the database, we will use Supabase RestAPI. We plan on using a serverless solution, as we are interested in learning modern architecture and keeping the project’s focus on the frontend. Supabase is one of the leading open source Backend as a Service (BaaS) products, with a lot of functionality, which is why we chose this specific product.  
- Supabase Edge Functions: We plan on using edge functions for more complex logic and operations.

**Database**

- Supabase PostgreSQL: We will use a Supabase PostgreSQL database for this project.

**Authorization**

- Supabase Auth: (see more details under *Security*)

### Database schema		

A visualisation of the database schema can be found in the file Database\_Schema.pdf

- User: The user entity will contain attributes such as id \[key\], name, profile picture, friends, active games, finished games and custom question sets made up by the user.  
- Game: This entity contains; id \[key\], state of the game (ongoing / finished), winner statistics and the set of questions that are being played.  
- QuestionsSet: This is the entity that contains a number of questions. Attributes included are, id \[key\], name of the set, category (MEJBI) and questions.  
- Question: Contains; id \[key\], questions, the alternatives and the correct answer.  
- Messages \[Prio 2\]: This entity contains chat messages sent between users. This is a feature that is classed as a lower priority until we know how complex the ground setup will be. Contains, id \[key\], sender-id, receiver-id, the text message and the timestamp for message sent.  
- PowerUp:  This entity contains different powerup’s that allow users either advantages or the possibility to sabotage the other user’s in-game. Contains, sender-id \[key\], receiver-id\[key\] and the type of powerup.

### API-design

**Edge functionality:** 

* We will use Supabase Edge for functions such as:  
  * Starting new game sessions with two registered users  
  * Evaluating game status / results  
  * Updating user stats depending on game outcomes  
  * Applying powerups and managing the effects they have in-game  
  * Generating and managing a leaderboard.

**CRUD functionality:**

* Supabase’s REST API will be able to help handling functions such as:  
  * Creating and updating user profiles  
  * Friends request’s  
  * Creating questions and question sets.

**Trivia-API:**

- The trivia questions will be imported through the external trivia API *OpenTDB*. *Open Trivia DB* offers at least 4000 verified trivia questions in different categories for free.  
- [https://medium.com/%40c\_yatteau/4-trivia-apis-no-api-key-required-840ecf0d175](https://medium.com/%40c_yatteau/4-trivia-apis-no-api-key-required-840ecf0d175)

### Security

**Authentications:**

- Supabase Auth, is a great tool for handling authentication and authorization. This supports email/password and helps to check if a user is who they say they are.  
- Authorization wise supabase auth uses RLS (Row Level Security) as a part of checking what resources a user is allowed access to.  
- [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Performance

**Edge & Realtime:**

- To conduct real time updates, Websocket channels are used to be as efficient as possible.  
- To reduce latency for heavier loaded calculations the edge functions are spread globally. This means that the functionality wont be run on a server in the US if the user is in the EU. In this case a server in closer proximity to the user will be chosen and the latency shortened. 

### Development strategy

**gitlab:**

- All newly developed code will be pushed to branches in gitlab to a shared project.   
- Ideally the gitlab issue board will be used to set up issues that are to be closed and handled.  
- When the code foundation is laid and the game frontend is to be developed, this will be through branches that are merged into the foundation when branches are tested and approved by both team members.

**(Somewhat) Agile & iterative:**

- The development process is going to be agile and iterative in the way that all code should be understood by all team members before taken into use.   
- We will start by implementing a minimum viable product (MVP) and add functionality in iterations, according to the priority.  
- Each week will have its own goal and mission that the team members will actively work towards with a debrief at the end of the week.  
- At the end of each week, meetings and planned work for the coming week will be scheduled.

**Code Quality:**

- To keep code consistency and safety a linter will be used such as Prettier or ESLint.

**Testing:**

- For unit testing Vitest will be considered.  
- If there is time UX testing will be conducted with friends, family and classmates.
