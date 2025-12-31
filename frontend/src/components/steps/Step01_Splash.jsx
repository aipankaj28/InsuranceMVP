import StepWrapper from './StepWrapper';
import { Sparkles, ArrowRight, User, MapPin, Phone } from 'lucide-react';

export default function Step01_Splash({ formData, updateField }) {
    return (
        <StepWrapper className="space-y-6 md:space-y-8">
            <div className="text-center space-y-3 md:space-y-4">
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    You're more than <span className="text-brand-accent">your job.</span>
                </h1>
                <p className="text-base md:text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">
                    Your work pays the bills. But what about your family's dreams? Your parents' health? Your future freedom?
                </p>
                <div className="pt-4">
                    <p className="text-sm font-medium text-slate-400 bg-white/5 inline-block px-4 py-2 rounded-full border border-white/10">
                        Tell us about yourself, and we'll build your protection story.
                    </p>
                </div>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
                {/* First Name */}
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Your name"
                        value={formData.first_name || ""}
                        onChange={(e) => updateField('first_name', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none text-white placeholder-slate-500 transition-all font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</div>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map(g => (
                        <button
                            key={g}
                            onClick={() => updateField('gender', g)}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all ${formData.gender === g ? 'bg-brand-accent/20 border-brand-accent text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                {/* City */}
                <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-accent transition-colors" />
                    <select
                        value={formData.city || ""}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none text-white appearance-none cursor-pointer font-medium"
                    >
                        <option value="" disabled className="bg-brand-dark">Select your city</option>
                        {["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Other"].map(city => (
                            <option key={city} value={city} className="bg-brand-dark">{city}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                </div>

                {/* Mobile */}
                <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-accent transition-colors" />
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none">+91</div>
                    <input
                        type="tel"
                        maxLength="10"
                        placeholder="Mobile Number"
                        value={formData.mobile || ""}
                        onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full pl-22 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none text-white placeholder-slate-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="text-center text-xs text-slate-500">
                <p>Press "Begin my protection story" below to continue</p>
            </div>
        </StepWrapper>
    );
}
