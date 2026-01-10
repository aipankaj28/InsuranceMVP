import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 md:p-3 rounded-full border transition-all duration-300 shadow-xl backdrop-blur-md ${
                theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    : 'bg-black/5 border-black/10 text-slate-600 hover:text-black hover:bg-black/10'
            } ${className}`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-4 h-4 md:w-6 md:h-6" />
            ) : (
                <Moon className="w-4 h-4 md:w-6 md:h-6" />
            )}
        </button>
    );
}