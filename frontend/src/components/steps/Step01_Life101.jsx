import StepWrapper from './StepWrapper';

export default function Step01_Life101() {
    return (
        <StepWrapper className="space-y-6 text-center">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                <span className="text-6xl">👻</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Don't be a ghost!</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
                Imagine becoming a ghost and watching your family argue about who pays the Netflix bill.
                <br /><br />
                <span className="text-brand-accent font-bold">Life Insurance</span> makes sure they miss you for your jokes, not your wallet. It's the ultimate "my bad for dying" apology gift.
            </p>
        </StepWrapper>
    );
}
