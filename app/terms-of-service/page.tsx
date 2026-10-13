export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-700">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>

        <section className="space-y-2 pt-4">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed">
            By accessing or using ShopZen, you agree to be bound by these terms and conditions. If you disagree with any part of the terms, you may not access our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Purchases and Payments</h2>
          <p className="text-sm leading-relaxed">
            Prices for products are subject to change without notice. We reserve the right to refuse or cancel any order for reasons such as product unavailability or inaccuracies in product or pricing information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Returns and Refunds</h2>
          <p className="text-sm leading-relaxed">
            Returns are accepted within 7 days of delivery according to our return policy guidelines. Refunds are credited back to the original method of payment upon verification of returned items.
          </p>
        </section>
      </div>
    </div>
  );
}
