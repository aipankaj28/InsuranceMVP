import StepWrapper from './StepWrapper';

export default function Step04_Career({ formData, updateField }) {
    return (
        <StepWrapper className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">The financial details. 💸</h2>
                <p className="text-slate-400">This helps us calculate the right cover for you.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Years of Experience</label>
                    <div className="relative">
                        <select
                            value={formData.experience}
                            onChange={(e) => updateField('experience', parseInt(e.target.value))}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white appearance-none cursor-pointer"
                        >
                            <option value={0} className="bg-brand-dark">Fresher (0-1 years)</option>
                            <option value={3} className="bg-brand-dark">Associate (2-5 years)</option>
                            <option value={8} className="bg-brand-dark">Senior (5-10 years)</option>
                            <option value={12} className="bg-brand-dark">Veteran (10+ years)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">▼</div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Annual Income Range</label>
                    <div className="grid grid-cols-1 gap-3">
                        {['<5L', '5-10L', '10-20L', '>20L'].map((inc) => (
                            <label
                                key={inc}
                                onClick={() => updateField('income_level', inc)}
                                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${formData.income_level === inc
                                    ? 'bg-brand-primary/20 border-brand-primary ring-1 ring-brand-primary'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${formData.income_level === inc ? 'border-brand-primary' : 'border-white/30 group-hover:border-white/50'
                                    }`}>
                                    {formData.income_level === inc && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                                </div>
                                <span className={`font-medium ${formData.income_level === inc ? 'text-white' : 'text-slate-400'}`}>{inc}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </StepWrapper>
    );
}
