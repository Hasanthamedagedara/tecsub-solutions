"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
    postSequenceSections,
    videos,
    downloads,
    socialLinks,
} from "@/data/product";
import SocialIcon from "@/components/SocialIcon";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useAdminContent, adminToVideos, adminToDownloads } from "@/hooks/useAdminContent";

/* ─── Section Wrapper ─── */
function Section({
    id,
    children,
    className = "",
}: {
    id?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.section
            id={id}
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
        >
            {children}
        </motion.section>
    );
}

/* ─── Section Heading ─── */
function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-12 sm:mb-16">
            <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                {title}
            </h2>
            <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                {subtitle}
            </p>
        </div>
    );
}

/* ─── Feature Card ─── */
function FeatureCard({
    feature,
    index,
}: {
    feature: { title: string; description: string; icon: string };
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group glass-panel p-6 sm:p-8 card-hover cursor-default relative"
        >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="font-bebas text-xl sm:text-2xl tracking-wide mb-2" style={{ color: "var(--text-primary)" }}>
                {feature.title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {feature.description}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tecsubCyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}

/* ─── Video Card ─── */
function VideoCard({ videoId, title, index }: { videoId: string; title: string; index: number }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            className="group"
        >
            <div className="video-container rounded-xl overflow-hidden border border-white/[0.06] group-hover:border-tecsubCyan/20 transition-colors duration-300">
                {isPlaying ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 cursor-pointer group"
                    >
                        <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-tecsubCyan/90 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.5)] group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <p className="mt-3 text-sm font-medium truncate" style={{ color: "var(--text-secondary)" }}>{title}</p>
        </motion.div>
    );
}

/* ─── Main Component ─── */
export default function ContentSections() {
    const { language } = useAppContext();
    const [showAllVideos, setShowAllVideos] = useState(false);
    const adminVideos = useAdminContent("videos");
    const adminSoftware = useAdminContent("software");
    const allVideos = [...videos, ...adminToVideos(adminVideos)];
    const allDownloads = [...downloads, ...adminToDownloads(adminSoftware)];
    const displayedVideos = showAllVideos ? allVideos : allVideos.slice(0, 8);

    return (
        <div className="relative z-10">
            {/* ─── AI Lab ─── */}
            <Section id="ai-lab">
                <SectionHeading
                    title={t(language, "section_ai_lab")}
                    subtitle={t(language, "section_ai_lab_sub")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {postSequenceSections.aiLab.features.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>
            </Section>

            <div className="section-divider mx-4" />

            {/* ─── App Forge ─── */}
            <Section id="app-forge">
                <SectionHeading
                    title={t(language, "section_app_forge")}
                    subtitle={t(language, "section_app_forge_sub")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {postSequenceSections.appForge.features.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>
            </Section>

            <div className="section-divider mx-4" />

            {/* ─── Software Downloads ─── */}
            <Section id="software">
                <SectionHeading
                    title={t(language, "section_software")}
                    subtitle={t(language, "section_software_sub")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allDownloads.map((sw, i) => (
                        <motion.div
                            key={sw.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="glass-panel p-6 card-hover group flex flex-col relative"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tecsubCyan/20 to-tecsubBlue/20 flex items-center justify-center flex-shrink-0 text-2xl">
                                    {sw.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-tecsubCyan/10 text-tecsubCyan">
                                        {sw.category}
                                    </span>
                                    <h3 className="font-bebas text-xl tracking-wide mt-1" style={{ color: "var(--text-primary)" }}>
                                        {sw.name}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-secondary)" }}>
                                {sw.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                                    <span>v{sw.version}</span>
                                    <span>•</span>
                                    <span>{sw.size}</span>
                                </div>
                                <a
                                    href={sw.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-tecsubCyan text-tecsubNavy font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 text-xs tracking-wide uppercase"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    {t(language, "download_now")}
                                </a>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-px rounded-b-xl bg-gradient-to-r from-transparent via-tecsubCyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </div>
            </Section>

            <div className="section-divider mx-4" />

            {/* ─── Videos ─── */}
            <Section id="videos">
                <SectionHeading
                    title={t(language, "section_videos")}
                    subtitle={t(language, "section_videos_sub")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedVideos.map((video, i) => (
                        <VideoCard key={video.id} videoId={video.id} title={video.title} index={i} />
                    ))}
                </div>
                {allVideos.length > 8 && (
                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setShowAllVideos(!showAllVideos)}
                            className="px-8 py-3 rounded-full border-2 border-tecsubCyan/30 font-semibold hover:bg-tecsubCyan hover:text-tecsubNavy transition-all duration-300 tracking-wide uppercase text-sm"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {showAllVideos ? t(language, "show_less") : `${t(language, "show_all")} ${allVideos.length} Videos`}
                        </button>
                    </div>
                )}
            </Section>

            <div className="section-divider mx-4" />

            {/* ─── Social Media ─── */}
            <Section id="social">
                <SectionHeading
                    title={t(language, "section_social")}
                    subtitle={t(language, "section_social_sub")}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {socialLinks.map((link, i) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className="flex flex-col items-center gap-3 p-4 glass-panel group social-icon-glow"
                        >
                            <span className="group-hover:text-tecsubCyan transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
                                <SocialIcon name={link.name} className="w-6 h-6" />
                            </span>
                            <span className="text-xs font-medium text-center" style={{ color: "var(--text-secondary)" }}>
                                {link.name}
                            </span>
                        </motion.a>
                    ))}
                </div>
            </Section>
        </div>
    );
}
