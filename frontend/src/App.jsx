
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const MAX_LENGTH = 2000;

const LANGUAGES = [
  "English",
  "Telugu",
  "Hindi",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "French",
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Russian",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
];

const LANGUAGE_CODES = {
  English: "en-US",
  Telugu: "te-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Bengali: "bn-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Punjabi: "pa-IN",
  French: "fr-FR",
  German: "de-DE",
  Spanish: "es-ES",
  Italian: "it-IT",
  Portuguese: "pt-PT",
  Russian: "ru-RU",
  Arabic: "ar-SA",
  Chinese: "zh-CN",
  Japanese: "ja-JP",
  Korean: "ko-KR",
};

function getLanguageCode(language) {
  return LANGUAGE_CODES[language] || "en-US";
}

function App() {
  // ---------------------------------------------------------
  // Main state
  // ---------------------------------------------------------

  const [sourceLanguage, setSourceLanguage] =
    useState("English");

  const [targetLanguage, setTargetLanguage] =
    useState("Telugu");

  const [text, setText] = useState("");

  const [translation, setTranslation] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("success");

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");

    return saved === "true";
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "translationHistory"
      );

      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error(
        "Unable to load translation history:",
        error
      );

      return [];
    }
  });

  // ---------------------------------------------------------
  // History state
  // ---------------------------------------------------------

  const [historySearch, setHistorySearch] =
    useState("");

  const [historySort, setHistorySort] =
    useState("newest");

  // ---------------------------------------------------------
  // Save dark mode
  // ---------------------------------------------------------

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      String(darkMode)
    );
  }, [darkMode]);

  // ---------------------------------------------------------
  // Save history
  // ---------------------------------------------------------

  useEffect(() => {
    localStorage.setItem(
      "translationHistory",
      JSON.stringify(history)
    );
  }, [history]);

  // ---------------------------------------------------------
  // Message helper
  // ---------------------------------------------------------

  const showMessage = (
    textMessage,
    type = "success"
  ) => {
    setMessage(textMessage);
    setMessageType(type);
  };

  // ---------------------------------------------------------
  // Clear message
  // ---------------------------------------------------------

  const clearMessage = () => {
    setMessage("");
  };

  // ---------------------------------------------------------
  // Swap languages
  // ---------------------------------------------------------

  const handleSwapLanguages = () => {
    const oldSource = sourceLanguage;

    setSourceLanguage(targetLanguage);
    setTargetLanguage(oldSource);

    if (translation) {
      setText(translation);
      setTranslation(text);
    }
  };

  // ---------------------------------------------------------
  // Text change
  // ---------------------------------------------------------

  const handleTextChange = (event) => {
    const value = event.target.value;

    if (value.length <= MAX_LENGTH) {
      setText(value);
      clearMessage();
    }
  };

  // ---------------------------------------------------------
  // Translation
  // ---------------------------------------------------------

  const handleTranslate = async () => {
    if (!text.trim()) {
      showMessage(
        "Please enter some text to translate.",
        "error"
      );

      return;
    }

    if (sourceLanguage === targetLanguage) {
      setTranslation(text);

      showMessage(
        "Source and target languages are the same.",
        "success"
      );

      return;
    }

    setLoading(true);
    clearMessage();

    try {
      const response = await fetch(
        `${API_URL}/translate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text: text.trim(),
            source_language: sourceLanguage,
            target_language: targetLanguage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Translation failed. Please try again."
        );
      }

      const translatedText =
        data.translation || "";

      setTranslation(translatedText);

      const newHistoryItem = {
        id: Date.now(),

        original: text.trim(),

        translation: translatedText,

        sourceLanguage,

        targetLanguage,

        date: new Date().toLocaleString(),
      };

      setHistory((previousHistory) => [
        newHistoryItem,
        ...previousHistory.filter(
          (item) =>
            !(
              item.original === text.trim() &&
              item.translation === translatedText &&
              item.sourceLanguage ===
                sourceLanguage &&
              item.targetLanguage ===
                targetLanguage
            )
        ),
      ]);

      showMessage(
        data.message ||
          "Translation completed successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Translation error:",
        error
      );

      let errorMessage =
        error.message ||
        "Unable to translate the text.";

      if (
        errorMessage.includes("429") ||
        errorMessage.includes(
          "quota"
        ) ||
        errorMessage.includes(
          "RESOURCE_EXHAUSTED"
        )
      ) {
        errorMessage =
          "Gemini API quota has been reached. Please wait and try again.";
      }

      if (
        errorMessage.includes("503") ||
        errorMessage.includes(
          "UNAVAILABLE"
        )
      ) {
        errorMessage =
          "Gemini is temporarily unavailable because of high demand. Please try again shortly.";
      }

      showMessage(
        errorMessage,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Keyboard shortcut
  // ---------------------------------------------------------

  const handleKeyDown = (event) => {
    if (
      event.ctrlKey &&
      event.key === "Enter"
    ) {
      event.preventDefault();

      if (!loading) {
        handleTranslate();
      }
    }
  };

  // ---------------------------------------------------------
  // Copy translation
  // ---------------------------------------------------------

  const handleCopy = async () => {
    if (!translation) {
      showMessage(
        "There is no translation to copy.",
        "error"
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        translation
      );

      showMessage(
        "Translation copied to clipboard.",
        "success"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        "Unable to copy the translation.",
        "error"
      );
    }
  };

  // ---------------------------------------------------------
  // Text to speech
  // ---------------------------------------------------------

  const handleSpeak = () => {
    if (!translation) {
      showMessage(
        "There is no translation to listen to.",
        "error"
      );

      return;
    }

    if (
      !("speechSynthesis" in window)
    ) {
      showMessage(
        "Text-to-speech is not supported by your browser.",
        "error"
      );

      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);

      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        translation
      );

    speech.lang =
      getLanguageCode(targetLanguage);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);

      showMessage(
        "Unable to play the translation.",
        "error"
      );
    };

    window.speechSynthesis.speak(
      speech
    );
  };

  // ---------------------------------------------------------
  // Clear translator
  // ---------------------------------------------------------

  const handleClear = () => {
    setText("");
    setTranslation("");
    clearMessage();

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // ---------------------------------------------------------
  // Clear history
  // ---------------------------------------------------------

  const handleClearHistory = () => {
    setHistory([]);

    localStorage.removeItem(
      "translationHistory"
    );

    showMessage(
      "Translation history cleared.",
      "success"
    );
  };

  // ---------------------------------------------------------
  // Remove individual history item
  // ---------------------------------------------------------

  const handleRemoveHistory = (id) => {
    setHistory((previousHistory) =>
      previousHistory.filter(
        (item) => item.id !== id
      )
    );
  };

  // ---------------------------------------------------------
  // Use history item
  // ---------------------------------------------------------

  const handleUseHistory = (item) => {
    setSourceLanguage(
      item.sourceLanguage
    );

    setTargetLanguage(
      item.targetLanguage
    );

    setText(item.original);

    setTranslation(
      item.translation
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    showMessage(
      "Previous translation loaded.",
      "success"
    );
  };

  // ---------------------------------------------------------
  // Copy history translation
  // ---------------------------------------------------------

  const handleCopyHistory = async (
    historyTranslation
  ) => {
    try {
      await navigator.clipboard.writeText(
        historyTranslation
      );

      showMessage(
        "Translation copied to clipboard.",
        "success"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        "Unable to copy the translation.",
        "error"
      );
    }
  };

  // ---------------------------------------------------------
  // Speak history translation
  // ---------------------------------------------------------

  const handleSpeakHistory = (
    historyTranslation,
    language
  ) => {
    if (
      !("speechSynthesis" in window)
    ) {
      showMessage(
        "Text-to-speech is not supported by your browser.",
        "error"
      );

      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        historyTranslation
      );

    speech.lang =
      getLanguageCode(language);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(
      speech
    );
  };

  // ---------------------------------------------------------
  // Search and sort history
  // ---------------------------------------------------------

  const filteredHistory = useMemo(() => {
    const search =
      historySearch
        .toLowerCase()
        .trim();

    const filtered = history.filter(
      (item) => {
        if (!search) {
          return true;
        }

        return (
          item.original
            .toLowerCase()
            .includes(search) ||
          item.translation
            .toLowerCase()
            .includes(search) ||
          item.sourceLanguage
            .toLowerCase()
            .includes(search) ||
          item.targetLanguage
            .toLowerCase()
            .includes(search)
        );
      }
    );

    return [...filtered].sort(
      (a, b) => {
        if (
          historySort === "oldest"
        ) {
          return a.id - b.id;
        }

        return b.id - a.id;
      }
    );
  }, [
    history,
    historySearch,
    historySort,
  ]);

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div
      className={`app ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="app-header">

        <div className="header-content">

          <div className="brand">

            <div className="brand-icon">
              🌐
            </div>

            <div>
              <h1>
                AI Language Translator
              </h1>

              <p>
                Translate text instantly
                using Gemini AI
              </p>
            </div>

          </div>

          <button
            type="button"
            className="theme-button"
            onClick={() =>
              setDarkMode(
                (previous) =>
                  !previous
              )
            }
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-container">

        {/* ===================================================
            LANGUAGE SELECTORS
        =================================================== */}

        <section className="language-section">

          <div className="language-selector">

            <label htmlFor="source-language">
              Source Language
            </label>

            <select
              id="source-language"
              value={sourceLanguage}
              onChange={(event) =>
                setSourceLanguage(
                  event.target.value
                )
              }
            >
              {LANGUAGES.map(
                (language) => (
                  <option
                    key={language}
                    value={language}
                  >
                    {language}
                  </option>
                )
              )}
            </select>

          </div>

          <button
            type="button"
            className="swap-button"
            onClick={
              handleSwapLanguages
            }
            title="Swap languages"
            aria-label="Swap languages"
          >
            ⇄
          </button>

          <div className="language-selector">

            <label htmlFor="target-language">
              Target Language
            </label>

            <select
              id="target-language"
              value={targetLanguage}
              onChange={(event) =>
                setTargetLanguage(
                  event.target.value
                )
              }
            >
              {LANGUAGES.map(
                (language) => (
                  <option
                    key={language}
                    value={language}
                  >
                    {language}
                  </option>
                )
              )}
            </select>

          </div>

        </section>

        {/* ===================================================
            TRANSLATION WORKSPACE
        =================================================== */}

        <section className="translator-section">

          {/* INPUT */}

          <div className="translation-card">

            <div className="card-header">

              <h2>
                Enter Text
              </h2>

              <span>
                {text.length} /{" "}
                {MAX_LENGTH}
              </span>

            </div>

            <textarea
              value={text}
              onChange={
                handleTextChange
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Type or paste text here..."
              maxLength={MAX_LENGTH}
              aria-label="Text to translate"
            />

            <div className="input-footer">

              <span>
                Tip: Press{" "}
                <strong>
                  Ctrl + Enter
                </strong>{" "}
                to translate.
              </span>

            </div>

          </div>

          {/* OUTPUT */}

          <div className="translation-card output-card">

            <div className="card-header">

              <h2>
                Translation
              </h2>

              <span>
                {targetLanguage}
              </span>

            </div>

            <div className="translation-output">

              {loading ? (

                <div className="loading-state">

                  <div className="loading-spinner"></div>

                  <p>
                    Translating...
                  </p>

                </div>

              ) : translation ? (

                <p>
                  {translation}
                </p>

              ) : (

                <p className="placeholder-text">
                  Your translation
                  will appear here...
                </p>

              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            MESSAGE
        =================================================== */}

        {message && (
          <div
            className={`status-message ${
              messageType ===
              "error"
                ? "error"
                : "success"
            }`}
          >
            {messageType ===
            "error"
              ? "❌"
              : "✅"}{" "}
            {message}
          </div>
        )}

        {/* ===================================================
            ACTION BUTTONS
        =================================================== */}

        <section className="action-section">

          <button
            type="button"
            className="primary-button"
            onClick={
              handleTranslate
            }
            disabled={loading}
          >
            {loading
              ? "⏳ Translating..."
              : "🌐 Translate"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handleCopy}
            disabled={!translation}
          >
            📋 Copy
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handleSpeak}
            disabled={!translation}
          >
            {isSpeaking
              ? "⏹️ Stop"
              : "🔊 Listen"}
          </button>

          <button
            type="button"
            className="secondary-button danger-button"
            onClick={handleClear}
          >
            🗑️ Clear
          </button>

        </section>

        {/* ===================================================
            HISTORY
        =================================================== */}

        <section className="history-section">

          <div className="history-header">

            <div>
              <h2>
                🕘 Translation History
              </h2>

              <p>
                Your recent translations
                are stored locally.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                className="clear-history-button"
                onClick={
                  handleClearHistory
                }
              >
                Clear History
              </button>
            )}

          </div>

          {/* SEARCH + SORT */}

          {history.length > 0 && (
            <div className="history-controls">

              <input
                type="text"
                placeholder="🔍 Search history..."
                value={
                  historySearch
                }
                onChange={(event) =>
                  setHistorySearch(
                    event.target.value
                  )
                }
              />

              <select
                value={historySort}
                onChange={(event) =>
                  setHistorySort(
                    event.target.value
                  )
                }
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="oldest">
                  Oldest first
                </option>
              </select>

            </div>
          )}

          {/* EMPTY */}

          {history.length === 0 ? (

            <div className="empty-history">

              <div className="empty-history-icon">
                📝
              </div>

              <p>
                No translation history
                yet.
              </p>

              <span>
                Your completed
                translations will
                appear here.
              </span>

            </div>

          ) : filteredHistory.length ===
            0 ? (

            <div className="empty-history">

              <div className="empty-history-icon">
                🔍
              </div>

              <p>
                No matching
                translations.
              </p>

              <span>
                Try a different
                search term.
              </span>

            </div>

          ) : (

            <div className="history-list">

              {filteredHistory.map(
                (item) => (

                  <article
                    className="history-card"
                    key={item.id}
                  >

                    <div className="history-card-header">

                      <span className="language-pair">
                        {item.sourceLanguage}
                        {" → "}
                        {item.targetLanguage}
                      </span>

                      <span className="history-date">
                        {item.date}
                      </span>

                    </div>

                    <div className="history-content">

                      <div className="history-column">

                        <h3>
                          Original
                        </h3>

                        <p>
                          {item.original}
                        </p>

                      </div>

                      <div className="history-column">

                        <h3>
                          Translation
                        </h3>

                        <p className="history-translation">
                          {item.translation}
                        </p>

                      </div>

                    </div>

                    <div className="history-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleUseHistory(
                            item
                          )
                        }
                      >
                        ↩️ Use Translation
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopyHistory(
                            item.translation
                          )
                        }
                      >
                        📋 Copy
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSpeakHistory(
                            item.translation,
                            item.targetLanguage
                          )
                        }
                      >
                        🔊 Listen
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveHistory(
                            item.id
                          )
                        }
                      >
                        🗑️ Remove
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="app-footer">

        <p>
          Powered by{" "}
          <strong>
            Gemini AI + FastAPI
          </strong>
        </p>

        <span>
          AI Language Translation Tool
        </span>

      </footer>

    </div>
  );
}

export default App;
