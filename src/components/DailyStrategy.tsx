import { useState, useCallback } from "react";
import LoadingSpinner from "./LoadingSpinner";

const generateUUID = () => crypto.randomUUID();

const DailyStrategy = () => {
  const [userId] = useState(generateUUID());
  const [dailyItemsData, setDailyItemsData] = useState([
    {
      id: generateUUID(),
      tiffinItem: "",
      ingredientPrice: "",
      dailySales: "",
      perPlateProfit: "",
    },
  ]);
  const [aiRecommendation, setAiRecommendation] = useState(
    'Enter data for your tiffin items and click "Get Strategy" to receive a daily sales strategy.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const tiffinItems = [
    "Idli",
    "Dosa",
    "Vada",
    "Upma",
    "Poori",
    "Pongal",
    "Uthappam",
    "Kesari",
  ];

  const addTiffinItem = () => {
    setDailyItemsData([
      ...dailyItemsData,
      {
        id: generateUUID(),
        tiffinItem: "",
        ingredientPrice: "",
        dailySales: "",
        perPlateProfit: "",
      },
    ]);
  };

  const removeTiffinItem = (id: string) => {
    setDailyItemsData(dailyItemsData.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: string) => {
    setDailyItemsData(
      dailyItemsData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const getAiSuggestion = useCallback(async () => {
    const isValid = dailyItemsData.every(
      (item) =>
        item.tiffinItem &&
        item.tiffinItem !== "Select an item" &&
        item.ingredientPrice !== "" &&
        item.dailySales !== "" &&
        item.perPlateProfit !== ""
    );

    if (dailyItemsData.length === 0) {
      setMessage("Please add at least one tiffin item to get a strategy.");
      return;
    }
    if (!isValid) {
      setMessage(
        "Please fill in all input fields and select a Tiffin Item for all added entries."
      );
      return;
    }

    setIsGenerating(true);
    setMessage("");
    setAiRecommendation("Generating strategy...");

    try {
      let itemDetails = dailyItemsData
        .map(
          (item) =>
            `- Tiffin Item: ${item.tiffinItem}\n  - Daily Ingredient Price: ${item.ingredientPrice} INR\n  - Daily Sales (Plates): ${item.dailySales}\n  - Per Plate Profit: ${item.perPlateProfit} INR\n`
        )
        .join("");
      const prompt = `As a sales strategist for a Tiffin Hotel, analyze the following daily data for various tiffin items:\n${itemDetails}\nBased on this information, provide a specific, actionable daily sales strategy. Consider pricing adjustments, marketing focus (e.g., promotions, highlighting specific items), menu recommendations, and operational efficiency improvements. Present the strategy in a clear, concise bullet-point format, with each point being a distinct actionable step. Ensure each point starts on a new line.`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };
      const apiKey = "AIzaSyASxHWMU-e4sweZohMia3iVN3vefSRh0l8"; // IMPORTANT: Replace with your key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
        setAiRecommendation(result.candidates[0].content.parts[0].text);
      } else {
        setAiRecommendation("Failed to get a strategy. Please try again.");
      }
    } catch (err: any) {
      setAiRecommendation(`An error occurred: ${err.message}`);
      setMessage(
        "An error occurred. Please check your network connection and API key."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [dailyItemsData]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6 font-sans">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">
          Daily Sales Strategy
        </h1>
        <div className="text-center text-sm text-gray-600 p-2 bg-indigo-50 rounded-lg">
          <p>
            Session ID:{" "}
            <span className="font-mono text-indigo-800 break-all">
              {userId}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Note: This is a temporary ID. Data is not saved after refresh.
          </p>
        </div>
        <div className="space-y-6">
          {dailyItemsData.map((item, index) => (
            <div
              key={item.id}
              className="border border-indigo-200 rounded-lg p-4 shadow-sm bg-indigo-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Tiffin Item #{index + 1}
                </h3>
                {dailyItemsData.length > 1 && (
                  <button
                    onClick={() => removeTiffinItem(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor={`tiffinItem-${item.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tiffin Item
                  </label>
                  <select
                    id={`tiffinItem-${item.id}`}
                    value={item.tiffinItem}
                    onChange={(e) =>
                      handleItemChange(item.id, "tiffinItem", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  >
                    <option value="">Select an item</option>
                    {tiffinItems.map((tiffin) => (
                      <option key={tiffin} value={tiffin}>
                        {tiffin}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`ingredientPrice-${item.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ingredient Price (INR)
                  </label>
                  <input
                    type="number"
                    id={`ingredientPrice-${item.id}`}
                    value={item.ingredientPrice}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "ingredientPrice",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`dailySales-${item.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Daily Sales (Plates)
                  </label>
                  <input
                    type="number"
                    id={`dailySales-${item.id}`}
                    value={item.dailySales}
                    onChange={(e) =>
                      handleItemChange(item.id, "dailySales", e.target.value)
                    }
                    placeholder="e.g., 150"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`perPlateProfit-${item.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Per Plate Profit (INR)
                  </label>
                  <input
                    type="number"
                    id={`perPlateProfit-${item.id}`}
                    value={item.perPlateProfit}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "perPlateProfit",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              onClick={addTiffinItem}
              className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
            >
              Add Another Tiffin Item
            </button>
          </div>
        </div>

        {message && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={getAiSuggestion}
            disabled={isGenerating || dailyItemsData.length === 0}
            className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition duration-300 ease-in-out ${
              isGenerating || dailyItemsData.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
            }`}
          >
            {isGenerating ? "Generating..." : "Get Daily Strategy"}
          </button>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl shadow-inner border border-indigo-200 min-h-[150px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            AI Sales Strategy
          </h2>
          {isGenerating ? (
            <LoadingSpinner />
          ) : (
            formatRecommendation(aiRecommendation)
          )}
        </div>
      </div>
    </div>
  );
};

const formatRecommendation = (text: string | null) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const finalElements = [];
    let currentListItems: string[] = [];
    let listKeyCounter = 0;

    lines.forEach((line) => {
        const trimmedLine = line.trim();
        const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ') || /^\d+\.\s/.test(trimmedLine);

        if (isListItem) {
            const content = trimmedLine.replace(/^(\* |\- |\d+\.\s)/, '').trim();
            currentListItems.push(content);
        } else {
            if (currentListItems.length > 0) {
                finalElements.push(
                    <ul key={`ul-${listKeyCounter++}`} className="list-disc list-inside space-y-2 text-gray-700">
                        {currentListItems.map((item, idx) => (
                            <li key={`li-${listKeyCounter}-${idx}`}>{item}</li>
                        ))}
                    </ul>
                );
                currentListItems = [];
            }
            finalElements.push(<p key={`p-${finalElements.length}`} className="mt-2 text-gray-700 leading-relaxed">{trimmedLine}</p>);
        }
    });

    if (currentListItems.length > 0) {
        finalElements.push(
            <ul key={`ul-${listKeyCounter++}`} className="list-disc list-inside space-y-2 text-gray-700">
                {currentListItems.map((item, idx) => (
                    <li key={`li-${listKeyCounter}-${idx}`}>{item}</li>
                ))}
            </ul>
        );
    }
    return <>{finalElements}</>;
};

export default DailyStrategy
