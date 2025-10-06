// ============================================================================
// == FEATURE COMPONENT: AI Sous-Chef (Chat-GPT)
// ============================================================================

import { useState, useMemo, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import RecommendationBox from "./RecommendationBox";
import Notification from "./Notification";

const AIChef = () => {
  const [inputText, setInputText] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // IMPORTANT: Replace with your key
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const recognition = useMemo(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.lang = "en-IN";
    recognitionInstance.interimResults = false;
    return recognitionInstance;
  }, []);

  useEffect(() => {
    if (!recognition) return;
    recognition.onresult = (event) => {
      setInputText(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      setNotification(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
  }, [recognition]);

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDateTime(
      `${now.toLocaleDateString("en-US", options)} | Hyderabad, Telangana`
    );
  }, []);

  const getAIResponseFromGemini = async (text: string) => {
    if (!API_KEY) {
      setNotification(
        "Please add your Gemini API Key to the AIChef component."
      );
      return null;
    }
    const prompt = `You are Chaat-GPT, an expert AI sous-chef for Indian street food vendors. Your tone is helpful, concise, and you understand Hinglish. A vendor has described their ingredients. Provide an actionable cooking adjustment. Do not start with "Okay, here's...". Get straight to the point. Vendor's input: "${text}"`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`API Error: ${errorBody.error.message}`);
      }
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("No recommendation received from the AI.");
      }
    } catch (error) {
      setNotification((error as Error).message);
      return null;
    }
  };

  const handleGetAdvice = async () => {
    if (!inputText) {
      setNotification("Please describe your ingredients first!");
      return;
    }
    setIsLoading(true);
    setRecommendation("");
    setNotification(null);
    const advice = await getAIResponseFromGemini(inputText);
    if (advice) setRecommendation(advice);
    setIsLoading(false);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      setNotification("Sorry, your browser doesn't support voice recognition.");
      return;
    }
    if (isListening) recognition.stop();
    else {
      setIsListening(true);
      recognition.start();
    }
  };

  return (
    <div className="h-full w-full flex items-start justify-center pt-8">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-5xl font-bold text-orange-500">AI Sous-Chef</h1>
          <p className="text-lg text-gray-700 mt-1">
            Real-time Recipe Intelligence
          </p>
          <p className="text-sm text-gray-500 mt-2">{currentDateTime}</p>
        </header>
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Aaj ke ingredients kaise hain?
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Describe your ingredients or use the voice button.
          </p>
          <textarea
            id="ingredient-input"
            className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition"
            placeholder="e.g., 'Aaj ke tamatar thode khatte hain' or 'Chilies are not very spicy'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleGetAdvice}
              className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition disabled:bg-orange-300"
              disabled={isLoading}
            >
              Get AI Advice
            </button>
            <button
              onClick={handleVoiceInput}
              className={`w-full font-bold py-3 px-4 rounded-lg transition ${
                isListening
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isListening ? "Listening..." : "Record Voice 🎙️"}
            </button>
          </div>
        </div>
        {isLoading && <LoadingSpinner />}
        {recommendation && !isLoading && (
          <RecommendationBox text={recommendation} />
        )}
      </div>
      <style>{`@keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>
    </div>
  );
};

export default AIChef;
