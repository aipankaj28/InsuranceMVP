import StepWrapper from './StepWrapper';
import { IndianRupee, Briefcase, Info } from 'lucide-react';

export default function Step04_FinancialReality({ formData, updateField }) {
    const incomeBrackets = [
        'Under ₹5 lakhs',
        '₹5-10 lakhs',
        '₹10-20 lakhs',
        '₹20-35 lakhs',
        '₹35+ lakhs'
    ];

    const employmentTypes = [
        'Salaried (MNC/Large)',
        'Salaried (Startup)',
        'Govt/PSU',
        'Self-Employed',
        'Gig Worker',
        'Student'
    ];

    const getProgress = () => {
        const index = incomeBrackets.indexOf(formData.income_level);
        if (index === -1) return 0;
        return ((index + 1) / incomeBrackets.length) * 100;
    };

    return (
        <StepWrapper className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Your financial landscape</h2>
                <p className="text-slate-400">This helps us recommend coverage that fits your budget.</p>
            </div>

            {/* Protection Capacity Visual */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protection Capacity</span>
                    <span className="text-brand-accent font-black">{Math.round(getProgress())}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-brand-accent transition-all duration-700"
                        style={{ width: `${getProgress()}%` }}
                    ></div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Info className="w-3 h-3" />
                    <span>Based on your annual income bracket</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Income */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-emerald-400" /> Annual Income Bracket
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {incomeBrackets.map(bracket => (
                            <button
                                key={bracket}
                                onClick={() => updateField('income_level', bracket)}
                                className={`p-4 rounded-xl border text-left transition-all duration-200 ${formData.income_level === bracket ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="text-sm font-bold">{bracket}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Employment */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" /> Employment Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {employmentTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => updateField('employment_type', type)}
                                className={`p-4 rounded-xl border text-center transition-all duration-200 ${formData.employment_type === type ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="text-[10px] font-bold leading-tight uppercase tracking-tight">{type}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] text-slate-500 italic">
                * We use this to calculate appropriate coverage, not for underwriting
            </p>
        </StepWrapper>
    );
}
