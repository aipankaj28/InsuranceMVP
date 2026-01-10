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
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-auth-primary)' }}>Your financial landscape</h2>
                <p className="text-sm md:text-base" style={{ color: 'var(--text-auth-muted)' }}>This helps us recommend coverage that fits your budget.</p>
            </div>

            <div className="space-y-6">
                {/* Company Name */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold ml-1 flex items-center gap-2" style={{ color: 'var(--text-auth-label)' }}>
                        <Building2 className="w-4 h-4 text-brand-accent" /> Company Name
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="e.g. Google, TCS, HDFC Bank"
                            value={formData.company_name || ""}
                            onChange={(e) => updateField('company_name', e.target.value)}
                            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-accent outline-none transition-all font-medium"
                            style={{
                                backgroundColor: 'var(--bg-auth-input)',
                                borderColor: 'var(--border-auth-card)',
                                color: 'var(--text-auth-primary)'
                            }}
                        />
                    </div>
                </div>

                {/* Industry Type */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold ml-1 flex items-center gap-2" style={{ color: 'var(--text-auth-label)' }}>
                        <Factory className="w-4 h-4 text-blue-400" /> Industry Type
                    </label>
                    <div className="relative group">
                        <select
                            value={formData.industry_type || ""}
                            onChange={(e) => updateField('industry_type', e.target.value)}
                            className="w-full p-4 border rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-brand-accent transition-all font-medium"
                            style={{
                                backgroundColor: 'var(--bg-auth-input)',
                                borderColor: 'var(--border-auth-card)',
                                color: 'var(--text-auth-primary)'
                            }}
                        >
                            <option value="" disabled style={{ backgroundColor: 'var(--bg-auth-main)' }}>Select Industry</option>
                            {industryTypes.map(industry => (
                                <option key={industry} value={industry} style={{ backgroundColor: 'var(--bg-auth-main)' }}>{industry}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: 'var(--text-auth-placeholder)' }}>▼</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold ml-1 flex items-center gap-2" style={{ color: 'var(--text-auth-label)' }}>
                        <IndianRupee className="w-4 h-4 text-emerald-400" /> Annual Income Bracket
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {incomeBrackets.map(bracket => {
                            const value = `${bracket.range} - ${bracket.tier}`;
                            return (
                                <button
                                    key={value}
                                    onClick={() => updateField('income_level', value)}
                                    className={`p-3 md:p-4 rounded-xl border text-left transition-all duration-200 group ${
                                        formData.income_level === value 
                                            ? 'bg-brand-accent/20 border-brand-accent' 
                                            : 'hover:bg-opacity-10'
                                    }`}
                                    style={formData.income_level !== value ? {
                                        backgroundColor: 'var(--bg-auth-input)',
                                        borderColor: 'var(--border-auth-card)',
                                        color: 'var(--text-auth-muted)'
                                    } : {
                                        color: 'var(--text-auth-primary)'
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs md:text-sm font-bold">{bracket.range}</span>
                                        <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${
                                            formData.income_level === value 
                                                ? 'text-brand-accent' 
                                                : ''
                                        }`} style={formData.income_level !== value ? {
                                            color: 'var(--text-auth-placeholder)'
                                        } : {}}>
                                            {bracket.tier}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            
        </StepWrapper>
    );
}
