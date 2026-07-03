const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// Container
content = content.replace(
  'className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#FAFAFA]"',
  'className="relative w-full pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-900"'
);

// Add the background image
content = content.replace(
  '{/* Abstract Decorative Background Elements */}',
  `{/* High-Contrast Photographic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
      {/* Abstract Decorative Background Elements */}`
);

// Update text colors
content = content.replace(
  'className="font-semibold text-blue-600 tracking-wide uppercase"',
  'className="font-semibold text-amber-400 tracking-wide uppercase drop-shadow-sm"'
);

content = content.replace(
  'className="mb-6 leading-tight text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight"',
  'className="mb-6 leading-tight text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg"'
);

content = content.replace(
  'className="mb-8 text-lg md:text-xl font-normal text-slate-600 leading-relaxed"',
  'className="mb-8 text-lg md:text-xl font-medium text-slate-200 leading-relaxed drop-shadow-md max-w-3xl mx-auto"'
);

// Update buttons
content = content.replace(
  'className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] md:text-base flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:scale-95"',
  'className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-[15px] md:text-base flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_12px_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:scale-95"'
);

content = content.replace(
  'className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-semibold text-[15px] md:text-base flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"',
  'className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-[15px] md:text-base flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"'
);

// Footer text
content = content.replace(
  'className="mb-6 text-base font-normal text-slate-600 leading-relaxed"',
  'className="mb-6 text-base font-medium text-slate-300 leading-relaxed"'
);
content = content.replace(
  'text-slate-800',
  'text-white'
);
content = content.replace(
  'text-slate-800',
  'text-white'
);
content = content.replace(
  'text-slate-800',
  'text-white'
);
content = content.replace(
  'text-slate-800',
  'text-white'
);

fs.writeFileSync('src/components/HeroSection.tsx', content);
