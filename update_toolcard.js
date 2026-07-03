const fs = require('fs');

let content = fs.readFileSync('src/components/ToolCard.tsx', 'utf8');

// Replace standard bg with glass effect
content = content.replace(
    /"bg-white dark:bg-slate-900",\s*"rounded-\[28px\]",\s*"border border-slate-200\/80 dark:border-slate-800",/g,
    `"bg-white/80 backdrop-blur-xl dark:bg-slate-900/80",
        "rounded-[28px]",
        "border border-white/60 dark:border-slate-700/50",`
);

// Update shadow
content = content.replace(
    /hov \? "shadow-\[0_20px_40px_-15px_rgba\(0,0,0,0\.1\)\] ring-1 ring-slate-900\/5 -translate-y-1" : "shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] hover:shadow-xl"/g,
    `hov ? "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 -translate-y-1" : "shadow-sm hover:shadow-xl"`
);

fs.writeFileSync('src/components/ToolCard.tsx', content);
