import React from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Network, 
  MapPin, 
  Users, 
  Tv, 
  Flame, 
  PhoneCall, 
  FileCheck2, 
  Briefcase, 
  ArrowRight, 
  Lightbulb,
  CornerDownRight,
  TrendingUp,
  Settings
} from 'lucide-react';

export const LeadsSubModulesMap: React.FC = () => {
  const { setActiveTab, setActiveLeadSubTab } = useCRM();

  // Unified routing trigger helper
  const navigateToNode = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      setActiveLeadSubTab(subTab);
    }
  };

  const steps = [
    {
      title: '1. Total Inbound Channels',
      desc: 'Bulk Excel logs, manual register entry sheets, or webhook captures.',
      label: '12,456 Active Catalog',
      icon: <Network className="w-5 h-5 text-indigo-600" />,
      action: () => navigateToNode('leads', 'all'),
      bg: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100/50'
    },
    {
      title: '2. Website Leads Screening',
      desc: 'Verify web domain records. Proactively suggest optimized responsive designs.',
      label: 'Step 2 of 7 in CRM',
      icon: <LayersIcon />, // we will generate standard lucide icon or build below
      action: () => navigateToNode('leads', 'website'),
      bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100/50'
    },
    {
      title: '3. Software Product Interests',
      desc: 'Match specialized system modules: School ERP, eHMIS, or Custom CRM Suites.',
      label: 'Step 3 of 7 in CRM',
      icon: <Settings className="w-5 h-5 text-emerald-600" />,
      action: () => navigateToNode('leads', 'software'),
      bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/50'
    },
    {
      title: '4. Social Channel Capture',
      desc: 'Direct Social Messenger pipelines. Immediate WhatsApp templates dispatch triggers.',
      label: 'Step 4 of 7 in CRM',
      icon: <PhoneCall className="w-5 h-5 text-amber-600" />,
      action: () => navigateToNode('leads', 'social'),
      bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100/50'
    },
    {
      title: '5. High Duplicates Auditing',
      desc: 'Simultaneous overlapping check matching duplicate email or phone indexes.',
      label: 'Smart Deduplicator check',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      action: () => navigateToNode('leads', 'duplicates'),
      bg: 'bg-purple-50 border-purple-200 hover:bg-purple-100/50'
    },
    {
      title: '6. Priority Scoring Engine',
      desc: 'Assessing cold leads vs hot leads depending on engagement scores coefficients.',
      label: 'Step 5 of 7 in CRM',
      icon: <Flame className="w-5 h-5 text-red-600" />,
      action: () => navigateToNode('leads', 'hot'),
      bg: 'bg-rose-50 border-rose-200 hover:bg-rose-100/50'
    },
    {
      title: '7. Guided Presentation Demos',
      desc: 'Produce live online Google Meet timeslots or plan on-site office room visits.',
      label: 'Product Demos scheduler',
      icon: <Tv className="w-5 h-5 text-teal-600" />,
      action: () => navigateToNode('demos'),
      bg: 'bg-teal-50 border-teal-200 hover:bg-teal-100/50'
    },
    {
      title: '8. Financial Onboarding ledger',
      desc: 'Record verified VAT PAN registers and remit deposit receipts.',
      label: 'Accounts ledger system',
      icon: <Briefcase className="w-5 h-5 text-slate-700" />,
      action: () => navigateToNode('clients'),
      bg: 'bg-slate-100 border-slate-300 hover:bg-slate-200/50'
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50 font-sans text-left">
      
      {/* Intro visual banner */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-blue-800">
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-xl z-10 relative">
          <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full">
            Sales Methodology Diagram
          </span>
          <h2 className="text-xl font-bold mt-2.5 leading-tight tracking-tight">Interactive Sales Pipeline Node Guide</h2>
          <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
            Analyze the entire operational sequence of Nagarik Solution. 
            Click any methodology bento box below to instantly route to that screening stage, adjust filters, or review live lead records.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-1 py-1 text-slate-500">
        <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
        <span className="text-xs font-bold">Interactive Nodes: Each box acts as a functional shortcut route inside Nagarik CRM.</span>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((st, i) => (
          <div 
            key={i}
            onClick={st.action}
            className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between h-[210px] relative overflow-hidden shadow-sm group ${st.bg}`}
          >
            <div className="absolute right-2.5 bottom-2.5 text-slate-300 opacity-20 pointer-events-none group-hover:scale-125 transition">
              <CornerDownRight className="w-16 h-16 shrink-0" />
            </div>

            <div>
              <div className="flex justify-between items-center pb-2 border-b border-black/5">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  {st.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white/70 px-2 py-0.5 rounded-full border border-black/5">
                  {st.label}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-800 leading-tight mt-3">{st.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-1.5">{st.desc}</p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-700 mt-3 hover:text-blue-600 transition">
              <span>Launch Module Screen</span>
              <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Methodology flow explanation card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-xs">
        <h3 className="font-extrabold text-[#0f172a] text-sm flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Operational Best Practice Lifecycle Guideline</span>
        </h3>
        <p className="text-slate-500 font-semibold">
          For optimum conversion and data integrity, ensure every inbound lead progresses chronologically through standard screening stages. 
          First, verify website statuses dynamically. If missing or obsolete, trigger our AI suggest pitch models before calling. Always deduplicate records before scheduling Google Meet presentations. Record formal VAT receipts to synchronize state cash outlays.
        </p>
      </div>

    </div>
  );
};

// Simple visual layers SVG replacement helper
const LayersIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-5 h-5 text-blue-600"
  >
    <path d="m12 3-10 5 10 5 10-5-10-5Z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </svg>
);
