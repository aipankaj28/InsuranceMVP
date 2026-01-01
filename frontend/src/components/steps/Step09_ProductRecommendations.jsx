import { useState, useEffect } from 'react';
import StepWrapper from './StepWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ShieldCheck, HeartPulse, Info, Loader2, Code, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = rawBaseUrl.startsWith('http') ? rawBaseUrl : `https://${rawBaseUrl}`;

export default function Step09_ProductRecommendations({ formData, gapResult, onComplete }) {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const fetchProductRecs = async () => {
            try {
                const token = localStorage.getItem('auth_token');

                // Calculate age from DOB
                let calculatedAge = 30;
                if (formData.dob) {
                    const birthDate = new Date(formData.dob);
                    const today = new Date();
                    calculatedAge = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        calculatedAge--;
                    }
                }

                console.log("DEBUG: Fetching products for gapResult:", gapResult);
                const response = await fetch(`${API_BASE_URL}/api/policy-recommendations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        recommended_life_cover: gapResult.life_cover,
                        recommended_life_cover_val: gapResult.life_cover_val,
                        recommended_health_cover: gapResult.health_cover,
                        recommended_health_cover_val: gapResult.health_cover_val,
                        recommended_features: (gapResult.recommended_features || []).map(f => f.name),
                        has_life_insurance: formData.has_life_insurance,
                        existing_life_cover_val: formData.existing_life_cover_val,
                        life_provider: formData.life_provider === "Other" ? formData.life_provider_custom : formData.life_provider,
                        life_policy_name: formData.life_policy_name === "Other" ? formData.life_policy_name_custom : formData.life_policy_name,
                        has_health_insurance: formData.has_health_insurance,
                        existing_health_cover_val: formData.existing_health_cover_val,
                        health_provider: formData.health_provider === "Other" ? formData.health_provider_custom : formData.health_provider,
                        health_policy_name: formData.health_policy_name === "Other" ? formData.health_policy_name_custom : formData.health_policy_name,
                        health_source: formData.health_source,
                        first_name: formData.first_name,
                        age: calculatedAge,
                        income_level: formData.income_level,
                        city: formData.city
                    })
                });

                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                console.log("DEBUG: Received recommendations:", data);
                setRecommendations(data);
            } catch (err) {
                console.error(err);
                setError("Unable to fetch specific plans. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (gapResult) fetchProductRecs();
    }, [formData, gapResult]);

    if (loading) {
        return (
            <StepWrapper className="text-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-brand-accent animate-spin" />
                    <h2 className="text-xl font-bold text-white">I'm scanning the market for you...</h2>
                    <p className="text-sm text-slate-400 italic">Matching your needs with thousands of Indian insurance plans.</p>
                </div>
            </StepWrapper>
        );
    }

    if (error || !recommendations) {
        return (
            <StepWrapper className="text-center py-20">
                <p className="text-red-400">{error || "Something went wrong."}</p>
            </StepWrapper>
        );
    }

    const { life_recommendation, health_recommendation, overall_narrative } = recommendations;

    return (
        <StepWrapper className="space-y-6 md:space-y-8">
            <div className="text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 backdrop-blur-md mb-2 md:mb-4">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">AI Product Matching Engine</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 italic">"My Final Handpicked Selection"</h2>
                <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                    {overall_narrative}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Life Insurance Recommendation */}
                {life_recommendation ? (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -z-10" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                <HeartPulse className="w-6 h-6 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg">Top Life Choice</h3>
                                <p className="text-[10px] text-pink-400 uppercase font-black tracking-widest">Bridging your coverage gap</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-[10px] font-black uppercase text-pink-400 tracking-widest mb-1">Recommended Policy</div>
                            <h4 className="text-white font-black text-xl mb-1">{life_recommendation.product_name}</h4>
                            <p className="text-slate-400 font-bold text-sm mb-4">By {life_recommendation.provider}</p>

                            <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 mb-4">
                                <div className="text-[10px] font-black uppercase text-pink-500 tracking-widest mb-1">Recommended Sum Assured</div>
                                <div className="text-2xl font-black text-white">{life_recommendation.recommended_cover}</div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Gap Filled</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                    {life_recommendation.gap_filled}
                                </p>
                            </div>

                            <div className="space-y-2">
                                {(life_recommendation.key_benefits || []).map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                                        <span className="text-xs text-slate-400 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Why I chose this</span>
                            </div>
                            <p className="text-xs text-slate-400 italic leading-relaxed">"{life_recommendation.why_this}"</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60"
                    >
                        <ShieldCheck className="w-12 h-12 text-slate-500 mb-4" />
                        <h3 className="text-white font-bold mb-2">Life Cover is Solid</h3>
                        <p className="text-xs text-slate-400 max-w-[200px]">Your existing Life Insurance of {formData.existing_life_cover} meets your current needs. No new policy required.</p>
                    </motion.div>
                )}

                {/* Health Insurance Recommendation */}
                {health_recommendation ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg">Top Health Match</h3>
                                <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Optimizing your medical safety net</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Recommended Policy</div>
                            <h4 className="text-white font-black text-xl mb-1">{health_recommendation.product_name}</h4>
                            <p className="text-slate-400 font-bold text-sm mb-4">By {health_recommendation.provider}</p>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-4">
                                <div className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">Recommended Sum Insured</div>
                                <div className="text-2xl font-black text-white">{health_recommendation.recommended_cover}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-brand-accent/5 rounded-2xl p-4 border border-brand-accent/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                                    <span className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Gap & Feature Analysis</span>
                                </div>
                                <p className="text-xs text-brand-accent/80 font-medium leading-relaxed mb-3">
                                    {health_recommendation.gap_filled}
                                </p>
                                <p className="text-[11px] text-slate-400 italic">
                                    {health_recommendation.feature_match_analysis}
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Strategic Reasoning</span>
                                </div>
                                <p className="text-xs text-slate-400 italic leading-relaxed">"{health_recommendation.why_this}"</p>
                            </div>

                            <div className="space-y-2 mt-4">
                                {(health_recommendation.key_benefits || []).map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                                        <span className="text-xs text-slate-400 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60"
                    >
                        <CheckCircle2 className="w-12 h-12 text-slate-500 mb-4" />
                        <h3 className="text-white font-bold mb-2">Health Cover is Robust</h3>
                        <p className="text-xs text-slate-400 max-w-[200px]">Your existing Health Insurance with {formData.health_provider} covers both amount and essential features. You are well projected.</p>
                    </motion.div>
                )}
            </div>

            <div className="flex flex-col items-center gap-6 pt-8">
                <button
                    onClick={onComplete}
                    className="group relative bg-white text-brand-dark px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2 md:gap-3">
                        Finish & Secure My Future
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure. Personalized. Digital.</p>
            </div>

            {/* Debug Section (Collapsible) */}
            {
                recommendations.show_debug && recommendations.prompt_sent && (
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
                                        {recommendations.prompt_sent}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            }
        </StepWrapper >
    );
}
