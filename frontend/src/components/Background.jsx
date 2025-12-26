export default function Background() {
    return (
        <div className="fixed inset-0 min-h-screen overflow-hidden -z-50 pointer-events-none">
            {/* Dark Gradient Base */}
            <div className="absolute inset-0 bg-brand-dark" />

            {/* Abstract Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[100px]" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>
    );
}
