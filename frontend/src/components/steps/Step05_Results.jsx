import { useState } from 'react';
import StepWrapper from './StepWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Shield, Code, ChevronDown, ChevronUp } from 'lucide-react';

export default function Step05_Results({ result, formData }) {
    const [showPrompt, setShowPrompt] = useState(false);
    const [expandedReason, setExpandedReason] = useState(false);
    const [expandedFeatureList, setExpandedFeatureList] = useState(false);
    const [expandedFeatures, setExpandedFeatures] = useState({});

    const toggleFeature = (idx) => {
        setExpandedFeatures(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };
    if (!result) return null;

    const lifeCover = result.life_cover;
    const healthCover = result.health_cover;
    const features = result.recommended_features || result.features || [];

    console.log("DEBUG: Result Covers", {
        life_str: result.life_cover,
        life_val: result.life_cover_val,
        health_str: result.health_cover,
        health_val: result.health_cover_val
    });
    console.log("DEBUG: Form Data existing", {
        existing_life: formData?.existing_life_cover_val,
        existing_health: formData?.existing_health_cover_val
    });

    // Ideal Calculations (derived from result)
    const idealLifeVal = result.life_cover_val || 0;
    const idealHealthVal = result.health_cover_val || 0;

    const formatINR = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(0)} Lakh`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    return (
        <StepWrapper className="text-center space-y-4 md:space-y-6">
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
                    <h2 className="text-2xl font-black text-white italic">"{result.persona_name}"</h2>
                </motion.div>
            )}

            <div className="inline-block relative">
                <div className="text-5xl md:text-7xl animate-bounce">{result.icon || "🛡️"}</div>
                <Sparkles className="absolute -top-4 -right-4 text-yellow-400 w-6 h-6 md:w-8 md:h-8 animate-pulse" />
            </div>

            <div className="max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Your Personalized Shield</h2>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed px-4 font-medium italic">
                    {result.tagline || result.details || "We've crafted the perfect plan for your needs."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-blue-500/10 p-4 md:p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm relative overflow-hidden"
                >
                    <Heart className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-2 md:mb-3" />
                    <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-blue-300 font-bold mb-1">Life Cover</h3>
                    <p className="text-2xl md:text-3xl font-black text-white">{lifeCover || "Calculated below"}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-brand-accent/10 p-4 md:p-6 rounded-2xl border border-brand-accent/20 backdrop-blur-sm relative overflow-hidden"
                >
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-brand-accent mx-auto mb-2 md:mb-3" />
                    <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-emerald-300 font-bold mb-1">Health Cover</h3>
                    <p className="text-2xl md:text-3xl font-black text-white">{healthCover || "Calculated below"}</p>
                </motion.div>
            </div>

            {result.reasoning && (
                <div
                    className="text-left bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 transition-all group"
                    onClick={() => setExpandedReason(!expandedReason)}
                >
                    <div className="p-5 md:p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                                Why this coverage?
                            </h3>
                            {expandedReason ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </div>
                        <p className="text-sm text-white font-medium leading-relaxed italic">"{result.summary || result.tagline}"</p>

                        <AnimatePresence>
                            {(expandedReason || !result.summary) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-xs text-slate-400 leading-relaxed italic border-t border-white/5 pt-3 mt-1">
                                        {result.reasoning}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {features.length > 0 && (
                <div className="text-left space-y-4">
                    <div
                        className="flex items-center justify-between cursor-pointer group"
                        onClick={() => setExpandedFeatureList(!expandedFeatureList)}
                    >
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Recommended Plan Features
                        </h3>
                        {expandedFeatureList ? <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" /> : <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />}
                    </div>

                    <AnimatePresence>
                        {expandedFeatureList && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="grid grid-cols-1 gap-3 overflow-hidden"
                            >
                                {features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                                        onClick={() => toggleFeature(idx)}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-brand-accent text-sm">{feature.name}</span>
                                                    <div className="text-[8px] md:text-[9px] bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Recommended</div>
                                                </div>
                                                {expandedFeatures[idx] ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                                            </div>

                                            <AnimatePresence>
                                                {expandedFeatures[idx] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5 mt-2 group-hover:text-slate-300 transition-colors">
                                                            {feature.reason}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
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

        </StepWrapper>
    );
}
