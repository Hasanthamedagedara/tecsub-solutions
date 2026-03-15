"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthButton from "@/components/AuthButton";

export default function AuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    useEffect(() => {
        const handler = () => setIsOpen(true);
        window.addEventListener("tecsub-open-auth", handler);
        return () => window.removeEventListener("tecsub-open-auth", handler);
    }, []);

    const close = () => {
        setIsOpen(false);
        setLoadingProvider(null);
        setEmail("");
        setPassword("");
        setName("");
    };

    const handleSocial = (provider: string) => {
        setLoadingProvider(provider);
        setTimeout(() => {
            setLoadingProvider(null);
            close();
        }, 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProvider("email");
        setTimeout(() => {
            setLoadingProvider(null);
            close();
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="auth-modal-backdrop"
                        onClick={close}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 28, stiffness: 320 }}
                        className="auth-modal"
                    >
                        {/* Close Button */}
                        <button onClick={close} className="auth-modal-close" aria-label="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="auth-modal-header">
                            <div className="auth-modal-logo">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h2 className="auth-modal-title">
                                {mode === "login" ? "Welcome back" : "Create account"}
                            </h2>
                            <p className="auth-modal-subtitle">
                                {mode === "login"
                                    ? "Sign in to continue to Tecsub"
                                    : "Join the Tecsub community today"}
                            </p>
                        </div>

                        {/* Social Buttons */}
                        <div className="auth-modal-social">
                            <AuthButton
                                variant="outline"
                                socialProvider="google"
                                onClick={() => handleSocial("google")}
                                isLoading={loadingProvider === "google"}
                            >
                                Continue with Google
                            </AuthButton>
                            <AuthButton
                                variant="outline"
                                socialProvider="facebook"
                                onClick={() => handleSocial("facebook")}
                                isLoading={loadingProvider === "facebook"}
                            >
                                Continue with Facebook
                            </AuthButton>
                            <AuthButton
                                variant="outline"
                                socialProvider="x"
                                onClick={() => handleSocial("x")}
                                isLoading={loadingProvider === "x"}
                            >
                                Continue with X
                            </AuthButton>
                            <AuthButton
                                variant="outline"
                                socialProvider="apple"
                                onClick={() => handleSocial("apple")}
                                isLoading={loadingProvider === "apple"}
                            >
                                Continue with Apple
                            </AuthButton>
                        </div>

                        {/* Divider */}
                        <div className="auth-modal-divider">
                            <span className="auth-modal-divider-line" />
                            <span className="auth-modal-divider-text">or</span>
                            <span className="auth-modal-divider-line" />
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleSubmit} className="auth-modal-form">
                            {mode === "signup" && (
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="auth-modal-input"
                                    required
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-modal-input"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-modal-input"
                                required
                                minLength={6}
                            />
                            <AuthButton
                                variant="primary"
                                isLoading={loadingProvider === "email"}
                            >
                                {mode === "login" ? "Log in" : "Sign up"}
                            </AuthButton>
                        </form>

                        {/* Toggle */}
                        <p className="auth-modal-toggle">
                            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                                className="auth-modal-toggle-btn"
                            >
                                {mode === "login" ? "Sign up" : "Log in"}
                            </button>
                        </p>

                        {/* Terms */}
                        <p className="auth-modal-terms">
                            By continuing, you agree to Tecsub&apos;s{" "}
                            <a href="/Terms" className="auth-modal-link">Terms of Service</a> and{" "}
                            <a href="/privacy%20policy" className="auth-modal-link">Privacy Policy</a>.
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
