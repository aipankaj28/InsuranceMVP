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
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-auth-primary)' }}>Your Most Valuable Asset</h2>
                <p className="text-sm md:text-base" style={{ color: 'var(--text-auth-muted)' }}>A few quick questions to understand your health priorities.</p>
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Tobacco */}
                <div className="space-y-2 md:space-y-3">
                    <label className="block text-xs font-semibold ml-1 flex items-center gap-2" style={{ color: 'var(--text-auth-label)' }}>
                        <Cigarette className="w-3 h-3 text-orange-400" /> Tobacco Usage
                    </label>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {tobaccoOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => updateField('smoking_status', opt.value)}
                                className={`p-2 md:p-3 rounded-xl border transition-all duration-200 ${
                                    formData.smoking_status === opt.value 
                                        ? 'bg-brand-accent/20 border-brand-accent' 
                                        : 'hover:bg-opacity-10'
                                }`}
                                style={formData.smoking_status !== opt.value ? {
                                    backgroundColor: 'var(--bg-auth-input)',
                                    borderColor: 'var(--border-auth-card)',
                                    color: 'var(--text-auth-muted)'
                                } : {
                                    color: 'var(--text-auth-primary)'
                                }}
                            >
                                <span className="text-[9px] md:text-xs font-bold">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Family History */}
                <div className="space-y-2 md:space-y-3">
                    <label className="block text-xs font-semibold ml-1 flex items-center gap-2" style={{ color: 'var(--text-auth-label)' }}>
                        <Stethoscope className="w-3 h-3 text-blue-400" /> Family Health History
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {healthConditions.map(condition => (
                            <button
                                key={condition}
                                onClick={() => toggleCondition(condition)}
                                className={`p-2.5 md:p-4 rounded-xl border text-left transition-all duration-200 ${
                                    (formData.family_health_history || []).includes(condition) 
                                        ? 'bg-blue-500/20 border-blue-500' 
                                        : 'hover:bg-opacity-10'
                                }`}
                                style={(formData.family_health_history || []).includes(condition) ? {
                                    color: 'var(--text-auth-primary)'
                                } : {
                                    backgroundColor: 'var(--bg-auth-input)',
                                    borderColor: 'var(--border-auth-card)',
                                    color: 'var(--text-auth-muted)'
                                }}
                            >
                                <span className="text-[9px] md:text-xs font-bold">{condition}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lifestyle */}
                <div className="space-y-2 md:space-y-3">
                    <label className="block text-xs font-semibold ml-1 flex items-center gap-2" style={{ color: 'var(--text-auth-label)' }}>
                        <Shield className="w-3 h-3 text-brand-accent" /> Lifestyle
                    </label>
                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                        {lifestyles.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => updateField('lifestyle', opt.value)}
                                className={`flex items-center justify-between p-2.5 md:p-4 rounded-xl border transition-all duration-200 ${
                                    formData.lifestyle === opt.value 
                                        ? 'bg-brand-accent/20 border-brand-accent' 
                                        : 'hover:bg-opacity-10'
                                }`}
                                style={formData.lifestyle !== opt.value ? {
                                    backgroundColor: 'var(--bg-auth-input)',
                                    borderColor: 'var(--border-auth-card)',
                                    color: 'var(--text-auth-muted)'
                                } : {
                                    color: 'var(--text-auth-primary)'
                                }}
                            >
                                <div className="text-left">
                                    <div className="text-[11px] md:text-sm font-bold">{opt.label}</div>
                                    <div className="text-[8px] md:text-[10px]" style={{ color: 'var(--text-auth-placeholder)' }}>{opt.sub}</div>
                                </div>
                                <Activity className={`w-3 h-3 md:w-4 md:h-4 ${
                                    formData.lifestyle === opt.value 
                                        ? 'text-brand-accent' 
                                        : ''
                                }`} style={formData.lifestyle !== opt.value ? {
                                    color: 'var(--text-auth-placeholder)'
                                } : {}} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </StepWrapper>
    );
}
