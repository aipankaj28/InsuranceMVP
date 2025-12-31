import StepWrapper from './StepWrapper';
import { Calendar, Users, Heart, Baby } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Step02_LifeStage({ formData, updateField }) {
    const [age, setAge] = useState(null);

    useEffect(() => {
        if (formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge);
        }
    }, [formData.dob]);

    const handleMaritalStatus = (status) => {
        updateField('marital_status', status);
        if (status === 'Single') {
            updateField('num_children', 0);
        }
    };

    return (
        <StepWrapper className="space-y-6 md:space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Who shares your journey, <span className="text-brand-accent">{formData.first_name || 'Friend'}</span>?
                </h2>
                <p className="text-sm md:text-base text-slate-400">Protecting your loved ones starts with understanding who they are.</p>
            </div>

            <div className="space-y-6">
                {/* Marital Status */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" /> Marital Status
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Single', 'Married', 'Other'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleMaritalStatus(status)}
                                className={`p-2.5 md:p-4 rounded-xl border transition-all duration-200 ${formData.marital_status === status ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="text-sm font-bold">{status}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Children and Parents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Number of Children */}
                    <div className={`space-y-3 transition-all duration-300 ${formData.marital_status === 'Married' ? 'opacity-100 scale-100' : 'opacity-50 pointer-events-none'}`}>
                        <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-blue-400" /> Number of Children
                        </label>
                        <select
                            value={formData.num_children || 0}
                            onChange={(e) => updateField('num_children', parseInt(e.target.value))}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white appearance-none"
                        >
                            {[0, 1, 2, '3+'].map(num => (
                                <option key={num} value={typeof num === 'string' ? 3 : num} className="bg-brand-dark">{num}</option>
                            ))}
                        </select>
                    </div>

                    {/* Support Parents */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-400" /> Support Parents?
                        </label>
                        <div className="grid grid-cols-2 gap-3 h-[58px]">
                            {[true, false].map(val => (
                                <button
                                    key={val ? 'yes' : 'no'}
                                    onClick={() => updateField('support_parents', val)}
                                    className={`rounded-xl border transition-all duration-200 ${formData.support_parents === val ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                >
                                    <span className="text-sm font-bold">{val ? 'Yes' : 'No'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" /> Date of Birth
                    </label>
                    <input
                        type="date"
                        value={formData.dob || ""}
                        onChange={(e) => updateField('dob', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-white transition-all color-scheme-dark"
                    />

                    {age !== null && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-500 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
                            <p className="text-emerald-400 text-sm font-medium">
                                At {age}, you've got <span className="font-black underline">{Math.max(0, 65 - age)} years</span> of earning potential to protect! 💰
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </StepWrapper>
    );
}
