import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChefHat as Chef, TrendingUp, Recycle, Brain, BarChart3, Calendar, Settings, User, Mic, IndianRupee, Lightbulb, Target, Clock, Star, Menu } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import AIChef from './components/AIChef';
import ProfitOptimizer from './components/ProfitOptimizer';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import ZeroWaste from './components/ZeroWaste';
import LandingPage from './components/LandingPage';
import ChatGPT from './components/ChatGPT';

import Footer from './components/Footer';
import DailyStrategy from './components/DailyStrategy';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

// ===========================================================================
// == MAIN APP COMPONENT (State Manager and Router)
// ===========================================================================
function App() {
    const [activeFeature, setActiveFeature] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const handleFeatureSelect = (featureId: string | null) => {
        setActiveFeature(featureId);
        setIsSidebarOpen(false); // Close sidebar on selection (for mobile)
    }

    const features = [
        { id: 'ai-chef', name: 'AI Sous-Chef', description: 'Recipe adjustments via AI', icon: Chef, color: 'text-orange-600', bgColor: 'bg-orange-50', badge: 'NEW' },
        { id: 'profit-optimizer', name: 'Profit Optimizer', description: 'Edit prices & sales data', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50', badge: 'HOT' },
        { id: 'analytics', name: 'Performance Analytics', description: 'View dynamic charts', icon: BarChart3, color: 'text-pink-600', bgColor: 'bg-pink-50' },
        { id: 'zero-waste', name: 'Zero-Waste Genius', description: 'Convert leftovers into profit', icon: Recycle, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { id: 'chaat-gpt', name: 'Chaat-GPT Voice', description: 'Voice-powered intelligence', icon: Mic, color: 'text-purple-600', bgColor: 'bg-purple-50', badge: 'AI' },
        { id: 'daily-strategy', name: 'Daily Sales Strategy', description: 'Market-based recommendations', icon: Target, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    ];

    const quickActionMapping: { [key: string]: { id: string; icon: React.ElementType; color: string } } = {
        "Today's Ingredients": { id: 'ai-chef', icon: Calendar, color: 'text-amber-600' },
        'Price Updates': { id: 'profit-optimizer', icon: IndianRupee, color: 'text-emerald-600' },
        'Recipe Suggestions': { id: 'chaat-gpt', icon: Lightbulb, color: 'text-yellow-600' },
        'Waste Tracker': { id: 'zero-waste', icon: Clock, color: 'text-rose-600' }
    };

    const renderActiveFeature = () => {
        if (!activeFeature) return <LandingPage />;
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
            case 'chaat-gpt': return <ChatGPT />;
            case 'daily-strategy': return <DailyStrategy />;
            default: return <LandingPage />;
        }
    };

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={() => handleFeatureSelect(null)}>
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
                            <button key={feature.id} onClick={() => handleFeatureSelect(feature.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative ${isActive ? `${feature.bgColor}` : 'hover:bg-gray-50'}`}>
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
                <div>

                </div>
                <div className="mt-8">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Quick Actions</h2>
                    <div className="space-y-1">
                        {Object.entries(quickActionMapping).map(([name, action]) => {
                            const Icon = action.icon;
                            return (
                                <button key={name} onClick={() => handleFeatureSelect(action.id)} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group flex items-center space-x-3">
                                    <Icon className={`w-4 h-4 ${action.color}`} />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Performance</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center"><span className="text-xs text-gray-600">Profit Margin</span><span className="text-xs font-semibold text-green-600">{(dailyPerformance.totalRevenue > 0 ? dailyPerformance.totalOverallProfit / dailyPerformance.totalRevenue * 100 : 0).toFixed(1)}%</span></div>
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
            </div>
        </>
    )

    return (
        <div className="h-screen bg-gray-50 flex">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex md:hidden ${isSidebarOpen ? '' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div onClick={() => setIsSidebarOpen(false)} className={`fixed inset-0 bg-black transition-opacity ${isSidebarOpen ? 'opacity-30' : 'opacity-0'}`}></div>
                {/* Sidebar */}
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl border-r border-gray-200 transform transition-transform ease-in-out duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="w-80 flex flex-col bg-white shadow-xl border-r border-gray-200">
                    <SidebarContent />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="md:hidden pl-3 pt-3 pr-3 sm:pl-4 sm:pt-4 sm:pr-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                {/* 👇 The updated scrollable container */}
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="p-4 md:p-8">
                        {renderActiveFeature()}
                    </div>
                    {/* The footer is now part of the scrollable main content */}
                    <Footer />
                </main>
            </div>
        </div>
    );
}

export default App;
