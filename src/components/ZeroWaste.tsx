// ============================================================================
// == NEW FEATURE COMPONENT: Zero-Waste Genius
// ============================================================================

import { useState, useEffect, useRef } from "react";
import { Recycle, Mic } from "lucide-react";
import ZeroWasteLoadingSpinner from "./ZeroWasteLoadingSpinner";

const ZeroWaste = () => {
  const [leftoverIngredients, setLeftoverIngredients] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<{
    recipeName: string;
    instructions: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        setError(`Audio error: ${event.error}. Please type ingredients.`);
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        setLeftoverIngredients(event.results[0][0].transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else {
      setLeftoverIngredients("");
      recognitionRef.current.start();
    }
  };

  const handleGenerateRecipe = async () => {
    if (!leftoverIngredients.trim()) {
      setError("Please enter your leftover ingredients.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedRecipe(null);

    const systemInstruction = `You are "Chaat-GPT", an expert culinary assistant for Indian street food vendors. You specialize in creating delicious, sellable items from leftovers to minimize waste and maximize profit. Your tone is creative and encouraging. Your task is to take a list of leftover ingredients and generate a simple, appealing recipe suitable for a street food stall. The output must be a valid JSON object with two keys: "recipeName" (a catchy, marketable name for the dish) and "instructions" (clear, step-by-step instructions for preparation, written in a simple, friendly tone, possibly using some Hinglish terms like 'tadka' or 'bhun-lo').`;
    const prompt = `Here are my leftovers: ${leftoverIngredients}`;

    const apiKey = "AIzaSyASxHWMU-e4sweZohMia3iVN3vefSRh0l8"; // IMPORTANT: Replace with your key
    if (apiKey === "YOUR_GEMINI_API_KEY") {
      setError("Please add your Gemini API Key in the ZeroWaste component.");
      setIsLoading(false);
      return;
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction }, { text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              recipeName: { type: "STRING" },
              instructions: { type: "STRING" },
            },
            required: ["recipeName", "instructions"],
          },
        },
      };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `API Error: ${errorBody.error?.message || "Something went wrong"}`
        );
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setGeneratedRecipe(
          JSON.parse(result.candidates[0].content.parts[0].text)
        );
      } else {
        throw new Error("Failed to generate a valid recipe.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-start justify-center pt-8">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
        <div className="text-center">
          <div className="inline-block bg-blue-100 p-3 rounded-full">
            <Recycle className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
            Zero-Waste Genius
          </h1>
          <p className="text-gray-500 mt-2">
            Turn today's leftovers into tomorrow's profits!
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label
              htmlFor="ingredients"
              className="block text-lg font-medium text-gray-700"
            >
              What's left over today?
            </label>
            <button
              onClick={handleListen}
              disabled={isLoading}
              className={`p-2 rounded-full transition-colors ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title={isListening ? "Stop listening" : "Use microphone"}
            >
              <Mic className="w-6 h-6" />
            </button>
          </div>
          <textarea
            id="ingredients"
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
            placeholder={
              isListening
                ? "Listening... speak your ingredients now."
                : "e.g., 2 boiled potatoes, half a cup of dosa batter, some mint chutney..."
            }
            value={leftoverIngredients}
            onChange={(e) => setLeftoverIngredients(e.target.value)}
            disabled={isLoading || isListening}
          />
        </div>
        <div>
          <button
            onClick={handleGenerateRecipe}
            disabled={isLoading || isListening}
            className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 disabled:bg-gray-400"
          >
            <Recycle className="w-6 h-6" />
            <span>
              {isLoading ? "Thinking..." : "Generate a Genius Recipe"}
            </span>
          </button>
        </div>
        <div className="min-h-[200px]">
          {isLoading && <ZeroWasteLoadingSpinner />}
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
              role="alert"
            >
              <p className="font-bold">Oops!</p>
              <p>{error}</p>
            </div>
          )}
          {generatedRecipe && (
            <div className="bg-green-50 border-2 border-dashed border-green-400 p-6 rounded-2xl animate-fade-in">
              <h2 className="text-2xl font-bold text-green-800">
                {generatedRecipe.recipeName}
              </h2>
              <p className="text-gray-600 mt-4 whitespace-pre-wrap font-serif">
                {generatedRecipe.instructions}
              </p>
              <p className="text-sm text-green-600 mt-6 font-semibold">
                Sell this as a limited-time special to use all your stock!
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`.animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default ZeroWaste