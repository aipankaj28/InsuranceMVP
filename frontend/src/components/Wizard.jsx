import { useState, useEffect } from 'react';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = rawBaseUrl.startsWith('http') ? rawBaseUrl : `https://${rawBaseUrl}`;
import { ArrowRight, ArrowLeft, Shield, Briefcase, User, Heart, Sparkles, Check } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import Step01_Splash from './steps/Step01_Splash';
import Step02_LifeStage from './steps/Step02_LifeStage';
import Step03_CareerStage from './steps/Step03_CareerStage';
import Step04_FinancialReality from './steps/Step04_FinancialReality';
import Step05_HealthSnapshot from './steps/Step05_HealthSnapshot';
import Step05_Results from './steps/Step05_Results';
import Step06_ExistingCoverage from './steps/Step06_ExistingCoverage';
import Step07_ExistingPolicyDetails from './steps/Step07_ExistingPolicyDetails';
import Step09_ProductRecommendations from './steps/Step09_ProductRecommendations';
import Dashboard from './Dashboard';

export default function Wizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "", // Internal/Backward compatibility
        city: "",
        mobile: "",
        marital_status: "Single",
        num_children: 0,
        support_parents: false,
        dob: "",
        career_stage: "Launch Pad",
        income_level: "₹5-10 lakhs",
        employment_type: "Salaried (MNC/Large)",
        smoking_status: "Never",
        family_health_history: ["No significant history"],
        lifestyle: "Moderately Active",
        gender: "", // Default
        // Phase 2 Fields
        has_life_insurance: false,
        existing_life_cover: "",
        existing_life_cover_val: 0,
        has_health_insurance: false,
        existing_health_cover: "",
        existing_health_cover_val: 0,
        health_source: "Employer",
        parents_covered: false,
        dependents: {},
        // Phase 3 Fields
        life_provider: "",
        life_policy_name: "",
        life_provider_custom: "",
        life_policy_name_custom: "",
        health_provider: "",
        health_policy_name: "",
        health_provider_custom: "",
        health_policy_name_custom: ""
    });
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [view, setView] = useState('wizard'); // 'wizard' or 'dashboard'

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.profile && data.profile.first_name) {
                    setFormData(prev => ({
                        ...prev,
                        ...data.profile
                    }));
                }

                if (data.recommendations && data.recommendations.length > 0) {
                    setResult(data.recommendations[0]); // Set latest as default result
                    setHistory(data.recommendations);
                    setView('dashboard'); // Direct returning users to dashboard
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isStepValid = () => {
        if (step === 1) {
            return (
                formData.first_name.trim() !== "" &&
                formData.city !== "" &&
                formData.mobile.length === 10 &&
                formData.gender !== ""
            );
        }
        if (step === 2) {
            return formData.dob !== "";
        }
        return true;
    };

    const handleNext = () => {
        if (isStepValid()) {
            setStep(prev => prev + 1);
        } else {
            alert("Please fill in all mandatory fields before proceeding.");
        }
    };

    const handleBack = () => setStep(prev => prev - 1);

    const fetchRecommendation = async () => {
        setLoading(true);
        try {
            // Prep dependents for calculation
            const updatedDependents = {};
            if (formData.marital_status === "Married") updatedDependents["Spouse"] = true;
            if (formData.support_parents) {
                updatedDependents["Mother"] = true;
                updatedDependents["Father"] = true;
            }
            if (formData.num_children > 0) updatedDependents["Children"] = true;

            const finalPayload = {
                ...formData,
                dependents: updatedDependents
            };

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/api/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert("Your session has expired. Please log in again.");
                    localStorage.removeItem('auth_token');
                    window.location.reload();
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch recommendation");
            }

            const data = await response.json();
            setResult(data);
            setHistory(prev => [data, ...prev]); // Add new recommendation to history
            handleNext();
        } catch (error) {
            console.error("Failed to fetch", error);
            alert("Oops! The insurance hamster fell off the wheel. Try again in a bit.");
        } finally {
            setLoading(false);
        }
    };

    const saveSafetyNet = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            // Format custom providers/policies if 'Other' was selected
            const finalFormData = { ...formData };
            if (finalFormData.life_provider === 'Other') finalFormData.life_provider = finalFormData.life_provider_custom;
            if (finalFormData.life_policy_name === 'Other') finalFormData.life_policy_name = finalFormData.life_policy_name_custom;
            if (finalFormData.health_provider === 'Other') finalFormData.health_provider = finalFormData.health_provider_custom;
            if (finalFormData.health_policy_name === 'Other') finalFormData.health_policy_name = finalFormData.health_policy_name_custom;

            await fetch(`${API_BASE_URL}/api/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(finalFormData)
            });
            // After saving, we can finally move to dashboard or final view
            setView('dashboard');
        } catch (error) {
            console.error("Failed to save safety net", error);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: "Start", icon: <Sparkles className="w-5 h-5" /> },
        { id: 2, title: "Life", icon: <Heart className="w-5 h-5" /> },
        { id: 3, title: "Career", icon: <Briefcase className="w-5 h-5" /> },
        { id: 4, title: "Reality", icon: <Briefcase className="w-5 h-5" /> },
        { id: 5, title: "Health", icon: <Sparkles className="w-5 h-5" /> },
        { id: 6, title: "Coverage", icon: <Shield className="w-5 h-5" /> },
        { id: 7, title: "Gaps", icon: <Check className="w-5 h-5" /> },
        { id: 8, title: "History", icon: <Briefcase className="w-5 h-5" /> },
        { id: 9, title: "Match", icon: <Sparkles className="w-5 h-5" /> }
    ];

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent mb-4"></div>
                <p className="text-slate-400 font-medium">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            {/* Progress Header */}
            <div className="mb-6 md:mb-10">
                {/* Desktop Stepper (Icon-based) */}
                <div className="hidden md:flex justify-between items-center relative pb-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2 rounded-full"></div>
                    {steps.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => !loading && setStep(s.id)}
                            disabled={loading}
                            className="flex flex-col items-center gap-2 relative z-10 group cursor-pointer disabled:cursor-not-allowed"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 ${step >= s.id
                                ? 'bg-brand-accent border-brand-accent text-brand-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                : 'bg-brand-dark border-white/10 text-white/40 group-hover:border-white/40'
                                }`}>
                                {step > s.id ? <Check className="w-5 h-5" /> : s.icon}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= s.id ? 'text-brand-accent' : 'text-slate-500'}`}>
                                {s.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Mobile Stepper (Compact Progress Bar) */}
                <div className="md:hidden space-y-3">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">
                            Progress: Step {step} of {steps.length}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                            {steps[step - 1].title}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `${(step / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Dashboard View */}
            {view === 'dashboard' ? (
                <div className="bg-brand-surface backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-10 shadow-2xl relative">
                    <Dashboard
                        userProfile={formData}
                        latestRecommendation={result}
                        history={history}
                        onUpdatePlan={() => { setView('wizard'); setStep(1); }}
                    />
                </div>
            ) : (
                /* Wizard Card */
                <div className="bg-brand-surface backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-10 shadow-2xl overflow-hidden relative">

                    {/* Decorative glow inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

                    <AnimatePresence mode="wait" initial={false}>
                        {step === 1 && <Step01_Splash key="step1" formData={formData} updateField={updateField} />}
                        {step === 2 && <Step02_LifeStage key="step2" formData={formData} updateField={updateField} />}
                        {step === 3 && <Step03_CareerStage key="step3" formData={formData} updateField={updateField} />}
                        {step === 4 && <Step04_FinancialReality key="step4" formData={formData} updateField={updateField} />}
                        {step === 5 && <Step05_HealthSnapshot key="step5" formData={formData} updateField={updateField} />}
                        {step === 6 && <Step06_ExistingCoverage key="step6" formData={formData} updateField={updateField} />}
                        {step === 7 && <Step05_Results key="step7" result={result} formData={formData} onAnalyzeGaps={handleNext} />}
                        {step === 8 && <Step07_ExistingPolicyDetails key="step8" formData={formData} updateField={updateField} />}
                        {step === 9 && <Step09_ProductRecommendations key="step9" formData={formData} gapResult={result} onComplete={saveSafetyNet} />}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {step < 9 && (
                        <div className="flex justify-between items-center pt-6 md:pt-8 border-t border-white/10 mt-6 md:mt-8">
                            <button
                                onClick={handleBack}
                                disabled={step === 1}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${step === 1
                                    ? 'text-white/20 cursor-not-allowed'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </button>

                            <button
                                onClick={
                                    step === 6 ? (isStepValid() ? fetchRecommendation : () => alert("Please fill mandatory fields.")) :
                                        handleNext
                                }
                                disabled={loading}
                                className="relative overflow-hidden bg-white text-brand-dark px-5 py-2.5 md:px-7 md:py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-white/20 transition-all disabled:opacity-70 disabled:cursor-wait text-sm md:text-base"
                            >
                                <span className="relative z-10 flex items-center">
                                    {loading ? 'Computing...' :
                                        (step === 1 || step === 2 || step === 3 || step === 5 || step === 9) ? 'Next' :
                                            step === 4 ? 'Continue' :
                                                step === 6 ? 'Analyze My Gaps' :
                                                    step === 7 ? 'Add Policy Details' :
                                                        step === 8 ? 'Recommend Plans' : 'Next'
                                    }
                                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
