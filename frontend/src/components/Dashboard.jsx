import { Shield, Heart, User, RefreshCw, MapPin, Users, Sparkles, HeartPulse, CheckCircle2, Info, ChevronUp, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Dashboard({ userProfile, latestRecommendation, history, onUpdatePlan, onCompleteExistingDetails }) {
    const isPhase2Incomplete = userProfile.current_step < 9;
    const [view, setView] = useState((latestRecommendation?.life_recommendations?.length || latestRecommendation?.health_recommendations?.length) ? 'products' : 'gaps');
    const [expandedLife, setExpandedLife] = useState({});
    const [expandedHealth, setExpandedHealth] = useState({});
    const [expandedReasoning, setExpandedReasoning] = useState(false);

    if (!latestRecommendation) return null;

    const { life_cover, health_cover, details, icon, reasoning, life_recommendations = [], health_recommendations = [] } = latestRecommendation;
    const { first_name, city, dependents, num_children } = userProfile;

    const toggleLife = (idx) => setExpandedLife(prev => ({ ...prev, [idx]: !prev[idx] }));
    const toggleHealth = (idx) => setExpandedHealth(prev => ({ ...prev, [idx]: !prev[idx] }));

    // Filter active dependents
    const activeDependents = Object.entries(dependents || {})
        .filter(([_, isActive]) => isActive)
        .map(([name]) => name === 'Children' ? `${num_children} Children` : name);

    // Gap Analysis Helpers
    const parseToLakhs = (str) => {
        if (!str || str === "None" || str === "") return 0;
        const cleanStr = str.replace(/[₹,]/g, '').trim();
        const parts = cleanStr.split(' ');
        const num = parseFloat(parts[0]);
        if (str.toLowerCase().includes('crore')) return num * 100;
        return num;
    };

    const idealLife = parseToLakhs(life_cover);
    const existingLife = parseToLakhs(userProfile.existing_life_cover);
    const lifeGap = Math.max(0, idealLife - existingLife);

    const idealHealth = parseToLakhs(health_cover);
    const existingHealth = parseToLakhs(userProfile.existing_health_cover);
    const healthGap = Math.max(0, idealHealth - existingHealth);

    const formatLakhs = (lakhs) => {
        if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(1)} Crore`;
        return `₹${Math.round(lakhs)} Lakhs`;
    };

    const hasProducts = life_recommendations.length > 0 || health_recommendations.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
        >
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    {/* Left Actions (Desktop) */}
                    <div className="hidden md:flex justify-start">
                        {hasProducts && (
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                <button
                                    onClick={() => setView('gaps')}
                                    className={`p-2 rounded-lg transition-all ${view === 'gaps' ? 'bg-brand-accent text-brand-dark shadow-sm' : 'text-slate-500 hover:text-white'}`}
                                    title="Gap Analysis View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setView('products')}
                                    className={`p-2 rounded-lg transition-all ${view === 'products' ? 'bg-brand-accent text-brand-dark shadow-sm' : 'text-slate-500 hover:text-white'}`}
                                    title="Product Selection View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Center Title & Subtitle */}
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 italic">Protection Dashboard</h2>
                        <p className="text-sm md:text-base text-slate-400">
                            {view === 'gaps' ? (
                                <>Comparing your <span className="text-brand-accent">Ideal Shield</span> with your <span className="text-white">Existing Net</span>.</>
                            ) : (
                                <>Your <span className="text-brand-accent">AI-Matched</span> Policy Portfolio</>
                            )}
                        </p>
                    </div>

                    {/* Right Spacer (Desktop) - Maintains center alignment */}
                    <div className="hidden md:block"></div>
                </div>

                {/* Mobile View Toggle */}
                {hasProducts && (
                    <div className="flex md:hidden justify-center mt-4">
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setView('gaps')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'gaps' ? 'bg-brand-accent text-brand-dark' : 'text-slate-500'}`}
                            >
                                Gaps
                            </button>
                            <button
                                onClick={() => setView('products')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'products' ? 'bg-brand-accent text-brand-dark' : 'text-slate-500'}`}
                            >
                                Products
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {view === 'gaps' ? (
                    <motion.div
                        key="gaps-view"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        {/* Gap Analysis Dashboard */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Life Insurance Gap */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-pink-500" /> Life Insurance Gap
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Additional protection Suggested</p>
                                    </div>
                                    {!isPhase2Incomplete && (
                                        <div className="text-right">
                                            <span className={`text-2xl font-black ${lifeGap > 0 ? 'text-pink-500' : 'text-emerald-500'}`}>
                                                {lifeGap > 0 ? `+${formatLakhs(lifeGap)}` : 'Fully Protected'}
                                            </span>
                                            <div className="text-[10px] font-bold text-slate-600 uppercase">Gap Amount</div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                                        <div
                                            className="h-full bg-pink-500/20 border-r border-pink-500/50 transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (existingLife / Math.max(1, idealLife)) * 100)}%` }}
                                        />
                                        {lifeGap > 0 && (
                                            <div
                                                className="h-full bg-pink-500 animate-pulse transition-all duration-1000"
                                                style={{ width: `${Math.min(100, (lifeGap / idealLife) * 100)}%` }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Current: {userProfile.existing_life_cover || "None"}</span>
                                        <span className="text-white">AI Ideal: {life_cover}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Health Insurance Gap */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-blue-500" /> Health Insurance Gap
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Suggested Medical Buffer</p>
                                    </div>
                                    {!isPhase2Incomplete && (
                                        <div className="text-right">
                                            <span className={`text-2xl font-black ${healthGap > 0 ? 'text-blue-500' : 'text-emerald-500'}`}>
                                                {healthGap > 0 ? `+${formatLakhs(healthGap)}` : 'Fully Protected'}
                                            </span>
                                            <div className="text-[10px] font-bold text-slate-600 uppercase">Gap Amount</div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                                        <div
                                            className="h-full bg-blue-500/20 border-r border-blue-500/50 transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (existingHealth / Math.max(1, idealHealth)) * 100)}%` }}
                                        />
                                        {healthGap > 0 && (
                                            <div
                                                className="h-full bg-blue-500 animate-pulse transition-all duration-1000"
                                                style={{ width: `${Math.min(100, (healthGap / idealHealth) * 100)}%` }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Current: {userProfile.existing_health_cover || "None"}</span>
                                        <span className="text-white">AI Ideal: {health_cover}</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* AI Strategic Reasoning */}
                        <div
                            className="p-6 md:p-8 bg-brand-accent/10 border border-brand-accent/20 rounded-3xl relative overflow-hidden group cursor-pointer transition-all hover:bg-brand-accent/15"
                            onClick={() => setExpandedReasoning(!expandedReasoning)}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-12 h-12 text-brand-accent" />
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">{icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-white font-bold">Our AI's Strategic Reasoning</h4>
                                        {expandedReasoning ? <ChevronUp className="w-5 h-5 text-brand-accent" /> : <ChevronDown className="w-5 h-5 text-brand-accent" />}
                                    </div>

                                    <AnimatePresence>
                                        {expandedReasoning && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-slate-200 leading-relaxed italic text-sm font-medium mb-2 mt-2">"{latestRecommendation.summary || reasoning || details}"</p>
                                                {(latestRecommendation.summary && reasoning) && (
                                                    <p className="text-slate-400 leading-relaxed text-xs opacity-80 border-t border-white/10 pt-2">
                                                        {reasoning}
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {!expandedReasoning && (
                                        <p className="text-slate-400 text-xs italic truncate max-w-md opacity-70">
                                            "{latestRecommendation.summary || reasoning || details}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="products-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Life Recommendations */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 flex items-center gap-2 mb-2">
                                    <HeartPulse className="w-4 h-4" /> Recommended Life Plans
                                </h4>
                                {life_recommendations.map((rec, idx) => (
                                    <div key={`life-${idx}`} className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -z-10" />
                                        <div className="mb-4">
                                            <h5 className="text-white font-black text-base mb-0.5">{rec.product_name}</h5>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{rec.provider}</p>
                                        </div>
                                        <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-3 mb-4">
                                            <div className="text-[8px] font-black uppercase text-pink-500 tracking-widest mb-0.5">Recommended Cover</div>
                                            <div className="text-lg font-black text-white">{rec.recommended_cover}</div>
                                        </div>
                                        <div
                                            className="bg-white/5 border border-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors mb-4"
                                            onClick={() => toggleLife(idx)}
                                        >
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest">
                                                <span>AI Reasoning</span>
                                                {expandedLife[idx] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                            </div>
                                            <AnimatePresence initial={false}>
                                                {expandedLife[idx] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden mt-2"
                                                    >
                                                        <p className="text-[10px] text-slate-400 italic leading-relaxed">"{rec.why_this}"</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="space-y-1.5">
                                            {(rec.key_benefits || []).slice(0, 2).map((benefit, i) => (
                                                <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" />
                                                    <span>{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Health Recommendations */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4" /> Recommended Health Plans
                                </h4>
                                {health_recommendations.map((rec, idx) => (
                                    <div key={`health-${idx}`} className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -z-10" />
                                        <div className="mb-4">
                                            <h5 className="text-white font-black text-base mb-0.5">{rec.product_name}</h5>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{rec.provider}</p>
                                        </div>
                                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 mb-4">
                                            <div className="text-[8px] font-black uppercase text-blue-500 tracking-widest mb-0.5">Recommended Sum Insured</div>
                                            <div className="text-lg font-black text-white">{rec.recommended_cover}</div>
                                        </div>
                                        <div
                                            className="bg-white/5 border border-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors mb-4"
                                            onClick={() => toggleHealth(idx)}
                                        >
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest">
                                                <span>AI Reasoning</span>
                                                {expandedHealth[idx] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                            </div>
                                            <AnimatePresence initial={false}>
                                                {expandedHealth[idx] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden mt-2"
                                                    >
                                                        <p className="text-[10px] text-slate-400 italic leading-relaxed">"{rec.why_this}"</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="space-y-1.5">
                                            {(rec.key_benefits || []).slice(0, 2).map((benefit, i) => (
                                                <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" />
                                                    <span>{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <MapPin className="w-4 h-4 text-brand-accent" />
                    <span className="text-xs uppercase font-black tracking-widest">City: <strong className="text-white">{city}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Users className="w-4 h-4 text-brand-accent" />
                    <span className="text-xs uppercase font-black tracking-widest">Family: <strong className="text-white">{activeDependents.join(', ') || 'Self Only'}</strong></span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                    onClick={onUpdatePlan}
                    className={`flex-1 ${isPhase2Incomplete ? 'bg-white/5 border border-white/10 text-slate-400' : 'bg-white text-brand-dark shadow-xl hover:shadow-white/10'} px-4 py-3 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base flex items-center justify-center transition-all group active:scale-95`}
                >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Start Over
                </button>

                {isPhase2Incomplete && (
                    <button
                        onClick={onCompleteExistingDetails}
                        className="flex-1 bg-brand-accent text-brand-dark px-4 py-3 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base flex items-center justify-center shadow-xl hover:shadow-brand-accent/20 transition-all group active:scale-95 border-b-4 border-emerald-700"
                    >
                        <Shield className="w-4 h-4 mr-2 animate-pulse" />
                        Identify Coverage Gap
                    </button>
                )}
            </div>
        </motion.div>
    );
}
