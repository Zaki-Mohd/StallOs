const ZeroWasteLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="text-gray-600">Generating your genius recipe...</p>
    </div>
);

export default ZeroWasteLoadingSpinner;