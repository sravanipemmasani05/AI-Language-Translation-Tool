# 🌐 AI Language Translation Tool

An AI-powered language translation web application built using **React, FastAPI, and Google Gemini AI**.

The application allows users to enter text, select source and target languages, and receive an AI-generated translation instantly.

---

## 🚀 Features

- 🌐 Translate text using Gemini AI
- 🗣️ Support for multiple languages
- 🔄 Swap source and target languages
- 📋 Copy translated text
- 🔊 Text-to-speech for translations
- 🗑️ Clear entered text
- 🕘 Translation history
- 💾 LocalStorage-based history
- ↩️ Use previous translations again
- ❌ Remove individual history items
- 🧹 Clear complete translation history
- 🔀 Sort history by newest or oldest
- 🌙 Dark mode
- ⌨️ `Ctrl + Enter` keyboard shortcut
- 🔢 Character counter with 2000-character limit
- ⚡ FastAPI backend
- 🤖 Google Gemini AI integration
- ❤️ Health-check API
- 📖 Interactive Swagger API documentation
- 📱 Responsive user interface

---

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- JavaScript
- CSS
- Browser LocalStorage API
- Web Speech API

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- python-dotenv
- Google GenAI SDK

### AI

- Google Gemini AI

---

## 📁 Project Structure

```text
Language Translation Tool_codealpha/
│
├── backend/
│   ├── venv/
│   ├── .env
│   ├── .gitignore
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Backend Setup

Open PowerShell in the backend directory:

```powershell
cd "C:\Users\Lenovo\OneDrive\documents\Language Translation Tool_codealpha\backend"
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never upload the real API key to GitHub.

---

## ▶️ Start the Backend

Run:

```powershell
python -m uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

## ❤️ Health Check

Open:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "Language Translation Tool"
}
```

---

## 📖 API Documentation

FastAPI automatically provides Swagger documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

The main translation endpoint is:

```text
POST /translate
```

Example request:

```json
{
  "text": "Hello, how are you?",
  "source_language": "English",
  "target_language": "Telugu"
}
```

Example response:

```json
{
  "translation": "నమస్కారం, మీరు ఎలా ఉన్నారు?",
  "source_language": "English",
  "target_language": "Telugu",
  "message": "Translation completed successfully."
}
```

---

## 💻 Frontend Setup

Open another PowerShell terminal.

Go to the frontend:

```powershell
cd "C:\Users\Lenovo\OneDrive\documents\Language Translation Tool_codealpha\frontend"
```

Install dependencies:

```powershell
npm install
```

---

## ▶️ Start the Frontend

Run:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in your browser.

---

## 🔄 Application Workflow

```text
User enters text
       ↓
Select source language
       ↓
Select target language
       ↓
Click Translate
       ↓
React frontend sends POST request
       ↓
FastAPI /translate endpoint
       ↓
Gemini AI processes translation
       ↓
Translated text returned
       ↓
React displays translation
       ↓
Translation saved to LocalStorage
       ↓
Translation appears in History
```

---

## 🌐 Supported Languages

The application currently provides language options including:

- English
- Telugu
- Hindi
- Tamil
- Kannada
- Malayalam
- Bengali
- Marathi
- Gujarati
- Punjabi
- French
- German
- Spanish
- Italian
- Portuguese
- Russian
- Arabic
- Chinese
- Japanese
- Korean

---

## 🤖 Gemini AI

The backend uses Google's Gemini AI through the Google GenAI Python SDK.

The API key is loaded from the `.env` file:

```python
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
```

The API key is never hardcoded into the frontend.

---

## 🕘 Translation History

Translation history is stored locally in the browser using:

```javascript
localStorage
```

Users can:

- View previous translations
- Sort translations
- Reuse a translation
- Copy a previous translation
- Remove individual translations
- Clear all history

No database is required for the current history implementation.

---

## 🔊 Text-to-Speech

The application can read the translated text aloud using the browser's built-in Web Speech API.

This allows users to listen to translations without requiring another external service.

---

## 🌙 Dark Mode

The application includes a dark-mode interface.

Users can switch between light and dark themes using the theme button.

---

## ⌨️ Keyboard Shortcut

Users can translate text quickly by pressing:

```text
Ctrl + Enter
```

---

## 🔐 Security

Important security practices used in this project:

- Gemini API key stored in `.env`
- `.env` excluded from Git
- API key is not exposed in React frontend
- Backend handles communication with Gemini
- CORS configured for the local frontend
- Input validation handled using Pydantic

---

## ⚠️ Gemini API Errors

The backend handles common Gemini API errors including:

### 429 — Quota Exceeded

The application displays a user-friendly message when the Gemini API quota is temporarily exceeded.

### 503 — Service Unavailable

The application informs the user when Gemini is temporarily experiencing high demand.

### 404 — Model Not Found

The backend reports when the configured Gemini model is unavailable.

### 401/403 — Authentication Error

The application asks the developer to verify the Gemini API key.

---

## 🧪 Testing

Test the backend using Swagger:

```text
http://127.0.0.1:8000/docs
```

Test:

```text
GET /
```

```text
GET /health
```

```text
POST /translate
```

Example:

```text
Hello, how are you?
```

Expected Telugu translation:

```text
నమస్కారం, మీరు ఎలా ఉన్నారు?
```

---

## 📸 Example

### Input

```text
I am learning artificial intelligence.
```

### Source

```text
English
```

### Target

```text
Telugu
```

### Output

```text
నేను కృత్రిమ మేధస్సును నేర్చుకుంటున్నాను.
```

---

## 🎯 Project Objective

The objective of this project is to develop an easy-to-use AI-powered language translation platform that can translate text between multiple languages using a modern web interface and Gemini AI.

The project demonstrates integration between:

```text
React
   +
FastAPI
   +
Gemini AI
```

---

## 👩‍💻 Project Type

**AI / Machine Learning Web Application**

### Main Technologies

```text
React
FastAPI
Python
Google Gemini AI
JavaScript
CSS
REST API
LocalStorage
```

---

## 📌 Future Enhancements

Possible future improvements include:

- Automatic language detection
- Voice input
- Document translation
- PDF translation
- Image/text extraction
- Translation download
- User authentication
- Cloud-based translation history
- PostgreSQL database
- Translation quality comparison
- Offline translation support
- More language support

---

## 📜 License

This project was developed for educational and project-development purposes.

---

## 🙏 Acknowledgements

- Google Gemini AI
- FastAPI
- React
- Vite
- Python
- Web Speech API

---

# 🌐 AI Language Translation Tool

**Built with React + FastAPI + Gemini AI**