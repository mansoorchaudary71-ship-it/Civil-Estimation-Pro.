import React, { useState } from "react";
import { Bookmark, BookmarkCheck, Box } from "lucide-react";
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
  categoryColor,
}: {
  mod: any;
  onSelect: (id: string) => void;
  categoryColor?: string;
}) {
  const { settings, updateSettings } = useSettings();
  const [hov, setHov] = useState(false);

  if (!mod) return null;

  const cfg = getCategorySpec(mod.category);
  const glowColor = categoryColor || cfg.glow;
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
        "rounded-[24px]",
        "border border-gray-100 dark:border-slate-800",
        "transition-all duration-300",
        hov ? "shadow-xl -translate-y-1 scale-[1.02]" : "shadow-sm"
      )}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 bg-white dark:bg-slate-900 pointer-events-none" />

      {/* The Knockout Gradient */}
      <div 
        className={cn(
          "absolute top-3 left-3 right-3 bottom-3 pointer-events-none dark:hidden transition-opacity duration-500 rounded-[20px]",
          hov && "animate-pulse-slow"
        )}
        style={{ 
          background: `radial-gradient(circle at 0% 0%, ${glowColor} 0%, rgba(255,255,255,0) 65%)`,
          opacity: hov ? 1 : 0.8
        }} 
      />
      <div 
        className={cn(
          "absolute top-3 left-3 right-3 bottom-3 pointer-events-none hidden dark:block transition-opacity duration-500 rounded-[20px]",
          hov && "animate-pulse-slow"
        )}
        style={{ 
          background: `radial-gradient(circle at 0% 0%, ${glowColor} 0%, rgba(15,23,42,0) 65%)`,
          opacity: hov ? 1 : 0.8
        }} 
      />

      {/* Dynamic Pulsing Glow / Shimmer on Hover */}
      <motion.div
        className="absolute top-3 left-3 right-3 bottom-3 pointer-events-none mix-blend-overlay rounded-[20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: hov ? [0.1, 0.5, 0.1] : 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${glowColor} 50%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div 
            className="w-10 h-10 flex items-start justify-start pt-1 pl-1 transition-colors duration-300"
          >
            <motion.div
               animate={{ scale: hov ? 1.1 : 1, rotate: hov ? [0, -5, 5, 0] : 0 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <IconComponent size={32} className={hov ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"} strokeWidth={1.5} />
            </motion.div>
          </div>
          
          <div className="flex items-center gap-2">
            {mod.isNew && (
              <span 
                className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full shrink-0 uppercase"
                style={{
                  color: cfg.c, 
                  backgroundColor: `${cfg.c}15`,
                }}
              >
                NEW
              </span>
            )}
            <button onClick={toggleFavorite}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
              aria-label={saved ? "Remove from favorites" : "Add to favorites"}
            >
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                {saved ? <BookmarkCheck size={18} color={cfg.c} /> : <Bookmark size={18} className="text-slate-400 dark:text-slate-500" strokeWidth={2} />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Middle */}
        <div className="mt-6 flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">
            {mod.title}
          </h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 leading-relaxed line-clamp-2">
            {mod.desc || "No description available."}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Dots level={level} color={cfg.c} />
            <span className="text-[10px] tracking-widest font-semibold text-gray-400 uppercase">
              {LEVEL_MAP[level] || "Moderate"}
            </span>
          </div>
          <button 
            className="rounded-full px-5 py-1.5 text-sm font-semibold tracking-wider text-slate-800 uppercase transition-transform active:scale-95"
            style={{ backgroundColor: glowColor }}
          >
            OPEN
          </button>
        </div>
      </div>
    </motion.div>
  );
}

