const LoadingSpinner = () => (
  <div className="text-center p-4">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-2"></div>
    <p className="text-gray-600">Chaat-GPT is thinking...</p>
  </div>
);

export default LoadingSpinner