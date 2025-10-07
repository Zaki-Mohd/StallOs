import { useEffect, useState } from "react";
import { Brain, ChefHat as Chef, TrendingUp, Recycle } from "lucide-react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const LandingPage = () => {
  const [authRoute, setAuthRoute] = useState<'signin' | 'signup' | null>(null);

  useEffect(() => {
    const checkHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'signin' || h === 'signup') setAuthRoute(h as 'signin' | 'signup');
      else setAuthRoute(null);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Top Navbar for Landing Page */}
      <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200 shadow-sm">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between">
          <button onClick={() => { window.location.hash = ''; }} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900 group-hover:text-gray-950">StallOS</p>
              <p className="text-xs text-gray-500">AI Street Food OS</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { window.location.hash = 'signin'; }}
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                ${authRoute === 'signin'
                  ? 'border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              aria-current={authRoute === 'signin' ? 'page' : undefined}
            >
              Sign In
            </button>
            <button
              onClick={() => { window.location.hash = 'signup'; }}
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600
                ${authRoute === 'signup'
                  ? 'bg-orange-600 ring-2 ring-orange-300'
                  : 'bg-orange-600 hover:bg-orange-700'
                }`}
              aria-current={authRoute === 'signup' ? 'page' : undefined}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex-1 flex flex-col justify-center items-center">
        {authRoute === 'signin' ? (
          <SignIn onSwitch={(t) => { window.location.hash = t; }} />
        ) : authRoute === 'signup' ? (
          <SignUp onSwitch={(t) => { window.location.hash = t; }} />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default LandingPage;