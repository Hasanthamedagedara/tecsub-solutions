"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const categories = [
    { id: "writing", label: "✍️ Writing", prompts: [
        { title: "Blog Post Writer", desc: "SEO-optimized blog posts", template: "Write a comprehensive, SEO-optimized blog post about [TOPIC]. Include a compelling headline, meta description, proper H2/H3 structure, and a call-to-action. Target keyword: [KEYWORD]. Word count: 1500+." },
        { title: "Essay Writer", desc: "Academic essays", template: "Write a well-structured academic essay about [TOPIC]. Include an introduction with thesis statement, 3 body paragraphs with evidence and analysis, and a conclusion. Use formal academic tone. Word count: 1000+." },
        { title: "Story Creator", desc: "Creative short stories", template: "Write a creative short story about [THEME/TOPIC]. Include vivid descriptions, compelling characters, dialogue, and a satisfying ending. Genre: [GENRE]. Word count: 800+." },
        { title: "Email Composer", desc: "Professional emails", template: "Write a professional email for [PURPOSE]. Context: [CONTEXT]. Tone: [formal/friendly]. Include a clear subject line, proper greeting, concise body, and professional closing." },
    ]},
    { id: "coding", label: "💻 Coding", prompts: [
        { title: "Code Review", desc: "Detailed code reviews", template: "Review the following code for bugs, performance, security, and best practices. Provide line-by-line feedback with improvements.\n\nCode:\n[PASTE CODE]" },
        { title: "Debug Assistant", desc: "Find and fix bugs", template: "I have a bug in my [LANGUAGE] code. Error: [ERROR MESSAGE]. Here's the relevant code:\n[CODE]\nExplain the issue and provide the fix." },
        { title: "API Design", desc: "RESTful API design", template: "Design a RESTful API for [PROJECT]. Include endpoints, HTTP methods, request/response formats, authentication, and error handling. Follow REST best practices." },
        { title: "Test Writer", desc: "Unit test generation", template: "Write comprehensive unit tests for the following [LANGUAGE] code using [TESTING FRAMEWORK]. Include edge cases and error scenarios.\n\nCode:\n[PASTE CODE]" },
    ]},
    { id: "marketing", label: "📈 Marketing", prompts: [
        { title: "Ad Copy Generator", desc: "Compelling ad copies", template: "Create 5 variations of ad copy for [PRODUCT/SERVICE]. Target audience: [AUDIENCE]. Platform: [PLATFORM]. Include headline, description, and CTA for each." },
        { title: "Social Media Posts", desc: "Engaging social content", template: "Create a week's worth of social media posts for [BRAND/TOPIC]. Platform: [PLATFORM]. Include hashtags, emojis, and engagement hooks. Mix educational, entertaining, and promotional content." },
        { title: "Product Description", desc: "Selling product descriptions", template: "Write a compelling product description for [PRODUCT]. Highlight key features, benefits, and unique selling points. Include specifications and a persuasive CTA. Target audience: [AUDIENCE]." },
        { title: "SEO Meta Tags", desc: "SEO optimization", template: "Generate SEO meta tags for [WEBPAGE]. Include: title tag (60 chars), meta description (155 chars), Open Graph tags, Twitter card tags, and 10 relevant keywords." },
    ]},
    { id: "research", label: "🔬 Research", prompts: [
        { title: "Literature Review", desc: "Research paper reviews", template: "Write a literature review section about [TOPIC] for a research paper. Synthesize findings from multiple perspectives, identify gaps, and suggest future research directions." },
        { title: "Data Analysis", desc: "Analyze research data", template: "Analyze the following data/findings about [TOPIC]:\n[DATA]\nProvide statistical insights, identify patterns, compare with existing literature, and draw meaningful conclusions." },
        { title: "Research Proposal", desc: "Academic proposals", template: "Write a research proposal for [TOPIC]. Include: introduction, problem statement, research questions, methodology, expected outcomes, timeline, and references format." },
        { title: "Abstract Writer", desc: "Paper abstracts", template: "Write a 250-word abstract for a research paper about [TOPIC]. Include: background, objective, methodology, key findings, and conclusion. Follow [APA/IEEE/MLA] format." },
    ]},
];

