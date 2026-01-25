import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Heart, Shield, ArrowLeft, ArrowRight, TrendingUp, Info } from 'lucide-react';

const STEPS = {
    UPLOAD: 'UPLOAD',
    EXTRACTING: 'EXTRACTING',
    REVIEW: 'REVIEW',
    MISSING_INFO: 'MISSING_INFO',
    REPORT: 'REPORT'
};

export default function ReverseGapFlow({ onBack }) {
    const [step, setStep] = useState(STEPS.UPLOAD);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({
        first_name: '',
        dob: '',
        gender: '',
        city: '',
        income_level: '',
        smoking_status: 'Never',
        marital_status: 'Single',
        lifestyle: 'Sedentary',
        career_stage: 'Starting Out',
        num_children: 0,
        support_parents: false
    });
    const [idealRec, setIdealRec] = useState(null);
    const [extractionSummary, setExtractionSummary] = useState({
        total_life: 0,
        total_health: 0,
        policy_count: 0
    });

    const token = localStorage.getItem('auth_token');
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const API_BASE_URL = rawBaseUrl.startsWith('http') ? rawBaseUrl : `https://${rawBaseUrl}`;

    useEffect(() => {
        // Pre-fetch profile if it exists
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setStep(STEPS.EXTRACTING);
        setLoading(true);
        setError(null);

        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        try {
            const response = await fetch(`${API_BASE_URL}/api/policy/extract-multiple`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error('Extraction failed');

            const data = await response.json();
            setResults(data.results);

            // Calculate totals
            let life = 0;
            let health = 0;
            data.results.forEach(r => {
                if (r.is_valid_policy) {
                    if (r.policy_type === 'LIFE') {
                        life += r.coverage_amount_val;
                    } else if (r.policy_type === 'HEALTH') {
                        health += r.coverage_amount_val;
                    }
                }
            });
            setExtractionSummary({
                total_life: life,
                total_health: health,
                policy_count: data.success_count
            });

            // Update profile with hints if found
            if (data.aggregated_profile) {
                const hints = data.aggregated_profile;
                const updatedProfile = {
                    ...profile,
                    first_name: hints.full_name || profile.first_name,
                    dob: hints.dob || profile.dob,
                    gender: hints.gender || profile.gender,
                    city: hints.city || profile.city
                };
                setProfile(updatedProfile);

                // Sync with DB
                await fetch(`${API_BASE_URL}/api/user/sync-profile`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: updatedProfile.first_name,
                        dob: updatedProfile.dob,
                        gender: updatedProfile.gender,
                        city: updatedProfile.city,
                        existing_life_cover_val: life,
                        existing_health_cover_val: health
                    })
                });
            }

            setStep(STEPS.REVIEW);
        } catch (err) {
            setError(err.message);
            setStep(STEPS.UPLOAD);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare UserData for recommend API
            // Note: We need to map our simple state to the UserData schema
            const userData = {
                ...profile,
                is_smoker: profile.smoking_status !== 'Never',
                dependents: {
                    "Spouse": profile.marital_status === 'Married',
                    "Children": profile.num_children > 0
                }
            };

            const response = await fetch(`${API_BASE_URL}/api/recommend`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error('Recommendation failed');
            const data = await response.json();
            setIdealRec(data);
            setStep(STEPS.REPORT);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => {
        if (!val) return "₹0";
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(0)} Lakh`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-8 hover:text-brand-accent transition-colors"
                style={{ color: 'var(--text-auth-muted)' }}
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <AnimatePresence mode="wait">
                {step === STEPS.UPLOAD && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-2xl mx-auto backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border shadow-2xl"
                        style={{ backgroundColor: 'var(--bg-auth-card)', borderColor: 'var(--border-auth-card)' }}
                    >
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-brand-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="w-10 h-10 text-brand-accent" />
                            </div>
                            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-auth-primary)' }}>Policy Gap Analysis</h2>
                            <p style={{ color: 'var(--text-auth-muted)' }}>Upload your current policies to see if you are adequately covered.</p>
                        </div>

                        <div className="space-y-6">
                            <label className="block p-10 border-2 border-dashed rounded-[2rem] cursor-pointer hover:bg-white/5 transition-all text-center group"
                                style={{ borderColor: 'var(--border-auth-card)' }}>
                                <input type="file" multiple onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--bg-auth-input)' }}>
                                        <FileText className="w-8 h-8 opacity-50" style={{ color: 'var(--text-auth-primary)' }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg" style={{ color: 'var(--text-auth-primary)' }}>
                                            {files.length > 0 ? `${files.length} files selected` : 'Drop Policies Here'}
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-auth-placeholder)' }}>We'll extract your coverage and profile automatically</p>
                                    </div>
                                </div>
                            </label>

                            <button
                                onClick={handleUpload}
                                disabled={loading || files.length === 0}
                                className="w-full bg-gradient-to-r from-brand-accent to-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                Start Analysis
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === STEPS.EXTRACTING && (
                    <motion.div key="extracting" className="text-center py-20">
                        <Loader2 className="w-16 h-16 text-brand-accent animate-spin mx-auto mb-8" />
                        <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-auth-primary)' }}>AI is Scanning Your Policies...</h2>
                        <p style={{ color: 'var(--text-auth-muted)' }}>We are extracting coverage amounts and policyholder details.</p>
                    </motion.div>
                )}

                {step === STEPS.REVIEW && (
                    <motion.div key="review" className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-auth-primary)' }}>We Found Your Details!</h2>
                            <p style={{ color: 'var(--text-auth-muted)' }}>We detected {extractionSummary.policy_count} valid policies.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 md:p-8 backdrop-blur-xl rounded-3xl border text-center" style={{ backgroundColor: 'var(--bg-auth-card)', borderColor: 'var(--border-auth-card)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-auth-placeholder)' }}>Current Life Cover</p>
                                <p className="text-3xl font-black text-brand-accent">{formatCurrency(extractionSummary.total_life)}</p>
                            </div>
                            <div className="p-6 md:p-8 backdrop-blur-xl rounded-3xl border text-center" style={{ backgroundColor: 'var(--bg-auth-card)', borderColor: 'var(--border-auth-card)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-auth-placeholder)' }}>Current Health Cover</p>
                                <p className="text-3xl font-black text-brand-accent">{formatCurrency(extractionSummary.total_health)}</p>
                            </div>
                            <div className="p-6 md:p-8 backdrop-blur-xl rounded-3xl border text-center" style={{ backgroundColor: 'var(--bg-auth-card)', borderColor: 'var(--border-auth-card)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-auth-placeholder)' }}>Name Detected</p>
                                <p className="text-3xl font-black" style={{ color: 'var(--text-auth-primary)' }}>{profile.first_name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex justify-center flex-col items-center gap-4">
                            <p className="text-sm opacity-70">To confirm your gap, we need a few more life details.</p>
                            <button
                                onClick={() => setStep(STEPS.MISSING_INFO)}
                                className="px-10 py-5 hover:opacity-80 rounded-2xl font-black flex items-center gap-3 transition-all"
                                style={{
                                    color: 'var(--text-auth-primary)',
                                    background: 'var(--bg-auth-input)',
                                    border: '1px solid var(--border-auth-card)'
                                }}
                            >
                                Complete My Profile <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === STEPS.MISSING_INFO && (
                    <motion.div key="form"
                        className="max-w-3xl mx-auto rounded-[3rem] p-10 border shadow-3xl"
                        style={{ backgroundColor: 'var(--bg-auth-card)', borderColor: 'var(--border-auth-card)' }}
                    >
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-auth-primary)' }}>Final Details</h2>
                            <p style={{ color: 'var(--text-auth-muted)' }}>These details help us calculate your ideal coverage.</p>
                        </div>

                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-2" style={{ color: 'var(--text-auth-label)' }}>Monthly Income</label>
                                <select
                                    value={profile.income_level}
                                    onChange={(e) => setProfile({ ...profile, income_level: e.target.value })}
                                    required
                                    className="w-full border rounded-2xl p-4 focus:border-brand-accent outline-none font-bold transition-colors"
                                    style={{ backgroundColor: 'var(--bg-auth-input)', borderColor: 'var(--border-auth-card)', color: 'var(--text-auth-primary)' }}
                                >
                                    <option value="">Select Range</option>
                                    <option value="Below 5 Lakhs">Below ₹5 Lakhs</option>
                                    <option value="5-10 Lakhs">₹5 - ₹10 Lakhs</option>
                                    <option value="10-25 Lakhs">₹10 - ₹25 Lakhs</option>
                                    <option value="25-50 Lakhs">₹25 - ₹50 Lakhs</option>
                                    <option value="Above 50 Lakhs">Above ₹50 Lakhs</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-2" style={{ color: 'var(--text-auth-label)' }}>Do you Smoke?</label>
                                <select
                                    value={profile.smoking_status}
                                    onChange={(e) => setProfile({ ...profile, smoking_status: e.target.value })}
                                    className="w-full border rounded-2xl p-4 focus:border-brand-accent outline-none font-bold transition-colors"
                                    style={{ backgroundColor: 'var(--bg-auth-input)', borderColor: 'var(--border-auth-card)', color: 'var(--text-auth-primary)' }}
                                >
                                    <option value="Never">Never</option>
                                    <option value="Occasionally">Occasionally</option>
                                    <option value="Regularly">Regularly</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-2" style={{ color: 'var(--text-auth-label)' }}>Lifestyle</label>
                                <select
                                    value={profile.lifestyle}
                                    onChange={(e) => setProfile({ ...profile, lifestyle: e.target.value })}
                                    className="w-full border rounded-2xl p-4 focus:border-brand-accent outline-none font-bold transition-colors"
                                    style={{ backgroundColor: 'var(--bg-auth-input)', borderColor: 'var(--border-auth-card)', color: 'var(--text-auth-primary)' }}
                                >
                                    <option value="Sedentary">Sedentary (Office Work)</option>
                                    <option value="Active">Active (Exercise/Field Work)</option>
                                    <option value="Extreme">Extreme (Physical/Adventure)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-2" style={{ color: 'var(--text-auth-label)' }}>Number of Children</label>
                                <input
                                    type="number"
                                    value={profile.num_children}
                                    onChange={(e) => setProfile({ ...profile, num_children: parseInt(e.target.value) || 0 })}
                                    className="w-full border rounded-2xl p-4 focus:border-brand-accent outline-none font-bold transition-colors"
                                    style={{ backgroundColor: 'var(--bg-auth-input)', borderColor: 'var(--border-auth-card)', color: 'var(--text-auth-primary)' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="md:col-span-2 mt-4 bg-gradient-to-r from-brand-accent to-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 transition-all"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Compare My Coverage'}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === STEPS.REPORT && idealRec && (
                    <motion.div key="report" className="space-y-10">
                        <div className="text-center">
                            <h2 className="text-4xl font-black mb-2" style={{ color: 'var(--text-auth-primary)' }}>Your Gap Report</h2>
                            <p style={{ color: 'var(--text-auth-muted)' }}>Powered by Gemini 1.5 Analysis</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Life Gap Card */}
                            <div className="backdrop-blur-xl rounded-[2.5rem] p-10 border border-brand-accent/30 bg-brand-accent/5 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Heart className="w-32 h-32" />
                                </div>
                                <h3 className="text-xl font-black mb-10 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-brand-accent" /> Life Coverage Analysis
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-bold opacity-60">Ideal Need</p>
                                        <p className="text-2xl font-black">{idealRec.life_cover}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-bold opacity-60">Your Current</p>
                                        <p className="text-2xl font-bold opacity-60">{formatCurrency(extractionSummary.total_life)}</p>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (extractionSummary.total_life / idealRec.life_cover_val) * 100)}%` }}
                                            className="h-full bg-brand-accent"
                                        />
                                    </div>

                                    {extractionSummary.total_life < idealRec.life_cover_val ? (
                                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                            <p className="text-red-400 font-bold mb-1 uppercase tracking-widest text-[10px]">Gap Detected</p>
                                            <p className="text-2xl font-black text-red-500">{formatCurrency(idealRec.life_cover_val - extractionSummary.total_life)} Missing</p>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                            <p className="text-green-400 font-bold mb-1 uppercase tracking-widest text-[10px]">Fully Covered</p>
                                            <p className="text-2xl font-black text-green-500">You are safe!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Health Gap Card */}
                            <div className="backdrop-blur-xl rounded-[2.5rem] p-10 border border-indigo-500/30 bg-indigo-500/5 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Shield className="w-32 h-32" />
                                </div>
                                <h3 className="text-xl font-black mb-10 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-indigo-400" /> Health Coverage Analysis
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-bold opacity-60">Ideal Need</p>
                                        <p className="text-2xl font-black">{idealRec.health_cover}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-bold opacity-60">Your Current</p>
                                        <p className="text-2xl font-bold opacity-60">{formatCurrency(extractionSummary.total_health)}</p>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (extractionSummary.total_health / idealRec.health_cover_val) * 100)}%` }}
                                            className="h-full bg-indigo-400"
                                        />
                                    </div>

                                    {extractionSummary.total_health < idealRec.health_cover_val ? (
                                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                            <p className="text-red-400 font-bold mb-1 uppercase tracking-widest text-[10px]">Gap Detected</p>
                                            <p className="text-2xl font-black text-red-500">{formatCurrency(idealRec.health_cover_val - extractionSummary.total_health)} Missing</p>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                            <p className="text-green-400 font-bold mb-1 uppercase tracking-widest text-[10px]">Fully Covered</p>
                                            <p className="text-2xl font-black text-green-500">You are safe!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="backdrop-blur-xl rounded-[2rem] p-8 border" style={{ backgroundColor: 'var(--bg-auth-card)', borderColor: 'var(--border-auth-card)' }}>
                            <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-brand-accent" /> AI Advice
                            </h4>
                            <p className="leading-relaxed font-medium" style={{ color: 'var(--text-auth-primary)' }}>{idealRec.summary}</p>
                            <p className="mt-4 text-sm italic" style={{ color: 'var(--text-auth-muted)' }}>{idealRec.reasoning}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
