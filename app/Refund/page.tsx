export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-gray-300">
      <h1 className="text-4xl font-bold text-white mb-8">Refund Policy for TecSub Solutions (Website &amp; Mobile App)</h1>
      <p className="mb-6 text-sm text-gray-400">Last Updated: February 28, 2026</p>
      <p className="mb-8">
        At TecSub Solutions, we want to ensure our users are satisfied with our digital products, software, and courses. Please read our refund policy carefully before making a purchase.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">1. Digital Software &amp; Tools</h2>
        <p className="mb-3">
          Since products like Tecsub Recorder, Tecsub VPN, and Tecsub Cleaner are downloadable digital software, we generally do not offer refunds once the software has been downloaded or the license key has been activated.
        </p>
        <p>
          If you experience technical issues that our support team cannot resolve within 7 days, a partial or full refund may be considered at our discretion.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">2. Online Courses</h2>
        <p className="mb-3">
          For paid courses such as the AI Website Review Masterclass or Full-Stack App Development, users can request a refund within <strong className="text-white">48 hours</strong> of purchase, provided that less than 20% of the course content has been accessed.
        </p>
        <p>
          Refund requests made after 48 hours or after significant progress in the course will not be accepted.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">3. Crypto Payments (USDT TRC20)</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Payments made via USDT (Binance or Bybit) are subject to network fees.</li>
          <li>In the event of a refund for a crypto payment, the refund will be processed in USDT, and the user will be responsible for the transaction/network fees.</li>
          <li>Refunds will be calculated based on the USD value at the time of the original transaction.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">4. Non-Refundable Items</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Any service marked as &quot;Free&quot; (e.g., Tech Content Creation course or online browser tools) does not carry any monetary value and is not eligible for any claims.
          </li>
          <li>
            Service fees or processing fees charged by third-party payment gateways (Visa/MasterCard/Google Pay) are non-refundable.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">5. How to Request a Refund</h2>
        <p>
          To request a refund, please email us at{" "}
          <a href="mailto:tecsubsolutions@gmail.com" className="text-tecsubCyan hover:underline">
            tecsubsolutions@gmail.com
          </a>{" "}
          with your order details and the reason for the request. We will process your request within <strong className="text-white">5-7 business days</strong>.
        </p>
      </section>
    </div>
  );
}