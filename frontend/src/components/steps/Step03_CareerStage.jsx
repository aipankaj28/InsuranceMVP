import StepWrapper from './StepWrapper';
import { Rocket, TrendingUp, Trophy, Target } from 'lucide-react';

export default function Step03_CareerStage({ formData, updateField }) {
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
        <StepWrapper className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Your work fuels more than just your career</h2>
                <p className="text-slate-400">It supports your family's present and your parents' comfort.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {stages.map(stage => (
                    <button
                        key={stage.id}
                        onClick={() => updateField('career_stage', stage.id)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-300 group ${formData.career_stage === stage.id ? 'bg-brand-accent/10 border-brand-accent ring-1 ring-brand-accent/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-lg font-black transition-colors ${formData.career_stage === stage.id ? 'text-white' : 'text-slate-200'}`}>
                                {stage.title}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stage.exp}</span>
                        </div>
                        <p className={`text-sm leading-relaxed transition-colors ${formData.career_stage === stage.id ? 'text-slate-300' : 'text-slate-500'}`}>
                            {stage.desc}
                        </p>
                    </button>
                ))}
            </div>

            <div className="text-center pt-4 opacity-50">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">This helps us understand your protection milestones</p>
            </div>
        </StepWrapper>
    );
}
