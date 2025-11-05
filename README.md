SlotSwapper App

SlotSwapper is a peer-to-peer scheduling platform that enables users to mark calendar slots as swappable and exchange them with others.
It simplifies schedule coordination between colleagues, teams, or students by allowing mutually beneficial slot swaps.

<img width="1550" height="1031" alt="Screenshot 2025-11-05 155007" src="https://github.com/user-attachments/assets/7ba163ff-9cf5-464a-9c0e-461330db065c" />

Features:
User Authentication: User Sign-up and Login using Email and Password, Passwords hashed using bcrypt.js, Session management via JWT (JSON Web Tokens), Protected API routes requiring authorization headers
Calendar Management: Create, view, edit, and delete your events, Event fields include title, startTime, endTime, status — (BUSY, SWAPPABLE, or SWAP_PENDING), Mark an event as Swappable to make it visible to others
Slot Swapping (Core Logic): Browse other users’ Swappable slots, Send a swap request by offering one of your own Swappable slots, Request recipient can Accept or Reject the swap If accepted: Owners of the two slots are exchanged, Both slots revert to BUSY If rejected: Slots revert to SWAPPABLE, Request marked as REJECTED
Notifications and Requests: Incoming Requests: View and accept/reject swap offers, Outgoing Requests: Track your pending swap offers, Dynamic updates — dashboard refreshes automatically after actions
Secure API Design: Backend validations ensure only swappable slots can be swapped, Uses MongoDB transactions to maintain data consistency, Prevents multiple requests on the same slot while SWAP_PENDING

How to Run:
1) Start MongoDB
   Run mongod locally, or use MongoDB Atlas connection URI.
2) Start Backend
   npm run dev (starts server on port 4000)
3) Start Frontend
   npm start (starts React app on port 3000)
4) Login / Signup
   Create an account and log in
5) Create Events
   Add a few BUSY events
6) Make Swappable
   Toggle event to “SWAPPABLE”
7) Open Marketplace
   View other users’ swappable slots and send a swap request
8) Handle Requests
   Accept or reject incoming requests

Run locally(quick steps):
1) MongoDB: ensure a MongoDB instance is running. For local dev, mongod on default port is fine. Or use Atlas and set MONGO_URI accordingly.
2) backend
cd backend
# copy package.json and files above
npm install
# create .env with MONGO_URI, JWT_SECRET etc
npm run dev
# server runs on http://localhost:4000
3) frontend
cd frontend
# use the provided files
npm install
# ensure REACT_APP_API_URL is set if backend not at default
# e.g., export REACT_APP_API_URL=http://localhost:4000/api
npm start
# app runs at http://localhost:3000

Tech stack:
| Layer                | Technology Used                        |
| -------------------- | -------------------------------------- |
| **Frontend**         | React (Hooks, React Router DOM, Axios) |
| **Backend**          | Node.js, Express.js                    |
| **Database**         | MongoDB (Mongoose ORM)                 |
| **Authentication**   | JWT (JSON Web Token)                   |
| **Styling**          | Basic CSS / Tailwind (optional)        |
| **Package Managers** | npm or yarn                            |

