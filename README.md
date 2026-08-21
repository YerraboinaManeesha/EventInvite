# EventInvite 🎉

A full-stack invitation platform where users can sign up, choose an event type, create a personalized digital invitation, and share it with guests through a unique live link.

Guests can open the invitation without an account and submit an RSVP. Invitation owners can manage their invitations and view RSVP responses from their dashboard.

This is a fully coded application built with **React, Node.js, Express.js, and MongoDB**.

## 🌐 Live Demo

https://eventinvite.onrender.com

## 📂 GitHub Repository

https://github.com/YerraboinaManeesha/EventInvite

---

## How It Works

### 👤 Creators

People creating an invitation can:

1. Sign up for an account
2. Log in securely
3. Choose an event type
4. Enter event details
5. Add the date, venue, and address
6. Add an event schedule or timeline
7. Add photos
8. Create the invitation
9. Edit the invitation anytime
10. Get a unique public invitation link
11. Copy or share the invitation link
12. View RSVP responses
13. Download RSVP responses as CSV

Example invitation link:

```text
https://eventinvite.onrender.com/i/your-invitation-slug
```

### 💌 Guests

Guests can:

1. Open the shared invitation link
2. View the invitation without creating an account
3. See the event details and schedule
4. Submit the RSVP form
5. Receive confirmation after submitting

---

## ✨ Features

* User registration and login
* Session-based authentication
* User-specific invitations
* Dashboard for invitation management
* Multiple event types
* Event-specific themes
* Invitation creation and editing
* Event date and details
* Venue name and address
* Event timeline/schedule
* Photo uploads
* Unique public invitation links
* Copy invitation link
* Browser/device sharing
* Live invitation preview
* Public RSVP form
* RSVP response management
* CSV export for RSVP responses
* Responsive design

---

## 🎉 Event Types

EventInvite supports six event categories:

* Wedding
* Birthday
* Engagement / Anniversary
* Baby Shower / Naming
* Corporate Event
* Reunion / Ceremony

Each event type has its own theme, colors, typography, and form configuration.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Express Session
* bcryptjs

### Deployment

* GitHub
* Render
* MongoDB Atlas

---

## 📂 Project Structure

```text
EventInvite/
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Invitation.js
│   │   └── Rsvp.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── invitations.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── eventTypes.js
│   ├── db.js
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api.js
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Running Locally

### Prerequisites

* Node.js 18 or higher
* MongoDB Atlas account or local MongoDB

### 1. Clone the repository

```bash
git clone https://github.com/YerraboinaManeesha/EventInvite.git
cd EventInvite
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CLIENT_ORIGIN=http://localhost:5173
```

Do not commit your `.env` file to GitHub.

### 4. Start the backend

From the `server` folder:

```bash
npm start
```

The backend runs on:

```text
http://localhost:4000
```

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Vite will provide the local frontend URL, usually:

```text
http://localhost:5173
```

---

## 🔐 Authentication

EventInvite uses session-based authentication.

Passwords are hashed using `bcryptjs`.

Authenticated users can manage their own invitations.

Each user's invitations are associated with their account, preventing users from managing invitations belonging to other accounts.

---

## 🔗 Invitation Sharing

After creating an invitation, the application generates a unique public URL.

Example:

```text
https://eventinvite.onrender.com/i/example-slug
```

The owner can:

* Copy Link
* Share
* View Live

The **Share** option uses the browser/device's native sharing functionality when supported.

Guests do not need an EventInvite account to open the public invitation.

---

## 💌 RSVP System

Each public invitation includes an RSVP form.

Guests can submit their responses without logging in.

The invitation owner can view responses from the dashboard and download them as a CSV file.

---

## 🎨 Design System

Each event type has its own visual theme.

| Event Type               | Theme                        |
| ------------------------ | ---------------------------- |
| Wedding                  | Ivory / Gold / Wine          |
| Birthday                 | Cream / Coral / Teal         |
| Engagement / Anniversary | Blush / Dusty Rose / Plum    |
| Baby Shower / Naming     | Mint / Soft Pink / Sage      |
| Corporate                | Steel Blue / Navy / White    |
| Reunion / Ceremony       | Amber / Forest Green / Cream |

The application reuses common components while changing the visual theme based on the selected event type.

Animations are intentionally simple and restrained, including:

* Hero fade-up animations
* Scroll-triggered section reveals
* RSVP submission loading states

---

## ☁️ Deployment

EventInvite is deployed as a full-stack application on Render.

### Production URL

```text
https://eventinvite.onrender.com
```

### Production Environment Variables

The server uses environment variables such as:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CLIENT_ORIGIN=https://eventinvite.onrender.com
```

Render automatically provides the `PORT` environment variable to the application.

The Express server serves the built React application in production.

---

## 🗄️ Database

MongoDB Atlas is used for persistent application data.

The database stores information such as:

* User accounts
* Invitations
* Event details
* Timelines
* Venues
* Photos
* RSVP responses

---

## 📌 Future Improvements

* Email invitations
* WhatsApp sharing
* More invitation templates
* Additional event types
* Custom invitation themes
* Guest list management
* RSVP notifications
* Invitation reminders
* Custom domains
* More personalization options

---

## 👩‍💻 Author

**Maneesha Yerraboina**

MSc Computer Science Graduate

GitHub:

https://github.com/YerraboinaManeesha

---