export default function AIPromptGeneratorPage() {
    const [activeCategory, setActiveCategory] = useState("writing");
    const [selectedPrompt, setSelectedPrompt] = useState<{title:string;desc:string;template:string}|null>(null);
    const [customized, setCustomized] = useState("");
    const [copied, setCopied] = useState(false);

    const currentCategory = categories.find(c => c.id === activeCategory);

    const handleSelect = (prompt: {title:string;desc:string;template:string}) => {
        setSelectedPrompt(prompt);
        setCustomized(prompt.template);
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(customized);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{background:"var(--bg-primary)"}}>
            <Navbar/><Sidebar/>
            <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{marginLeft:"var(--sidebar-w, 68px)"}}>
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:"rgba(234,179,8,0.15)",border:"1px solid rgba(234,179,8,0.2)"}}>⚡</div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{color:"var(--text-primary)"}}>AI Prompt Generator</h1>
                                <p className="text-sm" style={{color:"var(--text-secondary)"}}>Generate optimized prompts for any AI model</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{background:"rgba(234,179,8,0.15)",color:"#eab308",border:"1px solid rgba(234,179,8,0.2)"}}>AI Tool</span>
                        </div>
                    </motion.div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {categories.map(c => (
                            <button key={c.id} onClick={() => {setActiveCategory(c.id);setSelectedPrompt(null)}} className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all" style={{background:activeCategory===c.id?"rgba(234,179,8,0.12)":"rgba(255,255,255,0.03)",border:`1px solid ${activeCategory===c.id?"rgba(234,179,8,0.3)":"rgba(255,255,255,0.06)"}`,color:activeCategory===c.id?"#eab308":"var(--text-secondary)"}}>
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Prompt Cards */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest" style={{color:"var(--text-secondary)"}}>Select a Prompt Template</label>
                            {currentCategory?.prompts.map(p => (
                                <button key={p.title} onClick={() => handleSelect(p)} className="w-full p-4 rounded-xl text-left transition-all" style={{background:selectedPrompt?.title===p.title?"rgba(234,179,8,0.08)":"rgba(255,255,255,0.02)",border:`1px solid ${selectedPrompt?.title===p.title?"rgba(234,179,8,0.2)":"rgba(255,255,255,0.06)"}`,color:"var(--text-primary)"}}>
                                    <div className="text-sm font-bold">{p.title}</div>
                                    <div className="text-[11px] mt-1" style={{color:"var(--text-secondary)"}}>{p.desc}</div>
                                </button>
                            ))}
                        </div>

                        {/* Editor */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold uppercase tracking-widest" style={{color:"#eab308"}}>Customize & Copy</label>
                                {selectedPrompt && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"rgba(234,179,8,0.1)",color:"#eab308"}}>Replace [PLACEHOLDERS]</span>}
                            </div>
                            <textarea value={customized} onChange={e=>setCustomized(e.target.value)} placeholder="Select a template from the left, then customize it here..." rows={14} className="w-full p-4 rounded-xl text-sm resize-none outline-none font-mono" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--text-primary)",lineHeight:"1.8"}}/>
                            <div className="flex gap-2 mt-3">
                                <button onClick={handleCopy} disabled={!customized} className="flex-1 py-3 rounded-xl text-sm font-bold transition-all" style={{background:customized?"linear-gradient(135deg,#eab308,#f59e0b)":"rgba(255,255,255,0.05)",color:customized?"#000":"#666"}}>
                                    {copied?"✅ Copied!":"📋 Copy Prompt"}
                                </button>
                                <button onClick={()=>{setCustomized("");setSelectedPrompt(null)}} className="px-6 py-3 rounded-xl text-sm font-bold" style={{background:"rgba(255,255,255,0.05)",color:"var(--text-secondary)",border:"1px solid rgba(255,255,255,0.08)"}}>✕ Clear</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[{icon:"🚀",title:"Ready-to-Use",desc:"Copy and paste directly into ChatGPT, Claude, or Gemini"},{icon:"🎓",title:"For Students",desc:"Research, essays, and academic writing prompts"},{icon:"⚡",title:"40+ Templates",desc:"Writing, coding, marketing, and research prompts"}].map(f=>(
                            <div key={f.title} className="p-4 rounded-xl text-center" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                                <div className="text-2xl mb-2">{f.icon}</div>
                                <div className="text-xs font-bold mb-1" style={{color:"var(--text-primary)"}}>{f.title}</div>
                                <div className="text-[10px]" style={{color:"var(--text-secondary)"}}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
