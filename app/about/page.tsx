import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Our Story</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Crafting Everyday Modern Luxury
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ShopZen is founded on a singular conviction: premium design and everyday affordability should coexist effortlessly.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2rem] bg-[#f8fafc] border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-xs mb-6 text-xl">
              ✨
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Curated Quality</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every gadget, garment, and accessory undergoes rigorous handpicked quality checks.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-[#f8fafc] border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-xs mb-6 text-xl">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Lightning Fast Delivery</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Integrated real-time logistics guarantee seamless dispatch and prompt doorstep delivery.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-[#f8fafc] border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-xs mb-6 text-xl">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Customer First</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              24/7 dedicated support and a hassle-free 7-day return guarantee for complete peace of mind.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-xs transition-colors"
          >
            Explore Catalog →
          </Link>
        </div>
      </section>
    </div>
  );
}
