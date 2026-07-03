import React, { useState, useRef, useEffect } from "react";
import { Settings, ChevronDown, Ruler, DollarSign } from "lucide-react";
import { useSettings, MeasurementSystem, Currency } from "../../context/SettingsContext";

export function GlobalSettingsToggle({ align = "right", showCurrency = true }: { align?: "left" | "right", showCurrency?: boolean }) {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClass = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] sm:text-sm font-bold text-slate-600  hover:text-amber-700  hover:bg-amber-100/50  transition-all duration-300 whitespace-nowrap"
        title={showCurrency ? "Regional & Unit Settings" : "Unit Settings"}
      >
        <span className="hidden sm:inline-block tracking-wide">
          {settings.measurement === "SI" ? "Metric" : "Imperial"} {showCurrency && `• ${settings.currency}`}
        </span>
        <span className="sm:hidden tracking-wide flex items-center gap-1">
          {settings.measurement === "SI" ? "SI" : "FPS"} {showCurrency && `• ${settings.currency}`}
        </span>
        <Settings className="w-4 h-4 ml-0.5 text-slate-700" />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-56 ${alignClass} bg-white/90  backdrop-blur-xl border border-slate-200/80  rounded-[24px] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 ring-1 ring-slate-900/5 `}>
          <div className="p-3">
            <div className="mb-2 text-[11px] font-black text-slate-700  uppercase tracking-wider flex items-center gap-1.5 pl-1">
              <Ruler className="w-3.5 h-3.5"/> Unit System
            </div>
            <div className={`grid grid-cols-2 gap-1.5 ${showCurrency ? 'mb-4' : ''}`}>
              {["SI", "FPS"].map((val) => {
                const isActive = settings.measurement === val;
                return (
                  <button
                    key={val}
                    onClick={() => { updateSettings({ measurement: val as MeasurementSystem }); setIsOpen(false); setTimeout(() => { window.location.reload(); }, 100); }}
                    className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors ${
                      isActive 
                        ? "bg-amber-100 text-amber-700   ring-1 ring-amber-600/20" 
                        : "text-slate-600 hover:bg-slate-50  "
                    }`}
                  >
                    {val === "SI" ? "Metric (m)" : "Imperial (ft)"}
                  </button>
                );
              })}
            </div>

            {showCurrency && (
              <>
                <div className="mb-2 text-[11px] font-black text-slate-700  uppercase tracking-wider flex items-center gap-1.5 pl-1">
                  <DollarSign className="w-3.5 h-3.5"/> Currency
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {["PKR", "USD", "SAR", "INR"].map((val) => {
                    const isActive = settings.currency === val;
                    return (
                      <button
                        key={val}
                        onClick={() => { updateSettings({ currency: val as Currency }); setIsOpen(false); }}
                        className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors ${
                          isActive 
                            ? "bg-amber-100 text-amber-700   ring-1 ring-amber-600/20" 
                            : "text-slate-600 hover:bg-slate-50  "
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
