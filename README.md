# Paul Drive

Paul Drive is an intelligent, collaborative workspace for managing, organizing, and searching your documents with the power of AI. Built with Next.js, MongoDB, and Google Drive integration, it enables teams to create rooms, upload and classify documents, chat with AI about their content, and collaborate efficiently.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Data Models](#data-models)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Google Authentication**: Secure sign-in with Google OAuth.
- **Room-based Collaboration**: Organize documents and users into rooms.
- **Document Upload & AI Processing**:
  - Upload Google Docs, Sheets, and PDFs (converted to Google Docs).
  - Automatic text extraction, vectorization (embedding), duplicate detection, and AI-powered classification (folder, tags, teaser).
- **AI Chat**: Ask questions about your documents; the AI finds and extracts relevant answers from your files.
- **Folders & Tags**: Organize documents within rooms using folders and tags.
- **User Roles**: Room owners and viewers, with invitation and notification system.
- **Profile & Dashboard**: View your rooms, documents, collaborators, and activity stats.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion animations.

---

## Architecture
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes, MongoDB (Mongoose), NextAuth.js for authentication
- **AI Services**: Integrates with external FastAPI endpoints for embedding, classification, and answer extraction
- **Google APIs**: Uses Google Drive, Docs, and Sheets APIs for file access and processing

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm, yarn, pnpm, or bun
- MongoDB instance (local or cloud)
- Google Cloud project with OAuth credentials (for Drive/Docs/Sheets access)

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd matchita_drive
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in the required values (see below).
4. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev, pnpm dev, bun dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```
MONGO_URL=<your-mongodb-connection-string>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>
```

- `MONGO_URL`: MongoDB connection string
- `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `NEXTAUTH_URL`: Base URL for NextAuth (usually `http://localhost:3000` in dev)
- `NEXTAUTH_SECRET`: A random string for session encryption

---

## Usage
- **Sign in** with your Google account.
- **Create a Room**: Organize your documents and invite collaborators.
- **Upload Documents**: Add Google Docs, Sheets, or PDFs. The system will extract, vectorize, check for duplicates, and classify them using AI.
- **Chat with AI**: Use the chat tab in a room to ask questions about your documents. The AI will find and extract relevant answers.
- **Organize**: Use folders and tags to keep documents structured.
- **Manage Collaborators**: Invite users to rooms, manage permissions, and receive notifications.

---

## API Overview

### Authentication
- `/api/auth/[...nextauth]` — Google OAuth via NextAuth.js

### Users
- `GET /api/users` — Get current authenticated user
- `POST /api/users` — Get users by IDs
- `PUT /api/users` — Get user by email

### Rooms
- `GET /api/rooms` — List rooms for the user
- `POST /api/rooms` — Create a new room
- `GET /api/rooms/[id]` — Get room details
- `PUT /api/rooms/[id]` — Update room metadata
- `DELETE /api/rooms/[id]` — Delete a room

### Documents
- `GET /api/doch` — Get document count for user
- `POST /api/doch` — Create a new document in a room
- `GET /api/doch/[id]` — List documents in a room
- `POST /api/doch/[id]` — Get a document by ID
- `PUT /api/doch/[id]` — Update document metadata
- `DELETE /api/doch/[id]` — Delete a document from a room

### Chat
- `POST /api/chat` — Ask a question about documents in a room; returns AI-generated answer and source

### Notifications
- `POST /api/notif` — Add a notification
- `POST /api/notif/[id]` — Accept/handle a notification (e.g., room invitation)

---

## Data Models

### User
- `email`, `name`, `avatar`, `roomIds`, `lastLogin`, `notifications`

### Room
- `title`, `avatar`, `ownerId`, `viewerIds`, `documentIds`, `folders`, `tags`

### Document
- `title`, `googleDocsUrl`, `folder`, `tags`, `embedding`, `baseMimeType`, `googleId`, `teaser`, `addedBy`, `createdAt`, `updatedAt`

### Notification
- `type`, `message`, `metadata`, `read`, `createdAt`

---

## License
[MIT](LICENSE)
