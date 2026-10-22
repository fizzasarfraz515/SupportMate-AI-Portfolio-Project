# SupportMate AI

A portfolio demo for an AI-powered customer support chatbot. Built with React + TypeScript, FastAPI, and Google's official `google-genai` Python SDK.

## Features

- Responsive chat UI with starter questions, typing indicator, reset chat, and errors
- Gemini-powered answers grounded in a fictional sample business FAQ
- API key kept on the backend in an environment file
- Health endpoint for local testing
- Conversation context sent with each message (limited history)
- Clear fallback behavior for questions outside the demo knowledge base

## Requirements

- Node.js 20.19+ or 22.12+ recommended for current Vite
- Python 3.10+ recommended
- A Gemini API key from Google AI Studio

## 1. Configure the Groq API key

1. Open Groq API KEY Cloud
2. Create or select a project and create an API key.
3. Copy `backend/.env.example` to `backend/.env`.
4. Replace the placeholder with your key. Never put this key in the frontend or commit it to Git.

## 2. Run the backend (Windows PowerShell)

Open PowerShell in the project folder:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
uvicorn main:app --reload --port 8000
```

In Notepad, paste your API key, save, and close. If PowerShell blocks virtual-environment activation, use Command Prompt instead or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in the current PowerShell window, then activate again.

Check `http://127.0.0.1:8000/health`. It should return JSON with `"status": "ok"`.

## 3. Run the frontend

Open a **second** terminal at the project root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 4. Test the chatbot

Try:
- “How long does shipping take?”
- “What is your return policy?”
- “Which payment methods do you accept?”
- “Can you tell me my order status?”

The bot should answer the first three using the FAQ and explain that it cannot access live order information for the last one.

## Project structure

```text
SupportMate-AI/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   └── .env.example
└── README.md
```

## Before public deployment

- Set a real allowed frontend origin in backend CORS settings.
- Configure `GEMINI_API_KEY` and `GEMINI_MODEL` as backend environment variables on the host.
- Configure `VITE_API_BASE_URL` to the deployed backend URL before building the frontend.
- Add rate limiting, monitoring, privacy notice, and abuse protection.
- Do not promise order lookup or human handoff until those integrations are actually implemented.
- Review current Gemini API terms, model availability, quotas, and pricing before launch.

## Portfolio disclaimer

Northstar Store is fictional. This is a demonstration project, not a live customer-support service. Replace the sample FAQ and branding for a client only after confirming their policies and requirements.
