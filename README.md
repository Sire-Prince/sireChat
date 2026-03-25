# 💬 sireChat

A modern, real-time chat application built with Next.js. This platform allows users to create accounts, engage in conversations, and enjoy seamless messaging with a clean, responsive interface.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-99.5%25-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

**Live Site:** [sirechat.vercel.app](https://sirechat.vercel.app)

---

## ✨ Features

- **User Authentication**: Sign up and login functionality
- **Real-time Messaging**: Instant message delivery and updates
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **User Profiles**: Personalized user accounts and settings
- **Privacy Policy**: Terms of use and privacy policy compliance
- **Modern UI**: Clean, intuitive interface for seamless communication

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js** | React framework (App Router) |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Vercel** | Hosting and deployment |
| *Firebase, cloudinary, | , 

---
Set up environment variables


# Authentication (if using NextAuth, Firebase, etc.)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_key"

# Database (if using MongoDB, PostgreSQL, etc.)
DATABASE_URL="your_database_connection_string"

# Real-time service (if using Socket.io, Pusher, etc.)
NEXT_PUBLIC_SOCKET_URL="your_socket_server_url"
## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sire-Prince/sireChat.git
   cd sireChat
   sireChat/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Landing/auth page
│   │   ├── chat/          # Chat interface
│   │   │   └── page.tsx   # Main chat room
│   │   ├── profile/       # User profile pages
│   │   └── api/           # API routes (backend)
│   ├── components/        # Reusable UI components
│   │   ├── Auth.tsx       # Sign up / Sign in forms
│   │   ├── ChatWindow.tsx # Main chat interface
│   │   ├── MessageList.tsx # Message display
│   │   ├── MessageInput.tsx # Message composer
│   │   └── UserList.tsx   # Online users
│   └── lib/               # Utilities, helpers, and configurations
│       ├── auth.ts        # Authentication logic
│       └── db.ts          # Database connection
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
