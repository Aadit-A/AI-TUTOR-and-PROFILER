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

## 🌍 Deployment

### Frontend (Vercel)
The easiest way to deploy the Next.js frontend is using [Vercel](https://vercel.com):
1. Create a Vercel account and connect your GitHub repository.
2. Select the repository and set the Root Directory to the project root (leave empty if it's the root).
3. Ensure the Framework Preset is set to **Next.js**.
4. Add all the required **Environment Variables** (copy from your `.env.local`). Make sure to set `NEXTAUTH_URL` to your production domain (e.g., `https://your-app.vercel.app`).
5. Click **Deploy**. Vercel will install dependencies and host your application.

### Backend (Render)
The machine learning feature backend is powered by FastAPI and is pre-configured to deploy seamlessly on [Render](https://render.com):
1. Log into Render, click **New +** and select **Web Service**.
2. Connect the GitHub repository.
3. Apply the following settings:
   - **Root Directory**: `ml-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Render will automatically detect the Python version from `ml-backend/runtime.txt`.
5. Click **Create Web Service**.
6. **Important:** After deployment, grab your Render URL (e.g., `https://ai-tutor-backend.onrender.com`) and ensure your Next.js application (on Vercel) is communicating with it where the ML predictions are made.

## 📁 Project Structure

- `ml-backend/` - FastAPI Python backend (Contains ML models and FastAPI routing)
  - `ml/` - Saved ML models/vectorizers (joblib files)
  - `main.py` - FastAPI application entry point
- `src/app/` - Next.js App Router (Frontend pages & API routes)
  - `api/` - Next.js backend endpoints (NextAuth, Judge0, AI, ML integration)
- `src/components/` - Reusable React components (UI & Providers)
- `src/lib/` - Auth configurations, database connections, and helper functions
- `src/models/` - Mongoose database schemas (User, Problem, TestCase)
- `src/types/` - TypeScript interface definitions

---
Developed with ❤️ by the AI-TUTOR Team.
