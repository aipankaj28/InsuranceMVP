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
        gender: "" // Default
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
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/api/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
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

    const steps = [
        { id: 1, title: "Start", icon: <User className="w-5 h-5" /> },
        { id: 2, title: "Life", icon: <Heart className="w-5 h-5" /> },
        { id: 3, title: "Career", icon: <Briefcase className="w-5 h-5" /> },
        { id: 4, title: "Finance", icon: <Shield className="w-5 h-5" /> },
        { id: 5, title: "Health", icon: <Sparkles className="w-5 h-5" /> },
        { id: 6, title: "Result", icon: <Check className="w-5 h-5" /> }
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
            <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -z-10 -translate-y-1/2 rounded-full"></div>
                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 group">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.id
                                ? 'bg-brand-accent border-brand-accent text-brand-dark shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                : 'bg-brand-dark border-white/20 text-white/40'
                                }`}
                        >
                            {step > s.id ? <Check className="w-6 h-6" /> : s.icon}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${step >= s.id ? 'text-brand-accent' : 'text-white/40'}`}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Dashboard View */}
            {view === 'dashboard' ? (
                <div className="bg-brand-surface backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
                    <Dashboard
                        userProfile={formData}
                        latestRecommendation={result}
                        history={history}
                        onUpdatePlan={() => setView('wizard')}
                    />
                </div>
            ) : (
                /* Wizard Card */
                <div className="bg-brand-surface backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden relative">

                    {/* Decorative glow inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

                    <AnimatePresence mode="wait" initial={false}>
                        {step === 1 && <Step01_Splash key="step1" formData={formData} updateField={updateField} />}
                        {step === 2 && <Step02_LifeStage key="step2" formData={formData} updateField={updateField} />}
                        {step === 3 && <Step03_CareerStage key="step3" formData={formData} updateField={updateField} />}
                        {step === 4 && <Step04_FinancialReality key="step4" formData={formData} updateField={updateField} />}
                        {step === 5 && <Step05_HealthSnapshot key="step5" formData={formData} updateField={updateField} />}
                        {step === 6 && <Step05_Results key="step6" result={result} />}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {step < 6 && (
                        <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8">
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
                                onClick={step === 5 ? (isStepValid() ? fetchRecommendation : () => alert("Please fill mandatory fields.")) : handleNext}
                                disabled={loading}
                                className={`
                                    relative overflow-hidden bg-white text-brand-dark px-8 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-white/20 transition-all disabled:opacity-70 disabled:cursor-wait
                                `}
                            >
                                <span className="relative z-10 flex items-center">
                                    {loading ? 'Computing...' : (
                                        step === 1 ? 'Begin my protection story' :
                                            step === 2 ? 'Continue my story' :
                                                step === 3 ? 'Next' :
                                                    step === 4 ? 'Continue' :
                                                        step === 5 ? 'See my protection needs' : 'Next'
                                    )}
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
