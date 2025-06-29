import React, { useState } from 'react';
import { Link } from 'react-router-dom'

// SVG Icon Components for better reusability and cleaner code
const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(168, 85, 247, 0.2)" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const FeatureIcon = ({ children }) => (
    <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
        <div className="absolute w-16 h-16 bg-purple-500 rounded-full blur-lg opacity-30"></div>
        <div className="relative bg-slate-800 border border-slate-700 rounded-2xl w-16 h-16 flex items-center justify-center text-purple-400">
            {children}
        </div>
    </div>
);

// Main App Component
const Home = () => {
    // State for active FAQ item
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    // Feature data based on your points
    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
            title: "Seamless PDF Upload",
            description: "Just drag and drop or select a file from your device. We handle the rest, preparing your document for intelligent analysis.",
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
            title: "Ask Anything, Instantly",
            description: "Engage in a conversation with your documents. Ask complex questions, find specific information, or request clarifications.",
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>,
            title: "AI-Powered Note-Taking",
            description: "Automatically generate summaries, key takeaways, and structured notes. Transform dense PDFs into digestible insights.",
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
            title: "Export Your Insights",
            description: "Download your AI-generated notes, summaries, and chat history as a clean, organized document to use anywhere.",
        },
    ];

    // FAQ Data
    const faqData = [
        { q: "What types of PDFs can I upload?", a: "Our platform supports PDFs of all kinds, including text-based, scanned documents, and large textbooks. The AI is optimized to read and understand a wide variety of layouts." },
        { q: "Is my data secure?", a: "Absolutely. We prioritize your privacy with end-to-end encryption. Your documents are processed securely and are never shared or used for any other purpose." },
        { q: "Can I use this on mobile?", a: "Yes! Our platform is fully responsive, allowing you to upload PDFs and interact with the AI on your desktop, tablet, or smartphone." },
        { q: "What makes this different from other PDF readers?", a: "We go beyond simple reading. Our tool allows you to have a dynamic conversation with your documents, extracting and creating new knowledge with the power of AI, not just highlighting text." },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans overflow-x-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/2 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-600/30 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/2 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-pink-600/30 rounded-full blur-[150px]"></div>

            <div className="relative z-10 ">
                {/* Navbar */}
                <nav className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <i class="ri-file-add-line text-4xl text-white p-[0]"></i>
                        <span className="font-bold text-xl text-white">SnapPdf.ai</span>
                    </div>
                    <Link to={"/login"}>
                        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105 duration-300 font-semibold flex items-center gap-2">
                            Login / Sign Up
                        </button>
                    </Link>

                </nav>

                {/* Hero Section */}
                <header className="flex flex-col items-center justify-center text-center mt-20 md:mt-28 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-50">
                        Transform Your PDFs into
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                            Interactive Conversations
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-6 text-base md:text-lg max-w-2xl mx-auto">
                        Stop just reading. Start interrogating your documents. Upload a PDF to instantly summarize, ask questions, and extract key notes with the magic of AI.
                    </p>
                    <Link to={"/login"}>
                        <button className="mt-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 shadow-lg shadow-purple-500/30 duration-300 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            Upload PDF & Get Started
                        </button>
                    </Link>

                    <p className="text-xs text-slate-500 mt-3">Free to start. No credit card required.</p>
                </header>

                {/* App Preview Image/Mockup */}
                <div className="mt-20 md:mt-28 max-w-6xl mx-auto px-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-4 shadow-2xl shadow-black/30 backdrop-blur-lg">
                        <div className="aspect-video bg-slate-900 rounded-xl p-4 flex gap-4 border border-slate-700">
                            {/* Left Panel: PDF Viewer */}
                            <div className="w-1/2 bg-slate-800 rounded-lg p-3 border border-slate-600">
                                <div className="w-1/3 h-2 bg-slate-600 rounded-full mb-3"></div>
                                <div className="space-y-1.5">
                                    <div className="w-full h-2 bg-slate-700 rounded-full"></div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full"></div>
                                    <div className="w-3/4 h-2 bg-slate-700 rounded-full"></div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full mt-4"></div>
                                    <div className="w-5/6 h-2 bg-slate-700 rounded-full"></div>
                                </div>
                            </div>
                            {/* Right Panel: AI Chat */}
                            <div className="w-1/2 flex flex-col">
                                <div className="flex-grow space-y-3">
                                    <div className="w-3/4 bg-slate-700 p-2 rounded-lg">
                                        <div className="w-full h-2 bg-slate-600 rounded-full"></div>
                                    </div>
                                    <div className="w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg ml-auto">
                                        <div className="w-full h-2 bg-white/50 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-8 bg-slate-700 rounded-full border border-slate-600 flex items-center px-3">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <section className="mt-28 md:mt-40 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
                        <p className="text-slate-400 mt-3 text-lg max-w-2xl mx-auto">Unlock knowledge in four simple steps.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center backdrop-blur-sm hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300">
                                <FeatureIcon>{feature.icon}</FeatureIcon>
                                <h3 className="text-xl font-semibold text-slate-100 mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mt-28 md:mt-40 px-6 max-w-3xl mx-auto pb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqData.map((item, index) => (
                            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
                                <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center text-left p-5 font-semibold text-slate-100">
                                    <span>{item.q}</span>
                                    <span className={`transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </span>
                                </button>
                                <div className={`transition-all duration-500 ease-in-out ${activeFaq === index ? 'max-h-40' : 'max-h-0'}`}>
                                    <div className="text-slate-400 p-5 pt-0">
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-3">
                            <Logo />
                            <span className="font-semibold text-slate-400">PDF.ai</span>
                        </div>
                        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} PDF.ai Inc. All rights reserved.</p>
                        <div className="flex space-x-6 text-slate-500">
                            <a href="#" className="hover:text-purple-400 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}


export default Home