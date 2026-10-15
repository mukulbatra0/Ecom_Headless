import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm text-center">
        {/* Animated Badge */}
        <div className="w-24 h-24 rounded-3xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-xs">
          <span className="text-4xl font-extrabold tracking-tight">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Quick navigation actions */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>Back to Home</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>

          <Link
            href="/products"
            className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-slate-800 text-xs font-semibold rounded-full transition-colors border border-gray-200 flex items-center justify-center gap-2"
          >
            <span>Browse Products Catalog</span>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="pt-8 mt-8 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
          <Link href="/track-order" className="hover:text-indigo-600 transition-colors font-medium">
            📦 Track an Order
          </Link>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors font-medium">
            💬 Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
