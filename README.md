# AI Tutor

An AI-powered learning and skill profiling system with separate interfaces for students and companies.

## Features

- **Student Side**: Code practice with AI analysis, guided teaching, and dynamic skill profiling
- **Company Side**: Capability viewer with explainable scoring based on student performance data

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Configure Ollama (required for AI tutor responses):
   ```bash
   ollama serve
   ollama pull qwen3.5
   ```

   Add these variables in `.env.local`:
   ```env
   OLLAMA_BASE_URL=http://127.0.0.1:11434
   OLLAMA_MODEL=qwen3.5
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Every Time You Start Development

1. Start Ollama in one terminal:
   ```bash
   ollama serve
   ```
2. Start the app in a second terminal:
   ```bash
   npm run dev
   ```
3. If AI answers fail, verify Ollama is running on `http://127.0.0.1:11434` and the model exists:
   ```bash
   ollama list
   ollama pull qwen3.5
   ```

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and configurations

## Technologies

- Next.js 15
- TypeScript
- Tailwind CSS
- ESLint