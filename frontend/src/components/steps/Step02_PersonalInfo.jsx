import StepWrapper from './StepWrapper';

export default function Step02_PersonalInfo({ formData, updateField }) {
    const incomeLevels = ['<5L', '5-10L', '10-20L', '>20L'];

    return (
        <StepWrapper className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Let's get better acquainted. 👋</h2>
                <p className="text-slate-400">Tell us a bit about yourself to get started.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">First Name <span className="text-red-500">*</span></label>
                        <input
                            type="text" placeholder="Pankaj"
                            value={formData.first_name}
                            onChange={(e) => updateField('first_name', e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white placeholder-white/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Last Name <span className="text-red-500">*</span></label>
                        <input
                            type="text" placeholder="Sharma"
                            value={formData.last_name}
                            onChange={(e) => updateField('last_name', e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white placeholder-white/20 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Gender <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                        {['Male', 'Female', 'Other'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => updateField('gender', option)}
                                className={`flex-1 p-3 rounded-xl border transition-all duration-200 font-medium ${formData.gender === option ? 'bg-brand-accent text-brand-dark border-brand-accent shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateField('dob', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white transition-all [color-scheme:dark]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Mobile Number</label>
                    <input
                        type="tel" placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => updateField('mobile', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white placeholder-white/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Annual Income Range</label>
                    <div className="relative">
                        <select
                            value={formData.income_level}
                            onChange={(e) => updateField('income_level', e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white appearance-none cursor-pointer"
                        >
                            {incomeLevels.map(level => (
                                <option key={level} value={level} className="bg-brand-dark">{level}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">▼</div>
                    </div>
                </div>
            </div>
        </StepWrapper>
    );
}
