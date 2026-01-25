import { motion } from 'framer-motion';
import { Sparkles, FileSearch, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FeatureSelector({ onSelectFeature }) {
    const features = [
        {
            id: 'wizard',
            title: 'AI Insurance Wizard',
            description: 'New to insurance? Let our AI guide you to the perfect coverage based on your life stage.',
            icon: <Sparkles className="w-8 h-8 text-blue-400" />,
            color: 'blue',
            badge: 'Guided Flow'
        },
        {
            id: 'policy_review',
            title: 'Policy Gap Analysis',
            description: 'Upload your documents and let AI extract your profile and identify missing coverage gaps instantly.',
            icon: <FileSearch className="w-8 h-8 text-brand-accent" />,
            color: 'brand',
            badge: 'AI Powered'
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Secure & Private</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-auth-primary)' }}>
                    How can we <span className="text-brand-accent">protect</span> you today?
                </h2>
                <p className="text-sm md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-auth-muted)' }}>
                    Choose a path to begin your financial security journey.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                    <motion.button
                        key={feature.id}
                        initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectFeature(feature.id)}
                        className={`text-left p-8 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group`}
                        style={{
                            backgroundColor: 'var(--bg-auth-input)',
                            borderColor: 'var(--border-auth-card)'
                        }}
                    >
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20`}>
                                    {feature.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10`} style={{ color: 'var(--text-auth-muted)' }}>
                                    {feature.badge}
                                </span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-black mb-3" style={{ color: 'var(--text-auth-primary)' }}>
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-auth-muted)' }}>
                                {feature.description}
                            </p>

                            <div className="flex items-center gap-2 font-bold text-sm text-brand-accent group-hover:gap-4 transition-all">
                                <span>Get Started</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
