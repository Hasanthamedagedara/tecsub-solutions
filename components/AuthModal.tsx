"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import { auth } from "@/lib/firebase";
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "firebase/auth";

export default function AuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const router = useRouter();

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
        setError(null);
    };

    const handleSocial = async (providerName: string) => {
        setLoadingProvider(providerName);
        setError(null);
        
        try {
            if (providerName === "google") {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                close();
                router.push("/");
            } else {
                // Mock for other providers for now
                setTimeout(() => {
                    setLoadingProvider(null);
                    close();
                }, 1000);
            }
        } catch (err: any) {
            console.error(`${providerName} login error:`, err);
            setLoadingProvider(null);
            
            let errorMessage = "An unknown error occurred.";
            if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = "Login popup was closed before completion.";
            } else if (err.code === 'auth/unauthorized-domain') {
                errorMessage = "This domain is not authorized. Please add it in Firebase Console.";
            } else {
                errorMessage = err.message || "Failed to login. Please try again.";
            }
            setError(errorMessage);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProvider("email");
        setError(null);

        try {
            if (mode === "login") {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: name || email.split('@')[0],
                });
            }
            close();
        } catch (err: any) {
            console.error("Auth error:", err);
            if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoadingProvider(null);
        }
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
                        initial={{ x: "-50%", y: "-45%", opacity: 0 }}
                        animate={{ x: "-50%", y: "-50%", opacity: 1 }}
                        exit={{ x: "-50%", y: "-45%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="auth-modal"
                    >
                        {/* Top Actions */}
                        <div className="auth-modal-top-actions">
                            <button onClick={close} className="auth-modal-skip-btn">
                                Skip
                            </button>
                            <button onClick={close} className="auth-modal-close" aria-label="Close">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </div>

                        {/* Header */}
                        <div className="auth-modal-header">
                            <div className="auth-modal-logo">
                                <img src="/logo/tecsub.jpg" alt="TecSub Logo" className="w-full h-full object-cover" />
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

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm mb-4 text-center">
                                {error}
                            </div>
                        )}

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
