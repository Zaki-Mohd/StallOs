// ============================================================================
// == FEATURE COMPONENT: Profit Optimizer
// ============================================================================
const ProfitOptimizer = ({
    ingredientPrices, platesSold, menuItems,
    handlePriceChange, handlePlatesSoldChange,
    dailyPerformance, aiRecommendation
}: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8">
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

export default ProfitOptimizer;