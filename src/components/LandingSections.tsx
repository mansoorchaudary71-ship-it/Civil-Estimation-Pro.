import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  MousePointerClick,
  Calculator,
  FileText,
  Check,
  X,
  Building,
  Home,
  Factory,
  HardHat,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  Sparkles,
  User,
  Activity,
} from "lucide-react";

export function HowItWorksSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    {
      icon: MousePointerClick,
      title: "Choose Your Tool",
      description:
        "Select from 50+ specialized calculators for concrete, steel, masonry, or earthwork.",
    },
    {
      icon: Calculator,
      title: "Enter Measurements",
      description:
        "Input dimensions from your drawings. Switch easily between metric and imperial units.",
    },
    {
      icon: FileText,
      title: "Get Instant Results & BOQ",
      description:
        "Instantly see precise material quantities, generate reports, and export BOQs to Excel.",
    },
  ];

  return (
    <div className="w-full py-24 md:py-32 bg-emerald-950 relative overflow-hidden" ref={(node) => { ref(node); if(containerRef) containerRef.current = node; }}>
      {/* Background glow effects */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-multiply"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-950/90" />


      <div className="text-center mb-16 relative z-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-amber-400 border border-white/10 rounded-full text-base font-medium tracking-widest uppercase mb-4 shadow-sm">
          How It Works
        </div>
        <h2
          className="md: mb-4 text-3xl font-extrabold text-white tracking-tight drop-shadow-md"
        >
          From Drawing to BOQ in 3 Steps
        </h2>
        <p className="w-full md:max-w-2xl md:mx-auto text-lg font-medium text-emerald-100/80 leading-relaxed px-4 md:px-0 drop-shadow-sm">
          Our platform simplifies complex civil engineering calculations into an intuitive, seamless workflow.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center md:items-stretch justify-center gap-12 md:gap-6 relative md:max-w-5xl md:mx-auto px-6 z-10 pt-8">
        {/* Connecting Dotted Line (Mobile Vertical) */}
        <div className="md:hidden absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-2 border-dashed border-white/20 -z-10" />

        {/* Connecting Dashed Line (Desktop Horizontal) */}
        <div className="hidden md:block absolute top-[32px] left-[15%] right-[15%] h-0 border-t-2 border-dashed border-white/20 -z-10" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="flex-1 w-full max-w-[280px] md:max-w-[280px]"
          >
            <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 relative h-full flex flex-col items-center text-center group hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 mt-6 md:mt-0">
              
              {/* Large numbered badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[48px] h-[48px] rounded-full bg-amber-500 flex items-center justify-center text-slate-900 text-xl font-black shadow-sm border-[4px] border-emerald-950 z-20 group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-300">
                {idx + 1}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5 text-amber-400 group-hover:bg-white/20 transition-colors duration-300 mt-4 border border-white/10 overflow-hidden">
                <step.icon
                  className="w-7 h-7"
                  strokeWidth={1.5}
                />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3">
                {step.title}
              </h3>
              
              <p className="text-sm font-medium text-emerald-100/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FeatureComparisonSection({
  onNavigate,
}: {
  onNavigate?: (id: string) => void;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      name: "Speed of Calculation",
      tooltip: "Time taken to complete a full BOQ or material estimate.",
      app: "< 1 Second",
      excel: "Slow",
      qs: "Days/Weeks",
    },
    {
      name: "Accuracy & Code Compliance",
      tooltip: "Adherence to local and international civil engineering codes.",
      app: true,
      excel: false,
      qs: true,
    },
    {
      name: "Mobile Accessibility",
      tooltip: "Use tools directly from the construction site on any smartphone.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "1-Click BOQ Export",
      tooltip: "Generate professional PDF and Excel Bill of Quantities instantly.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "AI Assistance",
      tooltip: "Built-in AI to answer specific structural and material questions.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "Code Compliance (IS / IRC / MORTH)",
      tooltip: "Calculations based on verified country code standards.",
      app: true,
      excel: false,
      qs: true,
    },
    {
      name: "Pakistan / India / UAE Market Rates",
      tooltip: "Access localized pricing databases for realistic estimations.",
      app: true,
      excel: false,
      qs: false,
    },
  ];

  return (
    <div
      className="w-full py-20 md:py-32 bg-slate-900 relative overflow-hidden border-t border-white/10"
      ref={ref}
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-[0.03]"></div>

      <div className="w-full md:max-w-6xl md:mx-auto px-4 relative z-10">
        <div className="text-center md:mb-12 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-amber-400 rounded-full text-base font-medium tracking-widest uppercase mb-3 border border-white/10 shadow-sm backdrop-blur-md">
            Compare
          </div>
          <h2
            className="md: mb-4 text-3xl font-extrabold text-white tracking-tight drop-shadow-md"
          >
            The Smarter Way to Estimate
          </h2>
          <p
            className="w-full md:max-w-2xl md:mx-auto px-4 mb-6 text-lg font-medium text-slate-300 leading-relaxed drop-shadow-sm"
          >
            See why thousands of engineers are abandoning spreadsheets for a dedicated estimation platform.
          </p>

          <div className="w-full flex flex-wrap items-center justify-center gap-4 md:gap-8 md:max-w-3xl md:mx-auto px-4">
            <div className="flex items-center gap-2 text-white text-base font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Auto-updates
            </div>
            <div className="flex items-center gap-2 text-white text-base font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Works Offline
            </div>
            <div className="flex items-center gap-2 text-white text-base font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> No Downloads
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-4xl md:mx-auto items-stretch px-4 md:px-0">
          {/* Spreadsheets Card */}
          <div
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col pt-8 shadow-sm overflow-hidden"
          >
            <div className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">
              Excel Spreadsheets
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-sm md:text-base">
                    {feature.name}
                    <div className="group/tooltip relative flex items-center justify-center cursor-help">
                      <div className="w-4 h-4 text-slate-600 group-hover:text-slate-600 transition-colors flex items-center justify-center">
                         <Info className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-slate-50 text-slate-900 text-sm p-2.5 rounded-[12px] text-center shadow-xl z-50 pointer-events-none">
                        {feature.tooltip}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-50 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {typeof feature.excel === "boolean" ? (
                      feature.excel ? (
                        <CheckCircle2 className="w-5 h-5 text-slate-600" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-red-100/50 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )
                    ) : (
                      <span className="text-slate-500 font-semibold text-sm md:text-base">{feature.excel}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CE Pro Card */}
          <div
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col relative mt-6 md:mt-0 md:-translate-y-1"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC000] text-slate-900 font-black text-sm rounded-full px-3 py-1 shadow-[0_0_15px_rgba(255,192,0,0.4)] border border-[#FFC000]">
              RECOMMENDED
            </div>

            <div className="text-lg md:text-xl font-bold text-white mb-6 border-b border-white/20 pb-4 flex items-center gap-2 mt-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-black text-sm tracking-tighter shadow-md shrink-0">CE</div>
              Civil Estimation <span className="text-amber-400 ml-1">Pro</span>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm md:text-base">
                    {feature.name}
                    <div className="group/tooltip relative flex items-center justify-center cursor-help">
                      <div className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors flex items-center justify-center">
                         <Info className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-slate-800 text-white text-sm p-2.5 rounded-[12px] text-center shadow-xl z-50 pointer-events-none border border-white/10">
                        {feature.tooltip}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-b border-r border-white/10 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {typeof feature.app === "boolean" ? (
                      feature.app ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-red-100/50 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )
                    ) : (
                      <span className="text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-sm md:text-sm whitespace-nowrap shadow-[0_0_10px_rgba(16,185,129,0.1)]">{feature.app}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 relative z-10 text-center flex flex-col items-center justify-center"
        >
          <button
            onClick={() => {
              if (onNavigate) onNavigate("dashboard");
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-base sm:text-lg rounded-full group shadow-xl shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
          >
            <span>Level up your estimations</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-800 font-bold hidden sm:inline"> — Start Free</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900/10 flex items-center justify-center group-hover:translate-x-1 transition-transform ml-1">
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </div>
            </div>
          </button>
          <div className="text-sm text-slate-300 text-center mt-3">
            No credit card required · Free forever · 55+ tools
          </div>
        </motion.div>
      </div>
    </div>
  );
}


export function AICopilotSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="w-full py-20 md:py-32 bg-slate-50 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full md:max-w-7xl md:mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left: Copy */}
        <div className="flex-1 w-full flex flex-col gap-6 lg:pr-8">
          <div className="inline-flex items-center self-start gap-2 px-4 py-1.5 bg-blue-600/10 text-blue-700 rounded-full text-sm font-bold tracking-widest uppercase mb-2 border border-blue-600/20 shadow-sm">
            <Sparkles className="w-4 h-4" />
            AI Estimation Copilot
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Your Intelligent <br className="hidden lg:block"/> Assistant is Ready.
          </h2>
          <p className="text-lg md:text-xl font-medium text-slate-600 leading-relaxed max-w-2xl">
            Stop manually crunching numbers. Just tell the AI Copilot what you're building, and watch it generate real-time material breakdowns and localized BOQ drafts instantly.
          </p>
          
          <ul className="mt-4 flex flex-col gap-4">
            {[
              'Understands natural language inputs',
              'Auto-applies local market rates',
              'Generates structured quantity outputs',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold text-base md:text-lg">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Terminal Mockup */}
        <div className="flex-1 w-full w-full max-w-[600px] mx-auto perspective-1000">
          <motion.div 
            initial={{ opacity: 0, rotateY: 15, rotateX: 10, scale: 0.9, y: 30 }}
            animate={inView ? { opacity: 1, rotateY: 0, rotateX: 0, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col"
          >
            {/* Window Header */}
            <div className="h-12 bg-slate-800/80 border-b border-slate-700/50 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
              </div>
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> AI Workspace
              </div>
              <div className="w-12"></div>
            </div>
            
            {/* Terminal Content */}
            <div className="p-5 md:p-6 flex flex-col gap-4 font-mono text-sm md:text-base">
              {/* User Prompt */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div className="bg-slate-800 text-slate-300 px-4 py-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-sm">
                  "I need a quick BOQ draft for a 12x15ft room, 6-inch RCC roof slab, using standard M20 concrete."
                </div>
              </div>

              {/* AI Processing Status */}
              <div className="flex items-center gap-3 pl-[40px] text-emerald-400 text-xs md:text-sm font-semibold">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Activity className="w-4 h-4" />
                </motion.div>
                Running Quick Rough Estimation → drafting BOQ per local rates...
              </div>

              {/* AI Response Breakdown */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={inView ? { opacity: 1, height: 'auto' } : {}}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex items-start gap-3 mt-2 overflow-hidden"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)] mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="w-full flex flex-col gap-3">
                  <div className="text-slate-300 bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-tl-2xl rounded-br-2xl rounded-bl-2xl">
                    Here is the material breakdown based on a 180 sq.ft. area with a 6-inch slab:
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">Concrete (M20)</span>
                        <span className="text-white font-bold">2.55 Cu.m</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">Steel Rebar</span>
                        <span className="text-white font-bold">214 Kg</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">Bricks (Standard)</span>
                        <span className="text-white font-bold">1,850 Nos</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-emerald-300 font-bold">Est. Total</span>
                        <span className="text-emerald-300 font-bold">Rs. 85,400</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors">Export to Excel</button>
                    <button className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-md transition-colors">Copy Breakdown</button>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
