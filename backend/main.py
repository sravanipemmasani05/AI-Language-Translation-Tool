
import os
import time
import requests

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is missing from the .env file."
    )


# =========================================================
# GEMINI CLIENT
# =========================================================

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-3.8-flash"


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Language Translation Tool API",
    version="1.0.0",
    description="AI-powered language translation using Gemini"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str


# =========================================================
# LANGUAGE CODE MAPPING
# =========================================================

LANGUAGE_CODES = {
    "English": "en",
    "Telugu": "te",
    "Hindi": "hi",
    "Tamil": "ta",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Bengali": "bn",
    "Marathi": "mr",
    "Gujarati": "gu",
    "Punjabi": "pa",
    "French": "fr",
    "German": "de",
    "Spanish": "es",
    "Italian": "it",
    "Portuguese": "pt",
    "Russian": "ru",
    "Arabic": "ar",
    "Chinese": "zh",
    "Japanese": "ja",
    "Korean": "ko",
}


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Language Translation Tool API is running!"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Language Translation Tool"
    }


# =========================================================
# GEMINI TRANSLATION
# =========================================================

def translate_with_gemini(
    text: str,
    source_language: str,
    target_language: str
):
    prompt = f"""
Translate the following text from {source_language}
to {target_language}.

Important instructions:
- Return ONLY the translated text.
- Do not explain the translation.
- Do not add quotation marks.
- Preserve the original meaning.
- Preserve names, numbers and formatting where appropriate.

Text:
{text}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    translated_text = response.text

    if not translated_text:
        raise Exception("Gemini returned an empty translation.")

    return translated_text.strip()


# =========================================================
# FREE FALLBACK TRANSLATION
# =========================================================

def translate_with_fallback(
    text: str,
    source_language: str,
    target_language: str
):
    source_code = LANGUAGE_CODES.get(source_language)
    target_code = LANGUAGE_CODES.get(target_language)

    if not source_code or not target_code:
        raise Exception(
            f"Unsupported language pair: "
            f"{source_language} -> {target_language}"
        )

    url = "https://api.mymemory.translated.net/get"

    params = {
        "q": text,
        "langpair": f"{source_code}|{target_code}",
    }

    response = requests.get(
        url,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    response_data = data.get("responseData", {})

    translated_text = response_data.get(
        "translatedText"
    )

    if not translated_text:
        raise Exception(
            "Fallback translation service returned no translation."
        )

    return translated_text.strip()


# =========================================================
# TRANSLATION ENDPOINT
# =========================================================

@app.post("/translate")
def translate_text(request: TranslationRequest):

    # -----------------------------------------------------
    # Validate text
    # -----------------------------------------------------

    text = request.text.strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Please enter some text to translate."
        )

    # -----------------------------------------------------
    # Validate length
    # -----------------------------------------------------

    if len(text) > 2000:
        raise HTTPException(
            status_code=400,
            detail="Text cannot exceed 2000 characters."
        )

    # -----------------------------------------------------
    # Same language
    # -----------------------------------------------------

    if (
        request.source_language.lower()
        == request.target_language.lower()
    ):
        return {
            "translation": text,
            "source_language": request.source_language,
            "target_language": request.target_language,
            "provider": "Direct",
            "message": (
                "Source and target languages are the same."
            ),
        }

    # =====================================================
    # STEP 1 — TRY GEMINI
    # =====================================================

    gemini_error = None

    for attempt in range(2):

        try:

            translated_text = translate_with_gemini(
                text=text,
                source_language=request.source_language,
                target_language=request.target_language,
            )

            return {
                "translation": translated_text,
                "source_language": request.source_language,
                "target_language": request.target_language,
                "provider": "Gemini AI",
                "message": (
                    "Translation completed successfully "
                    "using Gemini AI."
                ),
            }

        except Exception as e:

            gemini_error = str(e)

            error_upper = gemini_error.upper()

            is_temporary_error = (
                "429" in error_upper
                or "RESOURCE_EXHAUSTED" in error_upper
                or "503" in error_upper
                or "UNAVAILABLE" in error_upper
            )

            if is_temporary_error and attempt == 0:

                time.sleep(2)

                continue

            break

    # =====================================================
    # STEP 2 — FALLBACK TRANSLATION
    # =====================================================

    try:

        translated_text = translate_with_fallback(
            text=text,
            source_language=request.source_language,
            target_language=request.target_language,
        )

        return {
            "translation": translated_text,
            "source_language": request.source_language,
            "target_language": request.target_language,
            "provider": "Free Translation Fallback",
            "message": (
                "Gemini was temporarily unavailable. "
                "Translation completed using the fallback "
                "translation service."
            ),
        }

    except Exception as fallback_error:

        fallback_message = str(fallback_error)

        # =================================================
        # BOTH SERVICES FAILED
        # =================================================

        if gemini_error:

            gemini_upper = gemini_error.upper()

            if (
                "429" in gemini_upper
                or "RESOURCE_EXHAUSTED" in gemini_upper
            ):
                raise HTTPException(
                    status_code=503,
                    detail=(
                        "Gemini API quota is temporarily "
                        "unavailable and the fallback "
                        "translation service also failed. "
                        "Please try again later."
                    ),
                )

            if (
                "503" in gemini_upper
                or "UNAVAILABLE" in gemini_upper
            ):
                raise HTTPException(
                    status_code=503,
                    detail=(
                        "Gemini is temporarily unavailable "
                        "and the fallback translation service "
                        "also failed. Please try again later."
                    ),
                )

            if (
                "404" in gemini_upper
                or "NOT_FOUND" in gemini_upper
            ):
                raise HTTPException(
                    status_code=404,
                    detail=(
                        f"The Gemini model '{MODEL_NAME}' "
                        "is not available, and the fallback "
                        "translation service also failed."
                    ),
                )

            if (
                "401" in gemini_upper
                or "403" in gemini_upper
                or "API KEY" in gemini_upper
                or "AUTHENTICATION" in gemini_upper
            ):
                raise HTTPException(
                    status_code=401,
                    detail=(
                        "Gemini API authentication failed. "
                        "Please check GEMINI_API_KEY in "
                        "your .env file."
                    ),
                )

        raise HTTPException(
            status_code=500,
            detail=(
                "Translation failed. "
                f"Fallback error: {fallback_message}"
            ),
        )