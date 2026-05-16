# AI-TUTOR & PROFILER

A sophisticated AI-powered learning platform designed to help students master coding through personalized problem recommendations, real-time AI tutoring, and comprehensive skill profiling.

## 🚀 Key Features

### 👨‍🎓 Student Experience
- **Smart AI Tutor**: Real-time coding assistance powered by **Groq (Llama 3.3)**. Get hints, explanations, or code reviews instantly.
- **Natural Language Recommendations**: Search for problems using plain English (e.g., "recursive binary tree problems") powered by a custom **Machine Learning** tagging system.
- **Integrated Practice Lab**: A full-featured IDE with C++ support, automated execution via **Judge0**, and integrated AI chat.
- **LeetCode Integration**: Link your LeetCode account to sync statistics and track your progress across platforms.
- **Skill Profiling**: Dynamic dashboard visualization of your performance across different difficulties and topics.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14/15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB (via Mongoose)
- **AI/ML**: Groq API (LLM), Python (Scikit-learn/Joblib for Tag Suggestions)
- **Code Execution**: Judge0 API
- **Icons**: Lucide React

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.8+ (for ML features)
- MongoDB account (local or Atlas)

### 2. Configuration
Create a `.env.local` file in the root directory:
```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# AI / Groq
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# Optional: Code Execution
JUDGE0_BASE_URL=https://ce.judge0.com
```

### 3. Installation
```bash
# Install Node dependencies
npm install

# Install Python dependencies (for ML tagging system)
pip install joblib scikit-learn
```

### 4. Run Development
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

- `src/app/` - Next.js App Router (Pages & API Routes)
- `src/components/` - Reusable UI components & Sidebar
- `src/lib/` - Auth, DB configuration, and ML logic
- `src/models/` - Mongoose Schemas (User, Problem)
- `src/types/` - TypeScript definitions

---
Developed with ❤️ by the AI-TUTOR Team.
