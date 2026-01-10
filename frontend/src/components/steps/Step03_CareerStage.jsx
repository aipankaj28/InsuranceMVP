import { useState, useEffect } from 'react';
import StepWrapper from './StepWrapper';
import { Rocket, TrendingUp, Trophy, Target } from 'lucide-react';

export default function Step03_CareerStage({ formData, updateField }) {
    useEffect(() => {
        if (formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            let autoStage = "";
            if (age >= 21 && age <= 24) autoStage = "Launch Pad";
            else if (age >= 25 && age <= 32) autoStage = "Growth Gear";
            else if (age >= 33 && age <= 39) autoStage = "Peak Performer";
            else if (age >= 40) autoStage = "Legacy Builder";

            if (autoStage) {
                updateField('career_stage', autoStage);
            }
        }
    }, [formData.dob]);

    const stages = [
        {
            id: 'Launch Pad',
            title: '🚀 Launch Pad',
            exp: '0-3 years experience',
            desc: 'Building foundation, paying off student loans, starting to save',
            color: 'blue'
        },
        {
            id: 'Growth Gear',
            title: '📈 Growth Gear',
            exp: '4-8 years experience',
            desc: 'Growing income, possibly married, planning for home/kids',
            color: 'emerald'
        },
        {
            id: 'Peak Performer',
            title: '🏆 Peak Performer',
            exp: '9-15 years experience',
            desc: "Leadership role, maximum earning years, children's education planning",
            color: 'amber'
        },
        {
            id: 'Legacy Builder',
            title: '🎯 Legacy Builder',
            exp: '15+ years experience',
            desc: 'Planning retirement, children\'s higher education, wealth preservation',
            color: 'brand-accent'
        }
    ];

    return (
        <StepWrapper className="space-y-6 md:space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-auth-primary)' }}>Your work fuels more than just your career</h2>
                <p className="text-sm md:text-base" style={{ color: 'var(--text-auth-muted)' }}>It supports your family's present and your parents' comfort.</p>
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-3">
                {stages.map(stage => (
                    <button
                        key={stage.id}
                        onClick={() => updateField('career_stage', stage.id)}
                        className={`text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 group ${
                            formData.career_stage === stage.id 
                                ? 'bg-brand-accent/10 border-brand-accent ring-1 ring-brand-accent/50' 
                                : 'hover:bg-opacity-10'
                        }`}
                        style={formData.career_stage !== stage.id ? {
                            backgroundColor: 'var(--bg-auth-input)',
                            borderColor: 'var(--border-auth-card)'
                        } : {}}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-lg font-black transition-colors ${
                                formData.career_stage === stage.id 
                                    ? '' 
                                    : ''
                            }`} style={{ 
                                color: formData.career_stage === stage.id 
                                    ? 'var(--text-auth-primary)' 
                                    : 'var(--text-auth-primary)' 
                            }}>
                                {stage.title}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-auth-placeholder)' }}>{stage.exp}</span>
                        </div>
                        <p className={`text-sm leading-relaxed transition-colors`} style={{ 
                            color: formData.career_stage === stage.id 
                                ? 'var(--text-auth-label)' 
                                : 'var(--text-auth-muted)' 
                        }}>
                            {stage.desc}
                        </p>
                    </button>
                ))}
            </div>
        </StepWrapper>
    );
}
