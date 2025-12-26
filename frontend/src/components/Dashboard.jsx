import { Shield, Heart, User, ArrowRight, RefreshCw, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ userProfile, latestRecommendation, history, onUpdatePlan }) {
    if (!latestRecommendation) return null;

    const { life_cover, health_cover, details, icon } = latestRecommendation;
    const { first_name, last_name, city, dependents, num_children } = userProfile;

    // Filter active dependents
    const activeDependents = Object.entries(dependents || {})
        .filter(([_, isActive]) => isActive)
        .map(([name]) => name === 'Children' ? `${num_children} Children` : name);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-2">Welcome Back, {first_name}! 👋</h2>
                <p className="text-slate-400">Here's a summary of your current insurance strategy.</p>
            </div>

            {/* Plan Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Heart className="w-16 h-16 text-brand-accent" />
                    </div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Life Insurance</label>
                    <div className="text-3xl font-black text-white mb-2">{life_cover}</div>
                    <p className="text-sm text-slate-400">Recommended coverage for your family's future.</p>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Shield className="w-16 h-16 text-brand-primary" />
                    </div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Health Insurance</label>
                    <div className="text-3xl font-black text-white mb-2">{health_cover}</div>
                    <p className="text-sm text-slate-400">Comprehensive protection for medical emergencies.</p>
                </div>
            </div>

            {/* AI Context Card */}
            <div className="p-8 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">{icon}</span>
                    <div>
                        <h4 className="text-white font-bold mb-1">Expert Analysis</h4>
                        <p className="text-slate-300 leading-relaxed italic">"{details}"</p>
                    </div>
                </div>
            </div>

            {/* Plan History Section */}
            {history && history.length > 1 && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Plan History
                    </h4>
                    <div className="space-y-3">
                        {history.map((plan, idx) => (
                            <div
                                key={plan.id}
                                className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${idx === 0 ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-white/5 border-white/10'}`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm">
                                        Life: {plan.life_cover} | Health: {plan.health_cover}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(plan.created_at).toLocaleDateString()} at {new Date(plan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {idx === 0 && <span className="text-[10px] bg-brand-primary text-white px-2 py-0.5 rounded-full font-bold uppercase">Current</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Profile Snapshot */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Your Profile Snapshot
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <MapPin className="w-4 h-4 text-brand-accent" />
                        <span className="text-sm">Based in <strong className="text-white">{city}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <Users className="w-4 h-4 text-brand-accent" />
                        <span className="text-sm">Covering <strong className="text-white">{activeDependents.join(', ') || 'Self'}</strong></span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    onClick={onUpdatePlan}
                    className="flex-1 bg-white text-brand-dark px-8 py-4 rounded-2xl font-black flex items-center justify-center shadow-xl hover:shadow-white/10 transition-all group"
                >
                    <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Update My Strategy
                </button>
                <div className="flex items-center justify-center px-4 text-slate-500 text-sm font-medium">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </motion.div>
    );
}
