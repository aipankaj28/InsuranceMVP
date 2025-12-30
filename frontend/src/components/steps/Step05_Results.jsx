import { useState } from 'react';
import StepWrapper from './StepWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Shield, Code, ChevronDown, ChevronUp } from 'lucide-react';

export default function Step05_Results({ result }) {
    const [showPrompt, setShowPrompt] = useState(false);
    if (!result) return null;

    return (
        <StepWrapper className="text-center space-y-6">
            {result.mode === 'AI' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-2"
                >
                    <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-400">AI Powered Recommendation</span>
                    </div>
                </motion.div>
            )}

            {result.persona_name && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-brand-accent/20 border border-brand-accent/30 px-6 py-4 rounded-3xl inline-block mb-4"
                >
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-accent block mb-1">Your Protection Persona</span>
                    <h2 className="text-2xl font-black text-white italic">"{result.persona_name}"</h2>
                </motion.div>
            )}

            <div className="inline-block relative">
                <div className="text-7xl animate-bounce">{result.icon}</div>
                <Sparkles className="absolute -top-4 -right-4 text-yellow-400 w-8 h-8 animate-pulse" />
            </div>

            <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-extrabold text-white mb-2">Your Personalized Shield</h2>
                <p className="text-sm text-slate-400 leading-relaxed px-4 font-medium italic">
                    {result.tagline || result.details}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm"
                >
                    <Heart className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-xs uppercase tracking-widest text-blue-300 font-bold mb-1">Life Cover</h3>
                    <p className="text-3xl font-black text-white">{result.life_cover}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-brand-accent/10 p-6 rounded-2xl border border-brand-accent/20 backdrop-blur-sm"
                >
                    <Shield className="w-8 h-8 text-brand-accent mx-auto mb-3" />
                    <h3 className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-1">Health Cover</h3>
                    <p className="text-3xl font-black text-white">{result.health_cover}</p>
                </motion.div>
            </div>

            {result.reasoning && (
                <div className="text-left bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                        Why this coverage?
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed italic">"{result.reasoning}"</p>
                </div>
            )}

            {result.recommended_features && result.recommended_features.length > 0 && (
                <div className="text-left space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        Recommended Plan Features
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {result.recommended_features.map((feature, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-brand-accent text-sm">{feature.name}</span>
                                    <div className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Recommended</div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Debug Section (Collapsible) */}
            {result.show_debug && result.prompt_sent && (
                <div className="mt-8 border-t border-white/10 pt-8">
                    <button
                        onClick={() => setShowPrompt(!showPrompt)}
                        className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
                    >
                        <Code className="w-3 h-3 transition-transform group-hover:scale-110" />
                        {showPrompt ? 'Hide Debug Prompt' : 'Show Debug Prompt'}
                        {showPrompt ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <AnimatePresence>
                        {showPrompt && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 text-left bg-black/40 border border-white/10 p-4 rounded-xl font-mono text-[10px] max-w-full overflow-x-auto leading-relaxed text-slate-400 whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                                        <span className="text-blue-400 font-bold">RAW PROMPT SENT TO LLM</span>
                                        <span className="text-[8px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase">ReadOnly</span>
                                    </div>
                                    {result.prompt_sent}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm text-slate-500 hover:text-white transition-colors underline decoration-dotted underline-offset-4"
            >
                Start a New Calculation
            </button>
        </StepWrapper>
    );
}
