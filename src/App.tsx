import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ChefHat as Chef, TrendingUp, Recycle, Brain, BarChart3, Calendar, Settings, User, Mic, IndianRupee, Lightbulb, Target, Clock, Star } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

// ============================================================================
// == FEATURE COMPONENT: AI Sous-Chef (Chaat-GPT)
// ============================================================================

const Notification = ({ message, onClose }: { message: string | null, onClose: () => void }) => {
    if (!message) return null;
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex justify-between items-center animate-fade-in">
            <span>{message}</span>
            <button onClick={onClose} className="font-bold text-xl">&times;</button>
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="text-center p-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Chaat-GPT is thinking...</p>
    </div>
);

const RecommendationBox = ({ text }: { text: string }) => (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-5 rounded-lg shadow-md animate-fade-in">
        <h2 className="font-bold text-lg mb-2">🧠 Chaat-GPT Suggestion:</h2>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
);

const AIChef = () => {
    const [inputText, setInputText] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [notification, setNotification] = useState<string | null>(null);

    const API_KEY = "AIzaSyC9ww598PYK9YbhQxaUdlwy7ps5aQaNcdM";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const recognition = useMemo(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return null;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.lang = 'en-IN';
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
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDateTime(`${now.toLocaleDateString('en-US', options)} | Hyderabad, Telangana`);
    }, []);

    const getAIResponseFromGemini = async (text: string) => {
        if (API_KEY === "YOUR_GEMINI_API_KEY") {
            setNotification("Please add your Gemini API Key to the AIChef component.");
            return null;
        }
        const prompt = `You are Chaat-GPT, an expert AI sous-chef for Indian street food vendors. Your tone is helpful, concise, and you understand Hinglish. A vendor has described their ingredients. Provide an actionable cooking adjustment. Do not start with "Okay, here's...". Get straight to the point. Vendor's input: "${text}"`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const response = await fetch(API_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
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
            setNotification('Please describe your ingredients first!');
            return;
        }
        setIsLoading(true);
        setRecommendation('');
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
        <div className="h-full w-full flex items-start justify-center">
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <header className="text-center">
                    <h1 className="text-5xl font-bold text-orange-500">AI Sous-Chef</h1>
                    <p className="text-lg text-gray-700 mt-1">Real-time Recipe Intelligence</p>
                    <p className="text-sm text-gray-500 mt-2">{currentDateTime}</p>
                </header>
                <Notification message={notification} onClose={() => setNotification(null)} />
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Aaj ke ingredients kaise hain?</h2>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Describe your ingredients or use the voice button.</p>
                    <textarea id="ingredient-input" className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="e.g., 'Aaj ke tamatar thode khatte hain' or 'Chilies are not very spicy'"
                        value={inputText} onChange={(e) => setInputText(e.target.value)} />
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button onClick={handleGetAdvice} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition disabled:bg-orange-300" disabled={isLoading}>
                            Get AI Advice
                        </button>
                        <button onClick={handleVoiceInput} className={`w-full font-bold py-3 px-4 rounded-lg transition ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            {isListening ? 'Listening...' : 'Record Voice 🎙️'}
                        </button>
                    </div>
                </div>
                {isLoading && <LoadingSpinner />}
                {recommendation && !isLoading && <RecommendationBox text={recommendation} />}
            </div>
            <style>{`@keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>
        </div>
    );
};


