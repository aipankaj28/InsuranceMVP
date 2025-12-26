import StepWrapper from './StepWrapper';

export default function Step03_Health101() {
    return (
        <StepWrapper className="space-y-6 text-center">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                <span className="text-6xl">🏥</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Keep your kidneys!</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
                Medical bills are scarier than your browser history.
                <br /><br />
                <span className="text-brand-primary font-bold">Health Insurance</span> ensures you don't have to sell a kidney just to save the other one. It's like a cheat code for expensive hospitals.
            </p>
        </StepWrapper>
    );
}
