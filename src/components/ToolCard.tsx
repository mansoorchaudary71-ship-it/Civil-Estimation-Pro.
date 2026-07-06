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
        "relative w-full flex flex-col font-sans overflow-hidden cursor-pointer",
        "rounded-[24px] rounded-tl-[48px]",
        "border border-gray-100",
        "transition-all duration-300",
        hov ? "shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)] -translate-y-1" : "shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)]"
      )}
      style={{ 
        background: `radial-gradient(circle at 0% 0%, ${colorToUse} 0%, rgba(255,255,255,0) 45%), linear-gradient(135deg, #ffffff 30%, ${colorToUse} 100%)` 
      }}
    >
      <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div className="bg-gray-50/50 p-2 rounded-lg">
            <motion.div
               animate={{ scale: hov ? 1.1 : 1, rotate: hov ? [0, -5, 5, 0] : 0 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <IconComponent size={24} className="text-slate-800" strokeWidth={1.5} />
            </motion.div>
          </div>
          <div className="flex items-center gap-3">
            {mod.isNew && (
              <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 shrink-0">
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

        <div className="flex flex-col mt-6">
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
            className="text-slate-800 rounded-full px-7 py-3 text-sm font-bold tracking-wide uppercase transition-all duration-300 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: colorToUse === '#F4F1EA' ? '#EBE4D5' : colorToUse === '#F0F5FF' ? '#DFE9FC' : colorToUse === '#EFF6F1' ? '#E1EFE4' : colorToUse === '#f8fafc' ? '#f1f5f9' : colorToUse }}
          >
            OPEN
          </button>
        </div>
      </div>
    </motion.div>
  );
}

