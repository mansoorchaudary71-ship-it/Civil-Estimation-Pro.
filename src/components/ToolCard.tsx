import React, { useState } from "react";
import { Bookmark, BookmarkCheck, ArrowRight, Box } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const CAT_COLORS: Record<string, { c: string, glow: string }> = {
  "ROAD PAVEMENT":       { c: "#EA580C", glow: "rgba(249,115,22,0.15)" }, // Vibrant orange
  "QUANTITY ESTIMATION": { c: "#2563EB", glow: "rgba(59,130,246,0.15)" },
  "CONCRETE":            { c: "#7C3AED", glow: "rgba(139,92,246,0.15)" }, // Deep purple
  "MEP":                 { c: "#059669", glow: "rgba(16,185,129,0.15)" },
  "DEFAULT":             { c: "#6366F1", glow: "rgba(99,102,241,0.15)" }, 
};

export const getCategorySpec = (category: string) => {
  const cat = (category || "").toUpperCase();
  if (cat.includes("ROAD") || cat.includes("PAVEMENT") || cat.includes("HIGHWAY")) return CAT_COLORS["ROAD PAVEMENT"];
  if (cat.includes("QUANTITY") || cat.includes("ESTIMATION") || cat.includes("ANALYSIS")) return CAT_COLORS["QUANTITY ESTIMATION"];
  if (cat.includes("CONCRETE") || cat.includes("STRUCTURE") || cat.includes("MASONRY") || cat.includes("DESIGN")) return CAT_COLORS["CONCRETE"];
  if (cat.includes("MEP") || cat.includes("ENERGY") || cat.includes("WATER") || cat.includes("PLUMBING")) return CAT_COLORS["MEP"];
  return CAT_COLORS["DEFAULT"];
};

const LEVEL_MAP: Record<number, string> = { 1: "Basic", 2: "Moderate", 3: "Advanced" };

function Dots({ level, color }: { level: number; color: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <span key={i} 
          className="block w-[5px] h-[5px] rounded-full"
          style={{ background: i <= level ? color : "rgba(156,163,175,0.4)" }} 
        />
      ))}
    </span>
  );
}

export default function ToolCard({
  mod,
  onSelect,
}: {
  mod: any;
  onSelect: (id: string) => void;
}) {
  const { settings, updateSettings } = useSettings();
  const [hov, setHov] = useState(false);

  if (!mod) return null;

  const cfg = getCategorySpec(mod.category);
  const favoriteTools = settings?.favoriteTools || [];
  const saved = favoriteTools.includes(mod.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      updateSettings({ favoriteTools: favoriteTools.filter((id) => id !== mod.id) });
    } else {
      updateSettings({ favoriteTools: [...favoriteTools, mod.id] });
    }
  };

  const IconComponent = mod.icon || Box;
  const level = mod.level || ((mod.id.length % 3) + 1);

  return (
    <motion.div
      onClick={() => onSelect(mod.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        opacity: { duration: 0.3 }
      }}
      className={cn(
        "relative w-full flex flex-col font-sans overflow-hidden cursor-pointer",
        "bg-white/90 backdrop-blur-md dark:bg-slate-900/90",
        "rounded-[28px]",
        "border border-white/60 dark:border-slate-700/50",
        "p-6 md:p-8 gap-4 transition-all duration-300",
        hov ? "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/5 -translate-y-1" : "shadow-sm hover:shadow-lg"
      )}
    >
      <div 
        className="absolute -top-5 -right-5 w-24 h-24 rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          background: cfg.c, 
          opacity: hov ? 0.08 : 0.03,
          filter: "blur(30px)",
        }} 
      />

      <div className="flex items-start justify-between">
        <div 
          className="w-12 h-12 rounded-[14px] flex items-center justify-center transition-colors duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-sm"
        >
          <motion.div
             animate={{ scale: hov ? 1.1 : 1, rotate: hov ? [0, -5, 5, 0] : 0 }}
             transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <IconComponent size={24} className="text-slate-800 dark:text-slate-100" strokeWidth={1.75} />
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-medium tracking-widest text-slate-400">
            {mod.id?.slice(0, 2).toUpperCase() || "01"}
          </span>
          <button onClick={toggleFavorite}
            className="w-full w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 dark:hover:bg-slate-800 transition-colors -mr-2 -mt-2 active:scale-95 hover:-translate-y-0.5 hover:shadow-lg shadow-sm overflow-hidden"
            aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              {saved ? <BookmarkCheck size={20} color={cfg.c} /> : <Bookmark size={20} className="text-slate-400 dark:text-slate-500" strokeWidth={2.5} />}
            </motion.div>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[17px] md:text-[18px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {mod.title}
          </h3>
          {mod.isNew && (
            <span 
              className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shrink-0"
              style={{
                color: "#FFFFFF", 
                background: cfg.c,
              }}
            >
              NEW
            </span>
          )}
        </div>
        
        <p className="text-[14px] md:text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {mod.desc || "No description available."}
        </p>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <Dots level={level} color={cfg.c} />
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{LEVEL_MAP[level] || "Moderate"}</span>
        </div>
        <button className="text-[13px] font-bold flex items-center gap-2 px-5 h-9 rounded-full transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 hover:-translate-y-0.5"
        >
          Open 
          <motion.div animate={{ x: hov ? 4 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
             <ArrowRight size={16} strokeWidth={2.5} />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}

