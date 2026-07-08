const fs = require('fs');
let content = fs.readFileSync('src/components/TopNavbar.tsx', 'utf8');

const importAuth = `import { useAuth } from "../contexts/AuthContext";\nimport { User } from "lucide-react";`;
content = content.replace('import { useSettings } from "../context/SettingsContext";', 'import { useSettings } from "../context/SettingsContext";\n' + importAuth);

const userAuthHook = `  const { settings, toggleTheme } = useSettings();\n  const { user } = useAuth();`;
content = content.replace('  const { settings, toggleTheme } = useSettings();', userAuthHook);

const authButton = `          <button className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all duration-300 active:scale-95 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] shadow-sm group overflow-hidden"
            onClick={() => user ? (onOpenProfile && onOpenProfile()) : (onOpenAuth && onOpenAuth())}
            aria-label="User Profile"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/0 via-slate-100/50 dark:via-slate-700/50 to-slate-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <User className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300" />
          </button>`;

content = content.replace('          <button className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all duration-300 active:scale-95 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] shadow-sm group overflow-hidden"\n            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}', authButton + '\n          <button className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all duration-300 active:scale-95 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] shadow-sm group overflow-hidden"\n            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}');

fs.writeFileSync('src/components/TopNavbar.tsx', content);
