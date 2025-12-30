import { Shield, Heart, User, RefreshCw, MapPin, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ userProfile, latestRecommendation, history, onUpdatePlan }) {
    if (!latestRecommendation) return null;

    const { life_cover, health_cover, details, icon, reasoning } = latestRecommendation;
    const { first_name, city, dependents, num_children } = userProfile;

    // Filter active dependents
    const activeDependents = Object.entries(dependents || {})
        .filter(([_, isActive]) => isActive)
        .map(([name]) => name === 'Children' ? `${num_children} Children` : name);

    // Gap Analysis Helpers
    const parseToLakhs = (str) => {
        if (!str || str === "None" || str === "") return 0;
        // Handle "₹5.0 Crore" or "₹50 Lakhs" or "₹1.2 Crore"
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-2">Protection Dashboard</h2>
                <p className="text-slate-400">Comparing your <span className="text-brand-accent">Ideal Shield</span> with your <span className="text-white">Existing Net</span>.</p>
            </div>

            {/* Gap Analysis Dashboard */}
            <div className="space-y-6">
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
                            <div className="text-right">
                                <span className={`text-2xl font-black ${lifeGap > 0 ? 'text-pink-500' : 'text-emerald-500'}`}>
                                    {lifeGap > 0 ? `+${formatLakhs(lifeGap)}` : 'Fully Protected'}
                                </span>
                                <div className="text-[10px] font-bold text-slate-600 uppercase">Gap Amount</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                                <div
                                    className="h-full bg-pink-500/20 border-r border-pink-500/50 transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (existingLife / idealLife) * 100)}%` }}
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
                            <div className="text-right">
                                <span className={`text-2xl font-black ${healthGap > 0 ? 'text-blue-500' : 'text-emerald-500'}`}>
                                    {healthGap > 0 ? `+${formatLakhs(healthGap)}` : 'Fully Protected'}
                                </span>
                                <div className="text-[10px] font-bold text-slate-600 uppercase">Gap Amount</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                                <div
                                    className="h-full bg-blue-500/20 border-r border-blue-500/50 transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (existingHealth / idealHealth) * 100)}%` }}
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
            </div>

            {/* AI Strategic Reasoning */}
            <div className="p-8 bg-brand-accent/10 border border-brand-accent/20 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-12 h-12 text-brand-accent" />
                </div>
                <div className="flex items-start gap-4">
                    <span className="text-3xl">{icon}</span>
                    <div>
                        <h4 className="text-white font-bold mb-1">Our AI's Strategic Reasoning</h4>
                        <p className="text-slate-300 leading-relaxed italic text-sm">"{reasoning || details}"</p>
                    </div>
                </div>
            </div>

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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    onClick={onUpdatePlan}
                    className="flex-1 bg-white text-brand-dark px-8 py-4 rounded-2xl font-black flex items-center justify-center shadow-xl hover:shadow-white/10 transition-all group active:scale-95"
                >
                    <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Re-calculate My Strategy
                </button>
            </div>
        </motion.div>
    );
}
