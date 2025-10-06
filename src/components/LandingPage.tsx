import { Brain, ChefHat as Chef, TrendingUp, Recycle } from "lucide-react";

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
        The AI-powered operating system for street food vendors. Transform
        challenges into opportunities and leftovers into profit.
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
      <p className="mt-12 text-gray-500">
        Select a feature from the sidebar to get started.
      </p>
    </div>
  </div>
);


export default LandingPage;