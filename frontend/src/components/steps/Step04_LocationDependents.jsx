import StepWrapper from './StepWrapper';

export default function Step04_LocationDependents({ formData, updateField }) {
    const indianCities = [
        "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad",
        "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
        "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
    ];

    const dependentTypes = [
        "Spouse", "Mother", "Father", "Mother-In-Law", "Father-In-Law"
    ];

    const handleDependentChange = (type) => {
        const newDependents = { ...formData.dependents, [type]: !formData.dependents[type] };
        updateField('dependents', newDependents);
    };

    const handleChildrenToggle = () => {
        const newDependents = { ...formData.dependents, Children: !formData.dependents.Children };
        updateField('dependents', newDependents);
        if (!newDependents.Children) {
            updateField('num_children', 0);
        }
    };

    return (
        <StepWrapper className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Location & Family. 🏠</h2>
                <p className="text-slate-400">This helps us tailor the plan for your loved ones.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">City of Residence</label>
                    <div className="relative">
                        <select
                            value={formData.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="bg-brand-dark">Select city</option>
                            {indianCities.map(city => (
                                <option key={city} value={city} className="bg-brand-dark">{city}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">▼</div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-4">Who are you covering?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Spouse */}
                        <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${formData.dependents.Spouse ? 'bg-brand-accent/20 border-brand-accent' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            <input type="checkbox" className="hidden" checked={formData.dependents.Spouse} onChange={() => handleDependentChange('Spouse')} />
                            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${formData.dependents.Spouse ? 'bg-brand-accent border-brand-accent' : 'border-white/30'}`}>
                                {formData.dependents.Spouse && <span className="text-brand-dark text-xs font-bold">✓</span>}
                            </div>
                            <span className={formData.dependents.Spouse ? 'text-white' : 'text-slate-400'}>Spouse</span>
                        </label>

                        {/* Children Toggle */}
                        <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${formData.dependents.Children ? 'bg-brand-accent/20 border-brand-accent' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            <input type="checkbox" className="hidden" checked={formData.dependents.Children} onChange={handleChildrenToggle} />
                            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${formData.dependents.Children ? 'bg-brand-accent border-brand-accent' : 'border-white/30'}`}>
                                {formData.dependents.Children && <span className="text-brand-dark text-xs font-bold">✓</span>}
                            </div>
                            <span className={formData.dependents.Children ? 'text-white' : 'text-slate-400'}>Children</span>
                        </label>

                        {/* Parents & In-laws */}
                        {dependentTypes.slice(1).map(type => (
                            <label key={type} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${formData.dependents[type] ? 'bg-brand-accent/20 border-brand-accent' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                <input type="checkbox" className="hidden" checked={formData.dependents[type]} onChange={() => handleDependentChange(type)} />
                                <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${formData.dependents[type] ? 'bg-brand-accent border-brand-accent' : 'border-white/30'}`}>
                                    {formData.dependents[type] && <span className="text-brand-dark text-xs font-bold">✓</span>}
                                </div>
                                <span className={formData.dependents[type] ? 'text-white' : 'text-slate-400'}>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {formData.dependents.Children && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Number of Children</label>
                        <input
                            type="number" min="1" max="10"
                            value={formData.num_children || ""}
                            onChange={(e) => updateField('num_children', parseInt(e.target.value) || 0)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white placeholder-white/20 transition-all"
                            placeholder="e.g. 2"
                        />
                    </div>
                )}
            </div>
        </StepWrapper>
    );
}
