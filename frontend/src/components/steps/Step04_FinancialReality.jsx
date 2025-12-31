import StepWrapper from './StepWrapper';
import { IndianRupee, Briefcase } from 'lucide-react';

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

    return (
        <StepWrapper className="space-y-6 md:space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your financial landscape</h2>
                <p className="text-sm md:text-base text-slate-400">This helps us recommend coverage that fits your budget.</p>
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
                                className={`p-3 md:p-4 rounded-xl border text-left transition-all duration-200 ${formData.income_level === bracket ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="text-xs md:text-sm font-bold">{bracket}</span>
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
                                className={`p-3 md:p-4 rounded-xl border text-center transition-all duration-200 ${formData.employment_type === type ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="text-[9px] md:text-[10px] font-bold leading-tight uppercase tracking-tight">{type}</span>
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
