const RecommendationBox = ({ text }: { text: string }) => (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-5 rounded-lg shadow-md animate-fade-in">
        <h2 className="font-bold text-lg mb-2">🧠 Chaat-GPT Suggestion:</h2>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
);

export default RecommendationBox