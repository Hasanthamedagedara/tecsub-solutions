"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courses, wallets } from "@/data/product";
import { useRouter } from "next/navigation";

/* ─── Step Indicator ─── */
function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${i < current
                ? "bg-green-500 text-white"
                : i === current
                  ? "bg-tecsubCyan text-tecsubNavy"
                  : "border border-white/20 text-white/40"
                }`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className="text-[9px] uppercase tracking-wider font-medium hidden sm:block"
              style={{ color: i <= current ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 rounded-full transition-all duration-500 mb-4 sm:mb-3 ${i < current ? "bg-green-500" : "bg-white/10"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─── */
export default function CourseView({ id }: { id: string }) {
  const router = useRouter();
  const courseIndex = parseInt(id) - 1;
  const course = courses[courseIndex];

  // Steps: 0=details, 1=payment, 2=pending, 3=content
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "gpay" | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<"binance" | "bybit">("binance");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storageKey = `tecsub_course_${id}_paid`;

  // Check localStorage on mount
  useEffect(() => {
    if (!course) return;
    if (course.price === 0) {
      setIsPaid(true);
      setStep(3);
    } else {
      const saved = localStorage.getItem(storageKey);
      if (saved === "true") {
        setIsPaid(true);
        setStep(3);
      }
    }
  }, [course, storageKey]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--navy)" }}>
        <div className="text-center">
          <h1 className="font-bebas text-4xl text-red-400 mb-4">Course Not Found</h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = () => {
    setStep(2);
  };

  const handleApproveDemo = () => {
    localStorage.setItem(storageKey, "true");
    setIsPaid(true);
    setStep(3);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepLabels = ["Details", "Payment", "Review", "Access"];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ background: "var(--navy)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/#courses")}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:text-tecsubCyan transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </button>

        {/* Step Indicator */}
        <StepIndicator current={step} steps={stepLabels} />

        {/* Animated Step Content */}
        <AnimatePresence mode="wait">
          {/* ═══════════ STEP 0: Course Details ═══════════ */}
          {step === 0 && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-6 sm:p-10"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "1.25rem" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{course.image}</span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full border border-tecsubCyan/20 text-tecsubCyan">
                    {course.level}
                  </span>
                </div>
              </div>

              <h1 className="font-bebas text-3xl sm:text-5xl tracking-wide mb-3" style={{ color: "var(--text-primary)" }}>
                {course.title}
              </h1>
              <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Duration", value: course.duration, icon: "⏱️" },
                  { label: "Lessons", value: `${course.lessons} lessons`, icon: "📚" },
                  { label: "Level", value: course.level, icon: "📊" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    <span className="text-xl block mb-1">{stat.icon}</span>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between p-5 rounded-xl" style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: "1rem" }}>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>Course Price</p>
                  <p className="font-bebas text-3xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                    {course.price === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `$${course.price} USD`
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (course.price === 0) {
                      handleApproveDemo();
                    } else {
                      setStep(1);
                    }
                  }}
                  className="px-8 py-3.5 rounded-full bg-tecsubCyan text-tecsubNavy font-bold text-sm hover:shadow-[0_0_35px_rgba(0,229,255,0.5)] transition-all duration-300 uppercase tracking-wide"
                >
                  {course.price === 0 ? "Access Now →" : "Proceed to Payment →"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════ STEP 1: Payment Gateway ═══════════ */}
          {step === 1 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-6 sm:p-10"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "1.25rem" }}
            >
              <h2 className="font-bebas text-2xl sm:text-4xl tracking-wide mb-2" style={{ color: "var(--text-primary)" }}>
                Payment Gateway
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Choose your payment method for <strong>{course.title}</strong> — ${course.price} {course.currency}
              </p>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Card Option */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-5 rounded-xl text-left transition-all duration-300 ${paymentMethod === "card"
                    ? "ring-2 ring-tecsubCyan"
                    : "hover:border-white/30"
                    }`}
                  style={{
                    background: paymentMethod === "card" ? "rgba(0,229,255,0.08)" : "rgba(0,0,0,0.3)",
                    border: paymentMethod === "card" ? "1px solid rgba(0,229,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Card Payment</p>
                      <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Visa / MasterCard / Amex</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {["VISA", "MC", "AMEX"].map((c) => (
                      <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-bold" style={{ color: "var(--text-secondary)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Crypto Option */}
                <button
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-5 rounded-xl text-left transition-all duration-300 ${paymentMethod === "crypto"
                    ? "ring-2 ring-tecsubCyan"
                    : "hover:border-white/30"
                    }`}
                  style={{
                    background: paymentMethod === "crypto" ? "rgba(0,229,255,0.08)" : "rgba(0,0,0,0.3)",
                    border: paymentMethod === "crypto" ? "1px solid rgba(0,229,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      <span className="text-lg">₿</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Crypto (USDT)</p>
                      <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>USDT TRC20 • Binance / Bybit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {["USDT", "TRC20"].map((c) => (
                      <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-bold" style={{ color: "var(--text-secondary)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Google Pay Option */}
                <button
                  onClick={() => setPaymentMethod("gpay")}
                  className={`p-5 rounded-xl text-left transition-all duration-300 ${paymentMethod === "gpay"
                    ? "ring-2 ring-tecsubCyan"
                    : "hover:border-white/30"
                    }`}
                  style={{
                    background: paymentMethod === "gpay" ? "rgba(0,229,255,0.08)" : "rgba(0,0,0,0.3)",
                    border: paymentMethod === "gpay" ? "1px solid rgba(0,229,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4" />
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574" fill="#34A853" />
                        <path d="M4.801 14.4a7.47 7.47 0 01-.4-2.4c0-.835.145-1.645.4-2.4" fill="#FBBC05" />
                        <path d="M12.24 4.426c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-4.69 0-8.75 2.69-10.72 6.6l3.28 2.826c.78-2.34 2.96-4" fill="#EA4335" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Google Pay</p>
                      <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Fast & Secure Checkout</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-bold" style={{ color: "var(--text-secondary)" }}>GPay</span>
                  </div>
                </button>
              </div>

              {/* Card Payment — Redirect Button */}
              <AnimatePresence mode="wait">
                {paymentMethod === "card" && (
                  <motion.div
                    key="card-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="rounded-xl p-6" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem" }}>
                      <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                        💳 Secure Card Payment
                      </p>
                      <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                        You will be redirected to a secure payment page to complete your purchase of <strong className="text-tecsubCyan">${course.price} USD</strong>.
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        {["🔒 SSL Encrypted", "🛡️ Secure", "✅ Verified"].map((b) => (
                          <span key={b} className="text-[9px] font-medium" style={{ color: "var(--text-secondary)" }}>{b}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setStep(0)}
                          className="px-6 py-3 rounded-full border border-white/15 text-sm font-semibold hover:border-white/30 transition-all"
                          style={{ color: "var(--text-primary)" }}
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => router.push(`/payment/${id}`)}
                          className="flex-1 py-3.5 rounded-full bg-tecsubCyan text-tecsubNavy font-bold text-sm hover:shadow-[0_0_35px_rgba(0,229,255,0.5)] transition-all duration-300 uppercase tracking-wide"
                        >
                          💳 Pay with Card →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Google Pay — Redirect Button */}
                {paymentMethod === "gpay" && (
                  <motion.div
                    key="gpay-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="rounded-xl p-6" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem" }}>
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4" />
                        </svg>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          Google Pay Checkout
                        </p>
                      </div>
                      <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                        You will be redirected to complete your purchase of <strong className="text-tecsubCyan">${course.price} USD</strong> via Google Pay.
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        {["🔒 SSL Encrypted", "🛡️ Secure", "✅ Verified"].map((b) => (
                          <span key={b} className="text-[9px] font-medium" style={{ color: "var(--text-secondary)" }}>{b}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setStep(0)}
                          className="px-6 py-3 rounded-full border border-white/15 text-sm font-semibold hover:border-white/30 transition-all"
                          style={{ color: "var(--text-primary)" }}
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => router.push(`/payment/${id}`)}
                          className="flex-1 py-3.5 rounded-full font-bold text-sm hover:shadow-[0_0_35px_rgba(66,133,244,0.5)] transition-all duration-300 uppercase tracking-wide flex items-center justify-center gap-2"
                          style={{ background: "#4285F4", color: "#fff" }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#fff" />
                          </svg>
                          Pay with Google Pay →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Crypto Payment Details */}
                {paymentMethod === "crypto" && (
                  <motion.div
                    key="crypto-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 overflow-hidden"
                  >
                    {/* Wallet Tabs */}
                    <div className="flex gap-2 mb-4">
                      {(["binance", "bybit"] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => setSelectedWallet(w)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${selectedWallet === w
                            ? "bg-tecsubCyan text-tecsubNavy"
                            : "border border-white/15"
                            }`}
                          style={{ color: selectedWallet === w ? undefined : "var(--text-secondary)" }}
                        >
                          {w === "binance" ? "Binance" : "Bybit"}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-xl p-5" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem" }}>
                      <p className="text-xs font-medium text-tecsubCyan mb-2">
                        {wallets[selectedWallet].label}
                      </p>
                      <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                        Send exactly <strong className="text-tecsubCyan">${course.price} USDT</strong> to:
                      </p>
                      <div className="flex items-center gap-2 mt-2 p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.4)" }}>
                        <code className="text-[11px] font-mono break-all flex-1" style={{ color: "var(--text-primary)" }}>
                          {wallets[selectedWallet].address}
                        </code>
                        <button
                          onClick={() => copyAddress(wallets[selectedWallet].address)}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-semibold flex-shrink-0 transition-all duration-300"
                          style={{
                            background: copied ? "rgba(34,197,94,0.2)" : "rgba(0,229,255,0.1)",
                            color: copied ? "#22c55e" : "#00E5FF",
                            border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(0,229,255,0.2)",
                          }}
                        >
                          {copied ? "Copied ✓" : "Copy"}
                        </button>
                      </div>
                      <p className="text-[10px] mt-3" style={{ color: "var(--text-secondary)" }}>
                        ⚠️ Only send USDT on TRC20 network. After sending, take a screenshot.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Screenshot Upload — only for Crypto payment */}
              {paymentMethod === "crypto" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    📸 Upload Payment Screenshot
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!screenshotPreview ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-8 rounded-xl border-2 border-dashed border-white/15 hover:border-tecsubCyan/40 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-tecsubCyan/10 transition-colors">
                          <svg className="w-6 h-6 text-tecsubCyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                          Click to upload payment screenshot
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                          PNG, JPG, JPEG — Max 10MB
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,229,255,0.2)" }}>
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="w-full max-h-64 object-contain bg-black/30"
                      />
                      <button
                        onClick={() => {
                          setScreenshot(null);
                          setScreenshotPreview(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                      >
                        ✕
                      </button>
                      <div className="p-3 flex items-center gap-2" style={{ background: "rgba(0,0,0,0.4)" }}>
                        <span className="text-green-400 text-sm">✓</span>
                        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                          {screenshot?.name}
                        </span>
                        <span className="text-[10px] ml-auto" style={{ color: "var(--text-secondary)" }}>
                          {screenshot && (screenshot.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => setStep(0)}
                      className="px-6 py-3 rounded-full border border-white/15 text-sm font-semibold hover:border-white/30 transition-all"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSubmitPayment}
                      disabled={!screenshot}
                      className={`flex-1 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 ${screenshot
                        ? "bg-tecsubCyan text-tecsubNavy hover:shadow-[0_0_35px_rgba(0,229,255,0.5)]"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                        }`}
                    >
                      Submit Payment Proof →
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════ STEP 2: Pending Review ═══════════ */}
          {step === 2 && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 sm:p-12 text-center"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "1.25rem" }}
            >
              {/* Animated Spinner */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-tecsubCyan/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ borderTopColor: "#00E5FF" }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                  ⏳
                </div>
              </div>

              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide mb-3" style={{ color: "var(--text-primary)" }}>
                Payment Under Review
              </h2>
              <p className="text-sm max-w-md mx-auto mb-2" style={{ color: "var(--text-secondary)" }}>
                Your payment proof has been submitted successfully. We will verify your payment and unlock the course content.
              </p>
              <p className="text-xs mb-8" style={{ color: "var(--text-secondary)" }}>
                This usually takes 5–30 minutes. We&apos;ll contact you via{" "}
                <a href="https://t.me/Hasanthamedagedra" target="_blank" rel="noopener noreferrer" className="text-tecsubCyan underline">
                  Telegram
                </a>
                .
              </p>

              {/* Order Summary */}
              <div className="rounded-xl p-5 mb-6 text-left max-w-sm mx-auto" style={{ background: "rgba(0,0,0,0.3)", borderRadius: "0.75rem" }}>
                <p className="text-[10px] uppercase tracking-widest font-bold text-tecsubCyan mb-3">Order Summary</p>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "var(--text-secondary)" }}>Course</span>
                  <span style={{ color: "var(--text-primary)" }}>{course.title}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "var(--text-secondary)" }}>Amount</span>
                  <span style={{ color: "var(--text-primary)" }}>${course.price} {course.currency}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--text-secondary)" }}>Method</span>
                  <span style={{ color: "var(--text-primary)" }}>{paymentMethod === "card" ? "Card" : paymentMethod === "gpay" ? "Google Pay" : "Crypto (USDT)"}</span>
                </div>
              </div>

              {/* Demo Approve Button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleApproveDemo}
                  className="px-8 py-3.5 rounded-full bg-green-500 text-white font-bold text-sm hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] transition-all duration-300 uppercase tracking-wide"
                >
                  ✓ Approve Payment (Demo)
                </button>
                <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                  This demo button simulates admin approval
                </p>
              </div>
            </motion.div>
          )}

          {/* ═══════════ STEP 3: Content Access ═══════════ */}
          {step === 3 && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Success Banner */}
              <div
                className="rounded-xl p-5 mb-6 flex items-center gap-4"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "1rem" }}
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎉</span>
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    {course.price === 0 ? "Free Access Unlocked!" : "Payment Verified — Access Granted!"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Enjoy your course content below. You can revisit anytime.
                  </p>
                </div>
              </div>

              {/* Course Title */}
              <div className="glass-panel p-6 sm:p-8 mb-6" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "1.25rem" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{course.image}</span>
                  <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                    {course.title}
                  </h2>
                </div>

                {/* Video Player */}
                {course.videoId && (
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest font-bold text-tecsubCyan mb-3">📺 Course Video</p>
                    <div className="video-container rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,229,255,0.1)" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${course.videoId}?rel=0`}
                        title={course.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Download Section */}
                {course.downloadUrl && (
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-tecsubCyan mb-3">📁 Course Materials</p>
                    <a
                      href={course.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                      style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem" }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-tecsubCyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-tecsubCyan/20 transition-colors">
                        <svg className="w-6 h-6 text-tecsubCyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          Download Course Files
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                          Source code, resources, and supplementary materials
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-tecsubCyan group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { label: "Duration", value: course.duration, icon: "⏱️" },
                    { label: "Lessons", value: `${course.lessons}`, icon: "📚" },
                    { label: "Level", value: course.level, icon: "📊" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg p-3 text-center"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    >
                      <span className="text-base">{stat.icon}</span>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                      <p className="text-[9px]" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}