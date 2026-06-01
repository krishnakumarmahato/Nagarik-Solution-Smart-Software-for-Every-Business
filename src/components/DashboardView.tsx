import React from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Users, 
  UserPlus, 
  PhoneCall, 
  Flame, 
  CheckCircle2, 
  TrendingUp,
  MessageSquare,
  FilePlus,
  Calendar,
  Share2,
  ListMinus,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    leads, 
    demos, 
    proposals, 
    clients, 
    invoices, 
    currentUser, 
    setActiveTab, 
    setActiveLeadSubTab 
  } = useCRM();

  // Aggregate numbers
  const totalLeadsCount = 300245; 
  const newLeadsToday = 8752;
  const followUpsToday = 1286;
  const hotLeads = 2156;
  const convertedLeads = 215;
  const pipelineValue = 12845000;

  // Lead trend chart source data
  const trendData = [
    { name: '18 May', NewLeads: 420, FollowUps: 240, Converted: 80 },
    { name: '23 May', NewLeads: 580, FollowUps: 310, Converted: 110 },
    { name: '28 May', NewLeads: 510, FollowUps: 290, Converted: 95 },
    { name: '02 Jun', NewLeads: 690, FollowUps: 380, Converted: 150 },
    { name: '07 Jun', NewLeads: 590, FollowUps: 340, Converted: 120 },
    { name: '12 Jun', NewLeads: 780, FollowUps: 450, Converted: 180 },
    { name: '17 Jun', NewLeads: 710, FollowUps: 410, Converted: 165 }
  ];

  // Lead source Pie source data
  const sourceData = [
    { name: 'Google Maps', value: 42.5, color: '#3b82f6' },
    { name: 'Facebook', value: 24.8, color: '#10b981' },
    { name: 'Website Form', value: 12.6, color: '#f59e0b' },
    { name: 'WhatsApp', value: 9.7, color: '#8b5cf6' },
    { name: 'Referral', value: 6.2, color: '#ec4899' },
    { name: 'Others', value: 4.2, color: '#64748b' }
  ];

  // Funnel source data representation
  const funnelData = [
    { stage: 'New Lead', count: '9,560', pct: '100%', bg: 'bg-blue-500', w: 'w-full' },
    { stage: 'Connected', count: '6,842', pct: '71.6%', bg: 'bg-indigo-500', w: 'w-[71.6%]' },
    { stage: 'Demo Scheduled', count: '3,925', pct: '41.1%', bg: 'bg-emerald-500', w: 'w-[41.1%]' },
    { stage: 'Proposal Sent', count: '2,215', pct: '23.2%', bg: 'bg-amber-500', w: 'w-[23.2%]' },
    { stage: 'Negotiation', count: '1,102', pct: '11.5%', bg: 'bg-purple-500', w: 'w-[11.5%]' },
    { stage: 'Won', count: '629', pct: '6.6%', bg: 'bg-teal-500', w: 'w-[6.6%]' }
  ];

  // Products Category Share
  const productData = [
    { name: 'Website Dev', value: 34.6, color: '#3b82f6' },
    { name: 'Ecommerce System', value: 24.5, color: '#10b981' },
    { name: 'Court Management', value: 12.8, color: '#8b5cf6' },
    { name: 'Custom ERP', value: 9.7, color: '#f59e0b' },
    { name: 'eHMIS Module', value: 7.6, color: '#ef4444' },
    { name: 'College Planner', value: 5.8, color: '#ec4899' },
    { name: 'Others', value: 5.0, color: '#64748b' }
  ];

  // Team performance table data
  const teamPerformance = [
    { name: 'Sujan Karki', leads: '1,256', calls: '1,625', converted: '32', rate: '2.5%', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256' },
    { name: 'Anita Sharma', leads: '1,087', calls: '1,324', converted: '26', rate: '2.4%', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256' },
    { name: 'Bikram Raut', leads: '1,023', calls: '1,201', converted: '24', rate: '2.3%', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256' },
    { name: 'Pooja Mahat', leads: '892', calls: '1,015', converted: '21', rate: '2.3%', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256' },
    { name: 'Ramesh Thapa', leads: '756', calls: '845', converted: '18', rate: '2.4%', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256' }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto select-none bg-slate-50 font-sans">
      
      {/* Counters layout (exactly matching image 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Leads */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-12 h-12 bg-blue-500/5 rounded-full blur-lg" />
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <Users className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Total Leads</span>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{totalLeadsCount.toLocaleString()}</h3>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">↑ 12.5% <span className="text-slate-400 font-medium">from last month</span></span>
          </div>
        </div>

        {/* New Leads Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-lg" />
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
            <UserPlus className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">New Leads Today</span>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{newLeadsToday.toLocaleString()}</h3>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">↑ 8.3% <span className="text-slate-400 font-medium">vs yesterday</span></span>
          </div>
        </div>

        {/* Follow ups due today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-12 h-12 bg-amber-500/5 rounded-full blur-lg" />
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 transition group-hover:bg-amber-600 group-hover:text-white">
            <PhoneCall className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Follow-ups Due</span>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{followUpsToday.toLocaleString()}</h3>
            <span className="text-[9px] text-amber-500 font-bold block mt-0.5">▲ 5.2% <span className="text-slate-400 font-medium">386 Overdue</span></span>
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-12 h-12 bg-red-500/5 rounded-full blur-lg" />
          <div className="p-3 bg-red-50 rounded-xl text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
            <Flame className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Hot Leads</span>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{hotLeads.toLocaleString()}</h3>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">↑ 7.1% <span className="text-slate-400 font-medium">vs last 7 days</span></span>
          </div>
        </div>

        {/* Converted Clients */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-lg" />
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Converted Clients</span>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{convertedLeads.toLocaleString()}</h3>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">↑ 20.8% <span className="text-slate-400 font-medium">this month</span></span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-12 h-12 bg-indigo-500/5 rounded-full blur-lg" />
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
            <TrendingUp className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Pipeline Value</span>
            <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-0.5">Rs. {pipelineValue.toLocaleString()}</h3>
            <span className="text-[9px] text-slate-500 font-bold block mt-0.5">Potential Revenue</span>
          </div>
        </div>
      </div>

      {/* Main Row: Lead Trend, Sources, and Task lists (exactly matching layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Trend Chart (Takes 5 cols) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-5 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Leads Overview Trend</h3>
              <p className="text-[10px] text-slate-400">Daily incremental stats review</p>
            </div>
            <select className="border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-2 bg-slate-50 text-slate-600 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFollow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip />
                <Area type="monotone" dataKey="NewLeads" name="New Leads" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorNew)" />
                <Area type="monotone" dataKey="FollowUps" name="Follow-ups" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFollow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Pie chart (Takes 3 cols) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-3 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Leads by Source</h3>
              <p className="text-[10px] text-slate-400">Total volume shares</p>
            </div>
            <select className="border border-slate-200 rounded-lg text-xs font-semibold py-1 px-1.5 bg-slate-50 text-slate-600 outline-none">
              <option>This Month</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total</span>
              <span className="text-lg font-black text-slate-800">8,752</span>
            </div>
          </div>
          {/* Legend labels */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
            {sourceData.slice(0, 4).map((src, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                <span className="truncate">{src.name}</span>
                <span className="text-slate-800 ml-auto">{src.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks/Follow-up List Card (Takes 4 cols) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-4 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Today's Tasks Flow</h3>
              <p className="text-[10px] text-slate-400">Action items pipeline check</p>
            </div>
            <button 
              onClick={() => setActiveTab('calls')}
              className="text-xs text-blue-600 hover:text-blue-500 font-bold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 leading-none">Follow-up Due Today</h4>
                  <p className="text-[10px] text-red-600 mt-1">Sujan Karki - Phone/Message</p>
                </div>
              </div>
              <span className="bg-red-200 text-red-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded-lg">1,286</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 leading-none">Overdue Follow-ups</h4>
                  <p className="text-[10px] text-amber-600 mt-1">Pending since previous days</p>
                </div>
              </div>
              <span className="bg-amber-200 text-amber-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded-lg">386</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 leading-none">Demo Scheduled Today</h4>
                  <p className="text-[10px] text-blue-600 mt-1">4 Online demo calls live</p>
                </div>
              </div>
              <span className="bg-blue-200 text-blue-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded-lg">12</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 leading-none">Proposal Follow-ups</h4>
                  <p className="text-[10px] text-emerald-600 mt-1">Wants draft quote confirmation</p>
                </div>
              </div>
              <span className="bg-emerald-200 text-emerald-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded-lg">18</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Leads by Status, Top Interests, Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads by Status bar indicators (Takes 3 cols) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-3 h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Leads by Status</h3>
              <p className="text-[10px] text-slate-400">Pipeline distributions</p>
            </div>
            <select className="border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-2 bg-slate-50 text-slate-600 outline-none">
              <option>All Leads</option>
            </select>
          </div>
          <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>New Lead</span>
                <span>78,652 (26.2%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '26.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Connected</span>
                <span>61,245 (20.4%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Interested</span>
                <span>45,632 (15.2%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '15.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Demo Scheduled</span>
                <span>18,652 (6.2%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '6.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Negotiation</span>
                <span>8,745 (2.9%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '2.9%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Product Interests Donut (Takes 4 cols) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-4 h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Top Product Interests</h3>
              <p className="text-[10px] text-slate-400">Most requested systems</p>
            </div>
            <select className="border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-2 bg-slate-50 text-slate-600 outline-none">
              <option>This Month</option>
            </select>
          </div>
          <div className="flex-1 flex gap-4 items-center">
            <div className="w-28 h-28 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {productData.map((e, index) => (
                      <Cell key={`cell-${index}`} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-md font-extrabold text-slate-800">8,752</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Requests</span>
              </div>
            </div>
            {/* Legend split list */}
            <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[220px] pr-1">
              {productData.map((prod, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: prod.color }} />
                    <span className="truncate">{prod.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-right shrink-0">{prod.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Performance rankings grid (Takes 5 cols) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-5 h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Team Performance</h3>
              <p className="text-[10px] text-slate-400">Assigned leads & conversion ranks</p>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-500 font-bold flex items-center gap-0.5">
              <span>Full Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50">
                  <th className="py-2.5 px-3">Team Member</th>
                  <th className="py-2.5 px-3 text-center">Leads</th>
                  <th className="py-2.5 px-3 text-center">Calls Made</th>
                  <th className="py-2.5 px-3 text-center">Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {teamPerformance.map((member, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="py-2.5 px-3 flex items-center gap-2.5 font-bold text-slate-800">
                      <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-lg object-cover" />
                      <span className="truncate">{member.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600">{member.leads}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600">{member.calls}</td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-slate-800">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md text-[10px] font-black">
                          {member.converted}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">{member.rate}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Third row: Quick Action Panels Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span>Quick System Actions</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <button 
            onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('all'); }}
            className="flex flex-col items-center justify-center p-4 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 hover:border-blue-200 rounded-xl transition cursor-pointer text-center group"
          >
            <UserPlus className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-slate-800">Add New Lead</span>
            <span className="text-[9px] text-slate-400 mt-1 uppercase">Pipeline Step 1</span>
          </button>

          <button 
            onClick={() => { setActiveTab('calls'); }}
            className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200 rounded-xl transition cursor-pointer text-center group"
          >
            <PhoneCall className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-slate-800">Log Follow-up</span>
            <span className="text-[9px] text-slate-400 mt-1 uppercase">Dial Tracker</span>
          </button>

          <button 
            onClick={() => setActiveTab('demos')}
            className="flex flex-col items-center justify-center p-4 bg-purple-50/50 hover:bg-purple-50 border border-purple-100 hover:border-purple-200 rounded-xl transition cursor-pointer text-center group"
          >
            <Calendar className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-slate-800">Schedule Demo</span>
            <span className="text-[9px] text-slate-400 mt-1 uppercase">Meeting links</span>
          </button>

          <button 
            onClick={() => setActiveTab('proposals')}
            className="flex flex-col items-center justify-center p-4 bg-amber-50/50 hover:bg-amber-50 border border-amber-100 hover:border-amber-200 rounded-xl transition cursor-pointer text-center group"
          >
            <FilePlus className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-slate-800">Create Proposal</span>
            <span className="text-[9px] text-slate-400 mt-1 uppercase">Standard Quotes</span>
          </button>

          <button 
            onClick={() => setActiveTab('payments')}
            className="flex flex-col items-center justify-center p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 rounded-xl transition cursor-pointer text-center group"
          >
            <Layers className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-slate-800">Submit Invoice</span>
            <span className="text-[9px] text-slate-400 mt-1 uppercase">Tax VAT 13%</span>
          </button>

          <button 
            onClick={() => setActiveTab('reports')}
            className="flex flex-col items-center justify-center p-4 bg-slate-100/50 hover:bg-slate-100 border border-slate-200/50 hover:border-slate-300 rounded-xl transition cursor-pointer text-center group"
          >
            <TrendingUp className="w-6 h-6 text-slate-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-slate-800">Analyze Reports</span>
            <span className="text-[9px] text-slate-400 mt-1 uppercase">Core Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
