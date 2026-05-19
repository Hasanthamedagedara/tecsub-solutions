"use client";

import { motion } from "framer-motion";
import { socialLinks } from "@/data/product";
import SocialIcon from "@/components/SocialIcon";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EmailLink from "@/components/EmailLink";

const footerLinks = {
    products: [
        { label: "TECSUB Tools", href: "/tools" },
        { label: "TECSUB POS", href: "/pos" },
        { label: "TECSUB Singlish", href: "/translator" },
        { label: "TECSUB Audio", href: "/apps" },
        { label: "TECSUB Video", href: "/apps" },
        { label: "TECSUB Apps", href: "/apps" },
    ],
    resources: [
        { label: "Blog", href: "/news" },
        { label: "Events", href: "/community" },
        { label: "Docs", href: "/about" },
        { label: "Academy", href: "/courses" },
        { label: "TECSUB Books", href: "/books" },
        { label: "Certificates", href: "/courses" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Services", href: "/apps" },
        { label: "Consultation", href: "/about" },
        { label: "Portfolio", href: "/explore" },
        { label: "Contact", href: "/about" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy policy" },
        { label: "Terms of Service", href: "/Terms" },
        { label: "Cookie Policy", href: "/privacy policy" },
        { label: "Pricing", href: "/shop" },
    ],
};

export default function Footer() {
    const { language } = useAppContext();
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            console.log("Subscribe:", email);
            setEmail("");
        }
    };

    return (
        <footer className="kdj-footer">
            {/* ═══ Newsletter Bar ═══ */}
            <div className="kdj-footer-newsletter">
                <div className="kdj-footer-newsletter-inner">
                    <div className="kdj-footer-newsletter-text">
                        <h3 className="kdj-footer-newsletter-title">Stay in the loop</h3>
                        <p className="kdj-footer-newsletter-desc">Get updates on new tools, features & events.</p>
                    </div>
                    <form className="kdj-footer-newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="kdj-footer-newsletter-input"
                            required
                        />
                        <button type="submit" className="kdj-footer-newsletter-btn">
                            Subscribe →
                        </button>
                    </form>
                </div>
            </div>

            {/* ═══ Main Footer Grid ═══ */}
            <div className="kdj-footer-main">
                <div className="kdj-footer-grid">
                    {/* Brand Column */}
                    <div className="kdj-footer-brand">
                        <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }} className="kdj-footer-logo">
                            <div className="kdj-footer-logo-img">
                                <img src="/logo/tecsub.jpg" alt="TecSub" />
                            </div>
                        </a>
                        <p className="kdj-footer-brand-desc">
                            Empowering Sri Lanka with smart digital tools, education & services.
                        </p>
                        <div className="kdj-footer-brand-meta">
                            <span>📍 Made with ❤️ in Sri Lanka</span>
                        </div>
                        <div className="kdj-footer-brand-contact">
                            <span className="kdj-footer-contact-item text-xs opacity-75 select-all">
                                📍 Colombo 01, Sri Lanka
                            </span>
                            <a href="tel:+94726128749" className="kdj-footer-contact-item">
                                📞 +94 72 612 8749
                            </a>
                            <EmailLink email="tecsubsolutions@gmail.com" className="kdj-footer-contact-item">
                                ✉️ tecsubsolutions@gmail.com
                            </EmailLink>
                        </div>

                        {/* Social Icons */}
                        <div className="kdj-footer-socials">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="kdj-footer-social-icon"
                                    title={link.name}
                                >
                                    <SocialIcon name={link.name} className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products Column */}
                    <div className="kdj-footer-col">
                        <h4 className="kdj-footer-col-title">PRODUCTS</h4>
                        <ul className="kdj-footer-col-links">
                            {footerLinks.products.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} onClick={(e) => { e.preventDefault(); router.push(link.href); }}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="kdj-footer-col">
                        <h4 className="kdj-footer-col-title">RESOURCES</h4>
                        <ul className="kdj-footer-col-links">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} onClick={(e) => { e.preventDefault(); router.push(link.href); }}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className="kdj-footer-col">
                        <h4 className="kdj-footer-col-title">COMPANY</h4>
                        <ul className="kdj-footer-col-links">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} onClick={(e) => { e.preventDefault(); router.push(link.href); }}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="kdj-footer-col">
                        <h4 className="kdj-footer-col-title">LEGAL</h4>
                        <ul className="kdj-footer-col-links">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} onClick={(e) => { e.preventDefault(); router.push(link.href); }}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ═══ Bottom Bar ═══ */}
            <div className="kdj-footer-bottom">
                <p>© {new Date().getFullYear()} Tecsub Solutions. All rights reserved.</p>
                <p className="kdj-footer-bottom-sub">Designed & built in Sri Lanka 🇱🇰</p>
            </div>
        </footer>
    );
}
