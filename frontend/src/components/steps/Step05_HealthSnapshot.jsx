import StepWrapper from './StepWrapper';
import { Activity, Cigarette, Stethoscope, Heart, Shield } from 'lucide-react';

export default function Step05_HealthSnapshot({ formData, updateField }) {
    const tobaccoOptions = [
        { label: 'Never', value: 'Never' },
        { label: 'Occasionally', value: 'Occasionally' },
        { label: 'Regularly', value: 'Regularly' }
    ];

    const healthConditions = [
        'No significant history',
        'Diabetes/Blood Pressure',
        'Heart conditions',
        'Cancer'
    ];

    const lifestyles = [
        { label: 'Very Active', sub: 'Exercise 4+ times/week', value: 'Very Active' },
        { label: 'Moderately Active', sub: 'Exercise 1-3 times/week', value: 'Moderately Active' },
        { label: 'Sedentary', sub: 'Mostly desk job', value: 'Sedentary' }
    ];

    const toggleCondition = (condition) => {
        const current = formData.family_health_history || [];
        if (condition === 'No significant history') {
            updateField('family_health_history', ['No significant history']);
            return;
        }

        let next = current.filter(c => c !== 'No significant history');
        if (next.includes(condition)) {
            next = next.filter(c => c !== condition);
        } else {
            next = [...next, condition];
        }

        if (next.length === 0) next = ['No significant history'];
        updateField('family_health_history', next);
    };

    return (
        <StepWrapper className="space-y-6 md:space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Most Valuable Asset</h2>
                <p className="text-sm md:text-base text-slate-400">A few quick questions to understand your health priorities.</p>
            </div>

            {/* Health Dashboard Visual */}
            <div className="flex justify-around bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
                <div className={`p-2 md:p-3 rounded-full transition-all duration-300 ${formData.smoking_status === 'Never' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'}`}>
                    <Cigarette className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className={`p-2 md:p-3 rounded-full transition-all duration-300 ${(formData.family_health_history || []).includes('No significant history') ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-600'}`}>
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className={`p-2 md:p-3 rounded-full transition-all duration-300 ${formData.lifestyle === 'Very Active' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-white/5 text-slate-600'}`}>
                    <Activity className="w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Tobacco */}
                <div className="space-y-2 md:space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Cigarette className="w-3 h-3 text-orange-400" /> Tobacco Usage
                    </label>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {tobaccoOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => updateField('smoking_status', opt.value)}
                                className={`p-2 md:p-3 rounded-xl border transition-all duration-200 ${formData.smoking_status === opt.value ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="text-[9px] md:text-xs font-bold">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Family History */}
                <div className="space-y-2 md:space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Stethoscope className="w-3 h-3 text-blue-400" /> Family Health History
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {healthConditions.map(condition => (
                            <button
                                key={condition}
                                onClick={() => toggleCondition(condition)}
                                className={`p-2.5 md:p-4 rounded-xl border text-left transition-all duration-200 ${(formData.family_health_history || []).includes(condition) ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="text-[9px] md:text-xs font-bold">{condition}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lifestyle */}
                <div className="space-y-2 md:space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Shield className="w-3 h-3 text-brand-accent" /> Lifestyle
                    </label>
                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                        {lifestyles.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => updateField('lifestyle', opt.value)}
                                className={`flex items-center justify-between p-2.5 md:p-4 rounded-xl border transition-all duration-200 ${formData.lifestyle === opt.value ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <div className="text-left">
                                    <div className="text-[11px] md:text-sm font-bold">{opt.label}</div>
                                    <div className="text-[8px] md:text-[10px] text-slate-500">{opt.sub}</div>
                                </div>
                                <Activity className={`w-3 h-3 md:w-4 md:h-4 ${formData.lifestyle === opt.value ? 'text-brand-accent' : 'text-slate-600'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </StepWrapper>
    );
}