// ============================================================================
// == FEATURE COMPONENT: Profit Optimizer
// ============================================================================
const ProfitOptimizer = ({
    ingredientPrices, platesSold, menuItems,
    handlePriceChange, handlePlatesSoldChange,
    dailyPerformance, aiRecommendation
}: any) => (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Profit Optimizer</h1>
        <div className="bg-green-50 p-6 rounded-lg shadow-inner mb-6">
            <h2 className="text-xl font-bold text-green-600 mb-4">Daily Ingredient Prices (₹ per kg/L)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.keys(ingredientPrices).map(ing => (
                    <div key={ing} className="flex flex-col">
                        <label htmlFor={ing} className="capitalize text-sm font-medium text-gray-700 mb-1">{ing}:</label>
                        <input type="number" id={ing} name={ing} value={ingredientPrices[ing]} onChange={handlePriceChange}
                            className="p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500" min="0" step="0.01" />
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow-inner mb-6">
            <h2 className="text-xl font-bold text-yellow-700 mb-4">Daily Sales Input (Plates Sold)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {menuItems.map((item: any) => (
                    <div key={item.id} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">{item.name}:</label>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handlePlatesSoldChange(item.id, -1)} className="p-1.5 bg-red-400 text-white rounded-full shadow-md hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            </button>
                            <span className="flex-grow text-center text-lg font-semibold">{platesSold[item.id]}</span>
                            <button onClick={() => handlePlatesSoldChange(item.id, 1)} className="p-1.5 bg-green-400 text-white rounded-full shadow-md hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-inner border-l-4 border-purple-400 mb-6">
            <h2 className="text-xl font-bold text-purple-700 mb-2">StallOS AI Recommendation</h2>
            <p className="text-md text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: aiRecommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Today's Performance Summary</h2>
            <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xl font-extrabold text-gray-800">
                <span className="bg-gray-200 p-2 px-4 rounded-lg shadow-sm">Total Revenue: ₹{dailyPerformance.totalRevenue.toFixed(2)}</span>
                <span className="bg-green-200 p-2 px-4 rounded-lg shadow-sm text-green-900">Total Profit: ₹{dailyPerformance.totalOverallProfit.toFixed(2)}</span>
            </div>
        </div>
    </div>
);


// ============================================================================
// == DYNAMIC FEATURE COMPONENT: Performance Analytics
// ============================================================================
const PerformanceAnalytics = ({ menuData, dailyPerformance }: { menuData: any[], dailyPerformance: { totalRevenue: number, totalOverallProfit: number } }) => {
    
    const profitDistributionData = useMemo(() => {
        const positiveProfitItems = menuData.filter(item => item.itemProfit > 0);
        return {
            labels: positiveProfitItems.map(item => item.name),
            datasets: [{
                data: positiveProfitItems.map(item => item.itemProfit),
                backgroundColor: positiveProfitItems.map(() => `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`),
                borderColor: '#ffffff',
                borderWidth: 2,
            }],
        };
    }, [menuData]);

    const profitDistributionOptions: any = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Profit Contribution by Item (Today)', font: { size: 18, weight: 'bold' } },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                        const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ₹${Number(context.raw).toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        },
    };

    const salesVsMarginData = useMemo(() => {
        const sortedData = [...menuData].sort((a, b) => b.platesSold - a.platesSold);
        return {
            labels: sortedData.map(item => item.name),
            datasets: [
                { label: 'Plates Sold', data: sortedData.map(item => item.platesSold), backgroundColor: 'rgba(255, 159, 64, 0.7)', yAxisID: 'y-sales' },
                { label: 'Profit Margin (%)', data: sortedData.map(item => item.profitMargin), backgroundColor: 'rgba(75, 192, 192, 0.7)', yAxisID: 'y-margin' },
            ],
        };
    }, [menuData]);
    
    const salesVsMarginOptions: any = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales Volume vs. Profit Margin', font: { size: 18, weight: 'bold' } },
        },
        scales: {
            'y-sales': { type: 'linear', position: 'left', title: { display: true, text: 'Plates Sold' } },
            'y-margin': { type: 'linear', position: 'right', title: { display: true, text: 'Profit Margin (%)' }, grid: { drawOnChartArea: false } },
        },
    };

    return (
        <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 overflow-y-auto space-y-8">
            <h1 className="text-4xl font-extrabold text-center text-pink-700">Live Performance Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg shadow-lg text-center border border-blue-200">
                    <p className="text-lg font-semibold text-gray-700">Total Revenue (Today)</p>
                    <p className="text-4xl font-bold text-blue-700">₹{dailyPerformance.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-lg text-center border border-green-200">
                    <p className="text-lg font-semibold text-gray-700">Total Profit (Today)</p>
                    <p className="text-4xl font-bold text-green-700">₹{dailyPerformance.totalOverallProfit.toFixed(2)}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-[400px]">
                    <Pie data={profitDistributionData} options={profitDistributionOptions} />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-[400px]">
                    <Bar data={salesVsMarginData} options={salesVsMarginOptions} />
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// == NEW FEATURE COMPONENT: Zero-Waste Genius
// ============================================================================

const ZeroWasteLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="text-gray-600">Generating your genius recipe...</p>
    </div>
);
  
const ZeroWaste = () => {
    const [leftoverIngredients, setLeftoverIngredients] = useState('');
    const [generatedRecipe, setGeneratedRecipe] = useState<{ recipeName: string, instructions: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-IN';
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
            setLeftoverIngredients('');
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

        const systemInstruction = `You are "Chaat-GPT", an expert culinary assistant for Indian street food vendors... Your task is to... create a JSON object with two keys: "recipeName" and "instructions".`;
        const prompt = `Here are my leftovers: ${leftoverIngredients}`;
        
        // IMPORTANT: Add your API key here
        const apiKey = "AIzaSyC9ww598PYK9YbhQxaUdlwy7ps5aQaNcdM"; 
        if (apiKey === "YOUR_GEMINI_API_KEY") {
            setError("Please add your Gemini API Key in the ZeroWaste component.");
            setIsLoading(false);
            return;
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: systemInstruction }, {text: prompt}] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: { "recipeName": { "type": "STRING" }, "instructions": { "type": "STRING" } },
                        required: ["recipeName", "instructions"]
                    }
                }
            };
            const response = await fetch(apiUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`API Error: ${errorBody.error?.message || 'Something went wrong'}`);
            }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setGeneratedRecipe(JSON.parse(result.candidates[0].content.parts[0].text));
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
        <div className="h-full w-full flex items-start justify-center">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
                <div className="text-center">
                    <div className="inline-block bg-blue-100 p-3 rounded-full">
                        <Recycle className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">Zero-Waste Genius</h1>
                    <p className="text-gray-500 mt-2">Turn today's leftovers into tomorrow's profits!</p>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="ingredients" className="block text-lg font-medium text-gray-700">What's left over today?</label>
                        <button onClick={handleListen} disabled={isLoading}
                            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                            title={isListening ? "Stop listening" : "Use microphone"}>
                            <Mic className="w-6 h-6" />
                        </button>
                    </div>
                    <textarea id="ingredients" rows={4}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
                        placeholder={isListening ? "Listening... speak your ingredients now." : "e.g., 2 boiled potatoes, half a cup of dosa batter, some mint chutney..."}
                        value={leftoverIngredients} onChange={(e) => setLeftoverIngredients(e.target.value)} disabled={isLoading || isListening} />
                </div>
                <div>
                    <button onClick={handleGenerateRecipe} disabled={isLoading || isListening}
                        className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 disabled:bg-gray-400">
                        <Recycle className="w-6 h-6" />
                        <span>{isLoading ? 'Thinking...' : 'Generate a Genius Recipe'}</span>
                    </button>
                </div>
                <div className="min-h-[200px]">
                    {isLoading && <ZeroWasteLoadingSpinner />}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                            <p className="font-bold">Oops!</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {generatedRecipe && (
                        <div className="bg-green-50 border-2 border-dashed border-green-400 p-6 rounded-2xl animate-fade-in">
                            <h2 className="text-2xl font-bold text-green-800">{generatedRecipe.recipeName}</h2>
                            <p className="text-gray-600 mt-4 whitespace-pre-wrap font-serif">{generatedRecipe.instructions}</p>
                            <p className="text-sm text-green-600 mt-6 font-semibold">Sell this as a limited-time special to use all your stock!</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`.animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

// ============================================================================
// == PLACEHOLDER, LANDING & NEW FEATURE COMPONENTS
// ============================================================================
const PlaceholderComponent = ({ name, icon: Icon, color }: { name: string, icon: React.ElementType, color: string }) => (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
        <div className={`w-20 h-20 ${color.replace('text', 'bg').replace('-600','-100')} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
            <Icon className={`w-10 h-10 ${color}`} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{name}</h1>
        <p className="text-lg text-gray-500">This feature is under construction. 🚧</p>
    </div>
);

const LandingPage = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full flex flex-col justify-center items-center">
        <div className="text-center max-w-4xl">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                Welcome to StallOS
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The AI-powered operating system for street food vendors. Transform challenges into opportunities and leftovers into profit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                <div className="p-6 bg-orange-50 rounded-xl border border-orange-100">
                    <Chef className="w-8 h-8 text-orange-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                        AI Recipe Adjustments
                    </h3>
                    <p className="text-sm text-gray-600">
                        Maintain consistent taste despite ingredient variations.
                    </p>
                </div>

                <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                    <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Smart Profit Optimization
                    </h3>
                    <p className="text-sm text-gray-600">
                        Turn market volatility into daily opportunities.
                    </p>
                </div>

                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <Recycle className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Zero-Waste Intelligence
                    </h3>
                    <p className="text-sm text-gray-600">
                        Convert leftovers into profitable menu items.
                    </p>
                </div>
            </div>
            <p className="mt-12 text-gray-500">Select a feature from the sidebar to get started.</p>
        </div>
    </div>
);

const ChaatGPT = () => <PlaceholderComponent name="Chaat-GPT Voice" icon={Mic} color="text-purple-600" />;

// ============================================================================
// == NEW FEATURE: DAILY SALES STRATEGY
// ============================================================================
// Utility function to generate a unique ID for local use
const generateUUID = () => crypto.randomUUID();

// Helper function to format AI recommendation into bullet points
const formatRecommendation = (text: string | null) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
    const finalElements = [];
    let currentListItems: string[] = [];
    let listKeyCounter = 0; // To ensure unique keys for <ul> elements

    lines.forEach((line) => {
        const trimmedLine = line.trim();
        // Check if the line looks like a list item (starts with *, -, or a number followed by .)
        const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ') || /^\d+\.\s/.test(trimmedLine);

        if (isListItem) {
            // If it's a list item, add it to the current list items array
            const content = trimmedLine.replace(/^(\* |\- |\d+\.\s)/, '').trim();
            currentListItems.push(content);
        } else {
            // If it's not a list item
            if (currentListItems.length > 0) {
                // If we were collecting list items, close the list and add it to finalElements
                finalElements.push(
                    <ul key={`ul-${listKeyCounter++}`} className="list-disc list-inside space-y-2 text-gray-700">
                        {currentListItems.map((item, idx) => (
                            <li key={`li-${listKeyCounter}-${idx}`}>{item}</li>
                        ))}
                    </ul>
                );
                currentListItems = []; // Reset for the next list
            }
            // Add the current line as a paragraph
            finalElements.push(<p key={`p-${finalElements.length}`} className="mt-2 text-gray-700 leading-relaxed">{trimmedLine}</p>);
        }
    });

    // After the loop, if there are any remaining list items, add them
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

// Main Component for this feature
const DailyStrategy = () => {
    const [userId] = useState(generateUUID());
    const [dailyItemsData, setDailyItemsData] = useState([
        {
            id: generateUUID(),
            tiffinItem: '',
            ingredientPrice: '',
            dailySales: '',
            perPlateProfit: ''
        }
    ]);
    const [aiRecommendation, setAiRecommendation] = useState('Enter data for your tiffin items and click "Get Strategy" to receive a daily sales strategy.');
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState('');

    const tiffinItems = ['Idli', 'Dosa', 'Vada', 'Upma', 'Poori', 'Pongal', 'Uthappam', 'Kesari'];

    const addTiffinItem = () => {
        setDailyItemsData([...dailyItemsData, {
            id: generateUUID(),
            tiffinItem: '',
            ingredientPrice: '',
            dailySales: '',
            perPlateProfit: ''
        }]);
    };

    const removeTiffinItem = (id: string) => {
        setDailyItemsData(dailyItemsData.filter(item => item.id !== id));
    };

    const handleItemChange = (id: string, field: string, value: string) => {
        setDailyItemsData(dailyItemsData.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const getAiSuggestion = useCallback(async () => {
        const isValid = dailyItemsData.every(item =>
            item.tiffinItem && item.tiffinItem !== 'Select an item' &&
            item.ingredientPrice !== '' && item.dailySales !== '' && item.perPlateProfit !== ''
        );

        if (dailyItemsData.length === 0) {
            setMessage('Please add at least one tiffin item to get a strategy.');
            return;
        }

        if (!isValid) {
            setMessage('Please fill in all input fields and select a Tiffin Item for all added entries.');
            return;
        }

        setIsGenerating(true);
        setMessage('');
        setAiRecommendation('Generating strategy...');

        try {
            let itemDetails = dailyItemsData.map(item => `
        - Tiffin Item: ${item.tiffinItem}
          - Daily Ingredient Price: ${item.ingredientPrice} INR
          - Daily Sales (Plates): ${item.dailySales}
          - Per Plate Profit: ${item.perPlateProfit} INR
        `).join('');

            const prompt = `As a sales strategist for a Tiffin Hotel, analyze the following daily data for various tiffin items:
        ${itemDetails}

        Based on this information, provide a specific, actionable daily sales strategy.
        Consider the following aspects for each item or overall:
        - Pricing adjustments
        - Marketing focus (e.g., promotions, highlighting specific items)
        - Menu item recommendations (e.g., pushing high-profit items, reducing focus on low-profit ones)
        - Operational efficiency improvements

        Present the strategy in a clear, concise bullet-point format, with each point being a distinct actionable step. Ensure each point starts on a new line.`;

            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const apiKey = "AIzaSyC9ww598PYK9YbhQxaUdlwy7ps5aQaNcdM"; // Replace with your actual Gemini API key
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                 const errorBody = await response.json();
                 throw new Error(`API Error: ${errorBody.error?.message || 'Something went wrong'}`);
            }

            const result = await response.json();

            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const text = result.candidates[0].content.parts[0].text;
                setAiRecommendation(text);
            } else {
                setAiRecommendation('Failed to get a strategy. Please try again.');
                console.error("Gemini API response error:", result);
            }
        } catch (err: any) {
            console.error("Error calling Gemini API:", err);
            setAiRecommendation(`An error occurred: ${err.message}`);
            setMessage('An error occurred. Please check your network connection and API key.');
        } finally {
            setIsGenerating(false);
        }
    }, [dailyItemsData]);

    return (
        <div className="min-h-full bg-gradient-to-br from-indigo-50 to-purple-50 p-6 font-sans flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Daily Sales Strategy</h1>
                <div className="text-center text-sm text-gray-600 mb-4 p-2 bg-indigo-50 rounded-lg">
                    <p>Session ID: <span className="font-mono text-indigo-800 break-all">{userId}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Note: This is a temporary ID. Data is not saved after refresh.</p>
                </div>
                <div className="space-y-6">
                    {dailyItemsData.map((item, index) => (
                        <div key={item.id} className="border border-indigo-200 rounded-lg p-4 shadow-sm bg-indigo-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Tiffin Item #{index + 1}</h3>
                                {dailyItemsData.length > 1 && (
                                    <button onClick={() => removeTiffinItem(item.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out">
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label htmlFor={`tiffinItem-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Tiffin Item</label>
                                    <select id={`tiffinItem-${item.id}`} value={item.tiffinItem} onChange={(e) => handleItemChange(item.id, 'tiffinItem', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                                        <option value="">Select an item</option>
                                        {tiffinItems.map((tiffin) => (
                                            <option key={tiffin} value={tiffin}>{tiffin}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor={`ingredientPrice-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Daily Ingredient Price (INR)</label>
                                    <input type="number" id={`ingredientPrice-${item.id}`} value={item.ingredientPrice} onChange={(e) => handleItemChange(item.id, 'ingredientPrice', e.target.value)} placeholder="e.g., 5000" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                                </div>
                                <div>
                                    <label htmlFor={`dailySales-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Daily Sales (Plates)</label>
                                    <input type="number" id={`dailySales-${item.id}`} value={item.dailySales} onChange={(e) => handleItemChange(item.id, 'dailySales', e.target.value)} placeholder="e.g., 150" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                                </div>
                                <div>
                                    <label htmlFor={`perPlateProfit-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Per Plate Profit (INR)</label>
                                    <input type="number" id={`perPlateProfit-${item.id}`} value={item.perPlateProfit} onChange={(e) => handleItemChange(item.id, 'perPlateProfit', e.target.value)} placeholder="e.g., 25" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button onClick={addTiffinItem} className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out">
                            Add Another Tiffin Item
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}

                <div className="flex justify-center">
                    <button onClick={getAiSuggestion} disabled={isGenerating || dailyItemsData.length === 0}
                        className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition duration-300 ease-in-out ${isGenerating || dailyItemsData.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105'}`}>
                        {isGenerating ? 'Generating...' : 'Get Daily Strategy'}
                    </button>
                </div>

                <div className="bg-indigo-50 p-6 rounded-xl shadow-inner border border-indigo-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Sales Strategy</h2>
                    {formatRecommendation(aiRecommendation)}
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tips for Effective Strategy Implementation</h2>
                    <div className="space-y-4 text-gray-700">
                        <ul className="list-disc list-inside space-y-2">
                            <li><span className="font-semibold">Review Daily:</span> Use this tool daily to adapt to changing ingredient prices and sales trends.</li>
                            <li><span className="font-semibold">Experiment with Pricing:</span> Based on the AI's suggestions, try small price adjustments and monitor their impact on sales and profit.</li>
                            <li><span className="font-semibold">Promote High-Profit Items:</span> If the strategy suggests focusing on certain items, promote them actively through daily specials or visible displays.</li>
                            <li><span className="font-semibold">Optimize Inventory:</span> Use insights on ingredient prices and sales to manage your stock efficiently, reducing waste.</li>
                            <li><span className="font-semibold">Gather Customer Feedback:</span> Combine AI insights with direct customer feedback to refine your menu and offerings.</li>
                            <li><span className="font-semibold">Track Performance:</span> Keep a record of your daily sales and profit after implementing strategies to measure effectiveness over time.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// == MAIN APP COMPONENT (acts as State Manager and Router)
// ============================================================================
function App() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null); // Default to null for landing page
  const [ingredientPrices, setIngredientPrices] = useState<{ [key: string]: number }>({
    onions: 30, potatoes: 25, tomatoes: 40, lentils: 80, rice: 50,
    flour: 35, cheese: 200, oil: 120, salt: 10, spices: 15,
  });
  const [aiRecommendation, setAiRecommendation] = useState('');
  const menuItems = useMemo(() => [
    { id: 'onion-uttapam', name: 'Onion Uttapam', sellingPrice: 70, ingredients: { onions: 0.1, rice: 0.05, flour: 0.05, oil: 0.01, salt: 0.001, spices: 0.002, }, },
    { id: 'masala-dosa', name: 'Masala Dosa', sellingPrice: 85, ingredients: { potatoes: 0.15, rice: 0.07, lentils: 0.03, onions: 0.03, oil: 0.01, salt: 0.001, spices: 0.003, }, },
    { id: 'idli-sambar', name: 'Idli Sambar', sellingPrice: 60, ingredients: { rice: 0.1, lentils: 0.05, tomatoes: 0.05, spices: 0.005, salt: 0.001, }, },
    { id: 'cheese-uttapam', name: 'Cheese Uttapam', sellingPrice: 90, ingredients: { cheese: 0.05, rice: 0.05, flour: 0.05, onions: 0.02, oil: 0.01, salt: 0.001, spices: 0.002, }, },
    { id: 'plain-dosa', name: 'Plain Dosa', sellingPrice: 50, ingredients: { rice: 0.08, lentils: 0.02, oil: 0.005, salt: 0.001, }, },
  ], []);
  const [platesSold, setPlatesSold] = useState(() => {
    const initialSales: { [key: string]: number } = {};
    menuItems.forEach(item => { initialSales[item.id] = 10 + Math.floor(Math.random() * 50) });
    return initialSales;
  });
  const [menuData, setMenuData] = useState<any[]>([]);
  const [dailyPerformance, setDailyPerformance] = useState({ totalRevenue: 0, totalOverallProfit: 0 });
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIngredientPrices(p => ({ ...p, [name]: parseFloat(value) || 0 }));
  };
  const handlePlatesSoldChange = (id: string, delta: number) => {
    setPlatesSold(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));
  };
  
  const calculateMenuMetrics = useCallback(() => {
    let currentTotalRevenue = 0;
    let currentTotalOverallProfit = 0;
    const calculatedData = menuItems.map(item => {
      const totalCost = Object.entries(item.ingredients).reduce((acc, [ingredient, quantity]) => acc + (quantity * (ingredientPrices[ingredient as keyof typeof ingredientPrices] || 0)), 0);
      const profitPerPlate = item.sellingPrice - totalCost;
      const profitMargin = item.sellingPrice > 0 ? (profitPerPlate / item.sellingPrice) * 100 : 0;
      const plates = platesSold[item.id as keyof typeof platesSold] || 0;
      const itemRevenue = item.sellingPrice * plates;
      const itemProfit = profitPerPlate * plates;
      currentTotalRevenue += itemRevenue;
      currentTotalOverallProfit += itemProfit;
      return { ...item, cost: totalCost, profitPerPlate, profitMargin, platesSold: plates, itemRevenue, itemProfit };
    });
    setMenuData(calculatedData);
    setDailyPerformance({
      totalRevenue: parseFloat(currentTotalRevenue.toFixed(2)),
      totalOverallProfit: parseFloat(currentTotalOverallProfit.toFixed(2)),
    });
  }, [ingredientPrices, platesSold, menuItems]);

  const generateStaticAIRecommendation = useCallback(() => {
    if (!menuData || menuData.length === 0 || menuData.every(item => item.platesSold === 0)) {
        setAiRecommendation("Enter today's sales to get a profit recommendation.");
        return;
    }
    const sortedByProfit = [...menuData].sort((a, b) => b.profitMargin - a.profitMargin);
    const highestProfitItem = sortedByProfit[0];
    const lowerProfitItemsWithSales = sortedByProfit.filter(item => item.id !== highestProfitItem.id && item.platesSold > 0 && item.profitMargin < highestProfitItem.profitMargin - 5);
    if (highestProfitItem && highestProfitItem.profitMargin > 20 && lowerProfitItemsWithSales.length > 0) {
        const lowerProfitItem = lowerProfitItemsWithSales[0];
        const profitGainPerPlateShift = highestProfitItem.profitPerPlate - lowerProfitItem.profitPerPlate;
        const potentialExtraProfit = profitGainPerPlateShift * 10;
        setAiRecommendation(`**${highestProfitItem.name}** has a **${highestProfitItem.profitMargin.toFixed(0)}% margin**. Suggesting it over **${lowerProfitItem.name}** could earn an extra **₹${potentialExtraProfit.toFixed(2)}** for every 10 plates shifted.`);
    } else if (highestProfitItem) {
        setAiRecommendation(`Market is stable. **${highestProfitItem.name}** is your top earner with a **${highestProfitItem.profitMargin.toFixed(0)}% profit margin**. Keep it up!`);
    }
  }, [menuData]);

  useEffect(() => { calculateMenuMetrics(); }, [calculateMenuMetrics]);
  useEffect(() => { generateStaticAIRecommendation(); }, [generateStaticAIRecommendation]);

  const features = [
    { id: 'ai-chef', name: 'AI Sous-Chef', description: 'Recipe adjustments via AI', icon: Chef, color: 'text-orange-600', bgColor: 'bg-orange-50', badge: 'NEW' },
    { id: 'profit-optimizer', name: 'Profit Optimizer', description: 'Edit prices & sales data', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50', badge: 'HOT' },
    { id: 'analytics', name: 'Performance Analytics', description: 'View dynamic charts', icon: BarChart3, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: 'zero-waste', name: 'Zero-Waste Genius', description: 'Convert leftovers into profit', icon: Recycle, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'chaat-gpt', name: 'Chaat-GPT Voice', description: 'Voice-powered intelligence', icon: Mic, color: 'text-purple-600', bgColor: 'bg-purple-50', badge: 'AI' },
    { id: 'daily-strategy', name: 'Daily Sales Strategy', description: 'Market-based recommendations', icon: Target, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  ];
  const quickActions = [
    { name: 'Today\'s Ingredients', icon: Calendar, color: 'text-amber-600' },
    { name: 'Price Updates', icon: IndianRupee, color: 'text-emerald-600' },
    { name: 'Recipe Suggestions', icon: Lightbulb, color: 'text-yellow-600' },
    { name: 'Waste Tracker', icon: Clock, color: 'text-rose-600' }
  ];

  const renderActiveFeature = () => {
    if (!activeFeature) {
        return <LandingPage />;
    }
    switch (activeFeature) {
        case 'ai-chef': return <AIChef />;
        case 'profit-optimizer': 
            return <ProfitOptimizer 
                ingredientPrices={ingredientPrices} platesSold={platesSold} menuItems={menuItems}
                handlePriceChange={handlePriceChange} handlePlatesSoldChange={handlePlatesSoldChange}
                dailyPerformance={dailyPerformance} aiRecommendation={aiRecommendation}
            />;
        case 'analytics': 
            return <PerformanceAnalytics menuData={menuData} dailyPerformance={dailyPerformance} />;
        case 'zero-waste': return <ZeroWaste />;
        case 'chaat-gpt': return <ChaatGPT />;
        case 'daily-strategy': return <DailyStrategy />;
        default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">StallOS</h1>
                    <p className="text-sm text-gray-500">AI Street Food OS</p>
                </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Rajesh's Chaat Corner</p>
                    <p className="text-xs text-gray-500">Premium Vendor</p>
                </div>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
            </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Core Features</h2>
            <div className="space-y-2">
                {features.map((feature) => {
                    const Icon = feature.icon;
                    const isActive = activeFeature === feature.id;
                    return (
                        <button key={feature.id} onClick={() => setActiveFeature(feature.id)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative ${isActive ? `${feature.bgColor} border-opacity-20 border-current` : 'hover:bg-gray-50'}`}>
                            <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 p-2 rounded-lg ${isActive ? feature.bgColor : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors`}>
                                    <Icon className={`w-4 h-4 ${isActive ? feature.color : 'text-gray-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm font-medium ${isActive ? feature.color : 'text-gray-900'}`}>{feature.name}</p>
                                        {feature.badge && (<span className={`text-xs px-2 py-0.5 rounded-full font-medium ${feature.badge === 'NEW' ? 'bg-green-100 text-green-800' : feature.badge === 'HOT' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}>{feature.badge}</span>)}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="mt-8">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Quick Actions</h2>
                <div className="space-y-1">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button key={index} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${action.color}`} />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">{action.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Performance</h3>
                <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-600">Profit Margin</span><span className="text-xs font-semibold text-green-600">{(dailyPerformance.totalOverallProfit / dailyPerformance.totalRevenue * 100 || 0).toFixed(1)}%</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-600">Total Sales</span><span className="text-xs font-semibold text-blue-600">₹{dailyPerformance.totalRevenue.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-600">Total Profit</span><span className="text-xs font-semibold text-purple-600">₹{dailyPerformance.totalOverallProfit.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
        <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Settings & Support</span>
            </button>
            <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">Powered by Chaat-GPT</p>
                <p className="text-xs text-gray-300">The Future of Street Food</p>
            </div>
        </div>
      </div>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderActiveFeature()}
      </main>
    </div>
  );
}

export default App;