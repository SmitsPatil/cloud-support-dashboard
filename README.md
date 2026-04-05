# Cloud Support Dashboard (CSD) 🤖☁️

> ⚠️ **This is a demo project** built for learning and demonstration purposes. Not intended for production use.

A **Hybrid AI-Powered Cloud Support Chatbot** built with AWS + Google Gemini AI.

## 🚀 Live Demo
Run locally with `npm run dev` → `http://localhost:5173`

## 🏗️ Architecture

```
User → CSD UI → Intent Check → AWS Lex → API Gateway → Lambda → DynamoDB
                                               ↓
                                         Gemini AI (Solution)
```

## ✨ Features

- 🎫 **Auto Ticket Creation** — Issues are detected, a Gemini-generated solution is created, and a TKT-XXXX ticket is stored in DynamoDB
- 🔍 **Ticket Lookup** — Type `TKT-XXXX` to retrieve any stored ticket
- 💬 **AI Chat** — Normal conversation handled by Google Gemini (as CSD identity)
- 🛡️ **4-Layer Fallback** — Always responsive even during API outages
- 🎨 **Premium SaaS UI** — Light theme, smooth animations, ticket ID pills

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + HTML/CSS/JS |
| NLU | AWS Lex |
| API | AWS API Gateway |
| Logic | AWS Lambda (Python) |
| Database | AWS DynamoDB |
| AI | Google Gemini Flash |
| Docs | Swagger / OpenAPI |

## 📦 Setup

```bash
npm install
npm run dev
```

## 🌐 AWS API Endpoint

```
POST https://9htr20gx65.execute-api.ap-southeast-1.amazonaws.com/chat

Body: { "message": "payment failed", "solution": "..." }
```

## 📁 Project Structure

```
ps3/
├── index.html          # Main chatbot UI (HTML + CSS + JS)
├── swagger.html        # API documentation
├── openapi.yaml        # OpenAPI spec
├── src/
│   ├── main.js
│   └── style.css
└── README.md
```

## 🧪 Test Cases

| Input | Result |
|---|---|
| `hello` | Gemini greeting as CSD |
| `payment failed` | TKT-XXXX created in DynamoDB |
| `app is crashing` | TKT-XXXX with crash solution |
| `TKT-2405` | Fetches ticket from DynamoDB |

---

Built with ❤️ using AWS + Google Gemini AI
