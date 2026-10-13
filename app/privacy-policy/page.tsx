export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-700">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>

        <section className="space-y-2 pt-4">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p className="text-sm leading-relaxed">
            We collect information you provide directly to us when creating an account, making a purchase, or contacting customer support, including your name, email, shipping address, and payment information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
          <p className="text-sm leading-relaxed">
            Your information is used strictly to process orders, facilitate shipment tracking, improve website performance, and send relevant transaction notices.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Data Security</h2>
          <p className="text-sm leading-relaxed">
            We implement SSL 256-bit encryption and partner with certified payment gateways (such as Razorpay) to ensure all financial credentials remain confidential and secure.
          </p>
        </section>
      </div>
    </div>
  );
}
