export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Animated loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-25" />
          <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-600">
            ✨
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">Loading ShopZen</p>
          <p className="text-xs text-slate-400 mt-0.5">Please wait while we fetch the latest data...</p>
        </div>
      </div>
    </div>
  );
}
