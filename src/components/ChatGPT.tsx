import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Toaster, toast } from "sonner";
import { Phone, BotMessageSquare, Loader2Icon, Mic } from "lucide-react";
import ChatMessage from "./ChatMessage";
const ChatGPT = () => {
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
    const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // IMPORTANT: Replace with your Vapi Public Key
        const vapiInstance = new Vapi('59992990-1840-4767-adf9-4fd44bda821e');
        setVapi(vapiInstance);

        vapiInstance.on('call-start', () => {
            toast.success("Chaat-GPT is connected!");
            setIsSessionActive(true);
            setConversation([]);
        });

        vapiInstance.on('call-end', () => {
            toast.info("Session ended.");
            setIsSessionActive(false);
            setIsAssistantSpeaking(false);
        });

        vapiInstance.on('speech-start', () => setIsAssistantSpeaking(true));
        vapiInstance.on('speech-end', () => setIsAssistantSpeaking(false));

        vapiInstance.on('message', (message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final' && message.transcript) {
                setConversation(prev => [...prev, { role: 'user', text: message.transcript }]);
            } else if (message.type === 'assistant-message' && message.message) {
                setConversation(prev => [...prev, { role: 'assistant', text: message.message as string }]);
            }
        });

        return () => { vapiInstance.stop(); };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const startSession = () => {
        if (!vapi) return;
        toast.loading("Connecting to Chaat-GPT...");

        const assistantConfig = {
            name: "Chaat-GPT",
            firstMessage: "Namaste! Main Chaat-GPT hoon. How can I help you manage your stall today?",
            transcriber: { provider: "deepgram", model: "nova-2", language: "en-IN", },
            voice: { provider: "playht", voiceId: "jennifer", },
            model: {
                provider: "openai",
                model: "gpt-4-turbo",
                messages: [{
                    role: "system",
                    content: `You are "Chaat-GPT," a specialized AI sous-chef and business analyst for Indian street food vendors. Your persona is helpful, concise, and friendly. You understand Hinglish (Telugu + Hindi + English) perfectly. Your goal is to help vendors maximize profit and maintain quality. You have three core functions: 1. **AI Sous-Chef:** When the user describes their ingredients (e.g., "tomatoes are sour," "chilies are mild"), provide precise, simple recipe adjustments to maintain taste consistency. Give measurements in grams, ml, and simple terms like 'chutki bhar' (a pinch). 2. **Profit Optimizer:** When the user gives you ingredient prices, calculate per-plate costs and suggest which high-margin dish to promote for the day. Be direct and give clear, actionable advice. 3. **Zero-Waste Genius:** When the user tells you their leftover ingredients, generate a simple, creative recipe to sell the next day as a "special." Name the new dish. Always be ready to switch between these roles based on the user's voice commands. Start the conversation by introducing yourself and asking how you can help.`,
                }, ],
            },
        };

        vapi.start(assistantConfig);
    };

    const stopSession = () => { vapi?.stop(); };

    const handleButtonClick = () => {
        if (isSessionActive) { stopSession(); } 
        else { startSession(); }
    };

    return (
        <div className="h-full w-full flex items-center justify-center">
            <Toaster richColors position="top-right" />
            <div className="w-full max-w-2xl h-[90%] lg:h-[80%] flex flex-col bg-white rounded-2xl shadow-xl border border-gray-200">
                <header className="flex justify-between items-center p-6 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Chaat-GPT Assistant</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                            {isAssistantSpeaking ? "Assistant is speaking..." : "Ready"}
                        </span>
                        {isAssistantSpeaking && <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>}
                    </div>
                </header>

                <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
                    {conversation.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <BotMessageSquare className="h-16 w-16 mb-4" />
                            <p>Click "Start Session" to talk to Chaat-GPT.</p>
                            <p className="text-sm mt-2">e.g., "Aaj ke tamatar thode khatte hain."</p>
                        </div>
                    ) : (
                        conversation.map((msg, index) => (
                            <ChatMessage key={index} role={msg.role} text={msg.text} />
                        ))
                    )}
                </div>

                <div className="flex justify-center items-center p-6 border-t">
                    <button
                        onClick={handleButtonClick}
                        disabled={!vapi}
                        className={`flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-300 shadow-lg ${!vapi ? 'bg-gray-400 cursor-not-allowed' : ''} ${isSessionActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        {isSessionActive ? (
                            <><Phone className="h-6 w-6" /> End Session</>
                        ) : (
                            !vapi ? (
                                <><Loader2Icon className="h-6 w-6 animate-spin" /> Initializing...</>
                            ) : (
                                <><Mic className="h-6 w-6" /> Start Session</>
                            )
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatGPT