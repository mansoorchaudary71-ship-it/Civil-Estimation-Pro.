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
  const colorToUse = categoryColor || cfg.glow;
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
        "w-full flex flex-col font-sans cursor-pointer transition-all duration-300",
        "bg-white relative overflow-hidden rounded-[1.5rem] ring-1 ring-gray-900/5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]",
        hov ? "shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] -translate-y-1.5 scale-[1.02]" : ""
      )}
      style={{
        backgroundImage: `radial-gradient(circle at 0% 0%, ${colorToUse === '#F4F1EA' ? '#EAE0CC' : colorToUse === '#F0F5FF' ? '#E0E7FF' : colorToUse === '#D9E6DD' ? '#C4D6C9' : colorToUse} 0%, ${colorToUse} 25%, rgba(255,255,255,0) 75%)`
      }}
    >
      {/* Top-left fading white border highlight */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[1.5rem]" 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 0) 50%)',
          padding: '14px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }} 
      />
      <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
        <div className="flex items-start justify-between min-h-[40px]">
          <motion.div 
            animate={{ scale: hov ? 1.1 : 1, rotate: hov ? [0, -5, 5, 0] : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-4"
          >
            <IconComponent size={40} className="text-slate-800" strokeWidth={2.5} />
          </motion.div>
          
          <div className="flex items-center gap-3">
            {mod.isNew && (
              <span 
                className={cn(
                  "text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-xl shrink-0",
                  colorToUse === '#F4F1EA' ? "bg-[#EBE4D5] text-[#6B6353]" :
                  colorToUse === '#F0F5FF' ? "bg-[#E0E7FF] text-[#4F46E5]" :
                  colorToUse === '#D9E6DD' ? "bg-[#D1FAE5] text-[#059669]" :
                  "bg-blue-50 text-blue-600"
                )}
              >
                NEW
              </span>
            )}
            <button onClick={toggleFavorite}
              className="flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors active:scale-95"
              aria-label={saved ? "Remove from favorites" : "Add to favorites"}
            >
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="p-1">
                {saved ? <BookmarkCheck size={20} color={cfg.c} /> : <Bookmark size={20} className="text-gray-400" strokeWidth={1.5} />}
              </motion.div>
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-2">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {mod.title}
          </h3>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-2">
            {mod.desc || "No description available."}
          </p>
        </div>

        <div className="mt-auto pt-6 flex items-end justify-between">
          <div className="flex flex-col items-start gap-1">
            <Dots level={level} color={cfg.c} />
            <span className="text-[10px] tracking-widest font-semibold text-gray-400 mt-1 uppercase">
              {LEVEL_MAP[level] || "Moderate"}
            </span>
          </div>
          <button 
            className={cn(
              "text-slate-800 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-95",
              colorToUse === '#F4F1EA' ? "bg-[#E5DFD3] hover:bg-[#D5CDBF]" :
              colorToUse === '#F0F5FF' ? "bg-[#D9DDF0] hover:bg-[#C4C9E6]" :
              colorToUse === '#D9E6DD' ? "bg-[#D9E6DD] hover:bg-[#C4D6C9]" :
              "bg-[#E2E8F4] hover:bg-[#D4DDF0]"
            )}
          >
            OPEN
          </button>
        </div>
      </div>
    </motion.div>
  );
}

