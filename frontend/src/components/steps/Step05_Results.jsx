import StepWrapper from './StepWrapper';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Shield } from 'lucide-react';

export default function Step05_Results({ result }) {
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

            <div className="inline-block relative">
                <div className="text-7xl animate-bounce">{result.icon}</div>
                <Sparkles className="absolute -top-4 -right-4 text-yellow-400 w-8 h-8 animate-pulse" />
            </div>

            <div>
                <h2 className="text-3xl font-extrabold text-white mb-2">Your Personalized Shield</h2>
                <p className="text-sm text-slate-400 leading-relaxed px-4">{result.details}</p>
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

            <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm text-slate-500 hover:text-white transition-colors underline decoration-dotted underline-offset-4"
            >
                Start a New Calculation
            </button>
        </StepWrapper>
    );
}
