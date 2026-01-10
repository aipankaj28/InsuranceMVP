import { useTheme } from '../context/ThemeContext';

export default function Background() {
    const { theme } = useTheme();
    
    return (
        <div className="fixed inset-0 min-h-screen overflow-hidden -z-50 pointer-events-none">
            {/* Theme-aware Gradient Base */}
            <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-auth-main)' }} />

            {/* Abstract Orbs - adjusted for theme */}
            <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse ${
                theme === 'dark' 
                    ? 'bg-brand-primary/20' 
                    : 'bg-brand-primary/10'
            }`} />
            <div className={`absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] ${
                theme === 'dark' 
                    ? 'bg-brand-accent/10' 
                    : 'bg-brand-accent/5'
            }`} />

            {/* Grid Pattern Overlay - adjusted opacity for theme */}
            <div className={`absolute inset-0 bg-[url('/grid.svg')] ${
                theme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.02]'
            }`} />
        </div>
    );
}
