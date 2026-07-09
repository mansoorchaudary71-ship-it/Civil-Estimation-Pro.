const fs = require('fs');
const file = 'src/components/ToolCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace('import React, { useState } from "react";', 'import React, { useState, useRef, useEffect } from "react";\nimport { createPortal } from "react-dom";\nimport { AnimatePresence } from "motion/react";');
content = content.replace('import { Bookmark, BookmarkCheck, ArrowRight, Box } from "lucide-react";', 'import { Bookmark, BookmarkCheck, ArrowRight, Box, Target, Clock, Zap, X } from "lucide-react";');

// Replace standard state setup
const hookTarget = `  const { settings, updateSettings } = useSettings();
  const [hov, setHov] = useState(false);

  if (!mod) return null;`;

const hookReplace = `  const { settings, updateSettings } = useSettings();
  const [hov, setHov] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  if (!mod) return null;`;

content = content.replace(hookTarget, hookReplace);

// Replace hover handlers
const hoverTarget = `      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}`;

const hoverReplace = `      onMouseEnter={() => {
        setHov(true);
        hoverTimeout.current = setTimeout(() => {
          setShowQuickView(true);
        }, 500);
      }}
      onMouseLeave={() => {
        setHov(false);
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      }}`;

content = content.replace(hoverTarget, hoverReplace);

// Inject the Quick View Modal at the end of the return statement
const returnTarget = `    </motion.div>
  );
}`;

const modalCode = `      <AnimatePresence>
        {showQuickView && createPortal(
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(false);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div 
                className="h-32 p-6 flex justify-between items-start"
                style={{
                  backgroundImage: \`radial-gradient(circle at top right, \${colorToUse} 0%, rgba(255,255,255,0) 70%)\`,
                  backgroundColor: '#f8fafc'
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  <IconComponent size={32} className="text-slate-800" />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickView(false);
                  }}
                  className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="p-6 -mt-4 relative bg-white rounded-t-3xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold tracking-wider uppercase" style={{ color: cfg.c }}>
                    {mod.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Dots level={level} color={cfg.c} />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {LEVEL_MAP[level]}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{mod.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {mod.desc || "No description available for this tool."}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100/50 text-indigo-600">
                      <Target size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Accuracy</p>
                      <p className="text-sm font-bold text-slate-700">98.5%</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100/50 text-emerald-600">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Time Saved</p>
                      <p className="text-sm font-bold text-slate-700">~15 mins</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100/50 text-amber-600">
                      <Zap size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Usage</p>
                      <p className="text-sm font-bold text-slate-700">High</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100/50 text-blue-600">
                      <Bookmark size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Saves</p>
                      <p className="text-sm font-bold text-slate-700">1.2k+</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickView(false);
                      onSelect(mod.id);
                    }}
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Open Tool <ArrowRight size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(e);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-600"
                  >
                    {saved ? <BookmarkCheck size={20} color={cfg.c} /> : <Bookmark size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </motion.div>
  );
}`;

content = content.replace(returnTarget, modalCode);

fs.writeFileSync(file, content);
console.log("Patched ToolCard quick view");
