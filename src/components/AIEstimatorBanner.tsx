import { Check } from "lucide-react";

interface AIEstimatorBannerProps {
  onOpenChat: () => void;
}

export default function AIEstimatorBanner({ onOpenChat }: AIEstimatorBannerProps) {
  return (
    <div className="w-full relative rounded-[2rem] bg-gradient-to-b from-indigo-100 via-purple-50 to-blue-50 p-10 md:p-16 shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Pre-header */}
      <span className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">
        AI-POWERED COPILOT
      </span>
      
      {/* Main Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
        Meet Your AI Estimator
      </h2>
      
      {/* Body Text */}
      <p className="text-lg text-slate-700 max-w-2xl mb-8 leading-relaxed">
        Describe your project naturally. We will instantly structure your entire BOQ, calculate material takeoffs, and reference building codes with extreme precision.
      </p>
      
      {/* Feature Tags */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <span className="px-4 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-600 tracking-wide bg-transparent">
          BOQ Generation
        </span>
        <span className="px-4 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-600 tracking-wide bg-transparent">
          Cost Estimation
        </span>
        <span className="px-4 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-600 tracking-wide bg-transparent">
          Material Takeoff
        </span>
      </div>
      
      {/* Action Area (Input Mimic) */}
      <button 
        onClick={onOpenChat}
        className="group relative flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl bg-white sm:rounded-full rounded-[2rem] p-2 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 active:scale-[0.98] gap-2 sm:gap-0"
      >
        <span className="px-4 py-3 sm:py-0 sm:pl-6 text-slate-400 text-center sm:text-left w-full truncate">
          Describe your project here...
        </span>
        <div className="w-full sm:w-auto shrink-0 bg-slate-900 text-white font-bold py-3 px-8 rounded-full shadow-md group-hover:bg-slate-800 transition-colors flex items-center justify-center">
          Start Chatting
        </div>
      </button>

      {/* Trust Signals */}
      <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Check className="w-4 h-4 text-slate-400" strokeWidth={3} />
          FREE TO USE
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Check className="w-4 h-4 text-slate-400" strokeWidth={3} />
          NO SIGN-UP REQUIRED
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Check className="w-4 h-4 text-slate-400" strokeWidth={3} />
          EXTREME PRECISION
        </div>
      </div>
    </div>
  );
}
