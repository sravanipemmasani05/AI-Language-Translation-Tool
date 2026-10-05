# 🌐 AI Language Translation Tool

An AI-powered multilingual language translation web application built with **React, FastAPI, and Gemini AI**.

The application allows users to enter text, select source and target languages, translate the text using Gemini AI, listen to translations, copy results, and maintain translation history locally.

---

## 🚀 Features

- 🌐 Multilingual text translation
- 🤖 Gemini AI-powered translation
- 🔄 Source and target language selection
- ↔️ Swap source and target languages
- 📝 Text input with 2000-character limit
- ⌨️ `Ctrl + Enter` keyboard shortcut for translation
- 📋 Copy translated text
- 🔊 Text-to-speech
- 🗑️ Clear input and translation
- 🕘 Translation history
- ↩️ Use previous translation
- 🗑️ Remove individual history entries
- 🧹 Clear complete translation history
- 🌙 Dark mode
- 📱 Responsive user interface
- ⚡ FastAPI backend
- 🔐 Gemini API key stored securely using environment variables
- 🛡️ API error handling for quota, availability, authentication, and model errors

---

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- Web Speech API

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- python-dotenv

### AI

- Google Gemini API

### Development Tools

- Visual Studio Code
- Git
- GitHub
- PowerShell

---

## 🏗️ Project Architecture

```text
AI-Language-Translation-Tool/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🌍 Supported Languages

The application supports:

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

## ⚙️ How the Application Works

```text
User enters text
       ↓
Select source language
       ↓
Select target language
       ↓
React frontend
       ↓
FastAPI /translate endpoint
       ↓
Gemini AI
       ↓
Translated response
       ↓
FastAPI
       ↓
React frontend
       ↓
Display translation
```

---

# 🔧 Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/sravanipemmasani05/AI-Language-Translation-Tool.git
```

Navigate into the project:

```bash
cd AI-Language-Translation-Tool
```

---

# 🐍 Backend Setup

Navigate to the backend:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

## 🔑 Gemini API Configuration

Create a `.env` file inside the `backend` folder:

```text
GEMINI_API_KEY=your_gemini_api_key_here
```

**Never upload your `.env` file or API key to GitHub.**

The project `.gitignore` is configured to ignore environment files.

---

## ▶️ Start the Backend

From the `backend` directory:

```powershell
uvicorn main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

Health check:

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

# ⚛️ Frontend Setup

Open another PowerShell terminal.

Navigate to the frontend:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Translation API

The frontend sends translation requests to:

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

# 🧪 Example

### Input

```text
I am learning artificial intelligence.
```

### Source Language

```text
English
```

### Target Language

```text
Telugu
```

### Output

```text
నేను కృత్రిమ మేధస్సును నేర్చుకుంటున్నాను.
```

---

# 📋 Additional Functions

### Copy

Copies the translated text to the clipboard.

### Listen

Uses the browser's speech synthesis functionality to read the translation aloud.

### Translation History

Previous translations are stored locally in the browser using `localStorage`.

### Use Translation

A previous translation can be selected and loaded back into the translator.

### Dark Mode

The interface supports light and dark themes.

### Swap Languages

The source and target languages can be exchanged using the swap button.

---

# 🛡️ Error Handling

The FastAPI backend handles common Gemini API errors including:

- Invalid API key
- Authentication errors
- API quota exceeded
- Temporary Gemini service unavailability
- Invalid or unavailable model
- Empty translation response
- Empty input

The frontend displays user-friendly messages instead of exposing internal server errors.

---

# 🔐 Security

The Gemini API key is loaded from an environment variable:

```text
GEMINI_API_KEY
```

It is **not hardcoded into the frontend**.

The `.env` file is excluded from Git using `.gitignore`.

---

# 📦 Production Build

To create a production build:

```powershell
cd frontend
npm run build
```

The optimized production files are generated inside:

```text
frontend/dist/
```

The `dist` directory is excluded from Git.

---

# 🎯 CodeAlpha Task 1

This project fulfills the requirements of the **Language Translation Tool** task:

- ✅ User interface for entering text
- ✅ Source language selection
- ✅ Target language selection
- ✅ Translation API integration
- ✅ Text sent to backend API
- ✅ Gemini AI processes the translation
- ✅ Translated text displayed clearly
- ✅ Copy functionality
- ✅ Text-to-speech functionality
- ✅ Additional translation history
- ✅ Responsive interface

---

# 👩‍💻 Developer

**Sravani Pemmasani**

B.Tech — Artificial Intelligence and Machine Learning

GitHub:

https://github.com/sravanipemmasani05

---

# 📄 License

This project is developed for educational and internship purposes.