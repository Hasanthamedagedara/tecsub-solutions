"use client";

import { useState, useEffect } from "react";

interface EmailLinkProps {
  email: string;
  className?: string;
  children?: React.ReactNode;
}

export default function EmailLink({ email, className = "", children }: EmailLinkProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Obfuscated representation shown in raw static HTML for bots
    const obfuscatedText = email.replace("@", " [at] ").replace(/\./g, " [dot] ");
    return (
      <span className={`${className} select-none opacity-80 cursor-default`} title="Please enable JavaScript to view email">
        {children ? "[Obfuscated Email]" : obfuscatedText}
      </span>
    );
  }

  // Fully normal, clickable link rendered dynamically on the client side for actual human users
  return (
    <a href={`mailto:${email}`} className={className}>
      {children || email}
    </a>
  );
}
