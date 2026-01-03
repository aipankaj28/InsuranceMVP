import StepWrapper from './StepWrapper';
import { IndianRupee, Briefcase, Building2, Factory } from 'lucide-react';

export default function Step04_FinancialReality({ formData, updateField }) {
    const incomeBrackets = [
        { range: 'Under ₹5 lakhs', tier: 'Essential Tier' },
        { range: '₹5-7.5 lakhs', tier: 'Standard Tier' },
        { range: '₹7.5-15 lakhs', tier: 'Enhanced Tier' },
        { range: '₹15-25 lakhs', tier: 'Premium Tier' },
        { range: '₹25-40 lakhs', tier: 'Comprehensive Tier' },
        { range: '₹40+ lakhs', tier: 'Elite Tier' }
    ];

    const industryTypes = [
        'IT & Software',
        'Healthcare & Pharma',
        'Banking & Finance',
        'Manufacturing',
        'Education',
        'Consulting',
        'Retail & E-commerce',
        'Government/PSU',
        'Media & Entertainment',
        'Construction & Real Estate',
        'Others'
    ];

    return (
        <StepWrapper className="space-y-6 md:space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your financial landscape</h2>
                <p className="text-sm md:text-base text-slate-400">This helps us recommend coverage that fits your budget.</p>
            </div>

            <div className="space-y-6">
                {/* Company Name */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-brand-accent" /> Company Name
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="e.g. Google, TCS, HDFC Bank"
                            value={formData.company_name || ""}
                            onChange={(e) => updateField('company_name', e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white transition-all font-medium placeholder:text-slate-600"
                        />
                    </div>
                </div>

                {/* Industry Type */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Factory className="w-4 h-4 text-blue-400" /> Industry Type
                    </label>
                    <div className="relative group">
                        <select
                            value={formData.industry_type || ""}
                            onChange={(e) => updateField('industry_type', e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white appearance-none cursor-pointer focus:ring-2 focus:ring-brand-accent transition-all font-medium"
                        >
                            <option value="" disabled className="bg-brand-dark">Select Industry</option>
                            {industryTypes.map(industry => (
                                <option key={industry} value={industry} className="bg-brand-dark">{industry}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-emerald-400" /> Annual Income Bracket
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {incomeBrackets.map(bracket => {
                            const value = `${bracket.range} - ${bracket.tier}`;
                            return (
                                <button
                                    key={value}
                                    onClick={() => updateField('income_level', value)}
                                    className={`p-3 md:p-4 rounded-xl border text-left transition-all duration-200 group ${formData.income_level === value ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs md:text-sm font-bold">{bracket.range}</span>
                                        <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${formData.income_level === value ? 'text-brand-accent' : 'text-slate-600 group-hover:text-slate-500'}`}>
                                            {bracket.tier}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] text-slate-500 italic">
                * We use this to calculate appropriate coverage, not for underwriting
            </p>
        </StepWrapper>
    );
}
