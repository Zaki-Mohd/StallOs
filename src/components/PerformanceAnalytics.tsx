// ============================================================================
// == DYNAMIC FEATURE COMPONENT: Performance Analytics
// ============================================================================

import { useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8 space-y-8">
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

export default PerformanceAnalytics;