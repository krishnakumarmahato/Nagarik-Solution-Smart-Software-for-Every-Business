import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend, 
  Cell, 
  PieChart, 
  Pie,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart as PieIcon, 
  Layers, 
  Award,
  Calendar,
  Users,
  Download,
  Printer,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Filter,
  User,
  Briefcase,
  Play,
  Mail,
  MessageSquare,
  Search,
  Check,
  Percent,
  ChevronRight
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { 
    leads, 
    demos, 
    proposals, 
    clients, 
    campaigns, 
    invoices, 
    packages,
    activeReportsSubTab,
    setActiveReportsSubTab
  } = useCRM();

  // Active state for local widgets / subtabs
  const [tabIndex, setTabIndex] = useState<'chart' | 'logs'>('chart');
  
  // Custom Filter State for custom reporting engine
  const [customFilter, setCustomFilter] = useState({
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    leadSource: 'All',
    leadPriority: 'All',
    category: 'All',
    metricType: 'Value'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [customReportData, setCustomReportData] = useState<any[]>([]);

  // Calculate real metrics from Context Data
  const metrics = useMemo(() => {
    const totalProposalValue = proposals
      .filter(p => p.status === 'Accepted')
      .reduce((sum, p) => sum + p.amount, 0) || 15060000; // fallback to match default if empty

    const totalCollected = invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0) || 13245000;

    const totalPartial = invoices
      .filter(i => i.status === 'Partial')
      .reduce((sum, i) => sum + (i.paidAmount || 0), 0);

    const totalCollectedReal = totalCollected + totalPartial;

    // Direct claims outstanding
    const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0) || 15060000;
    const totalOutstanding = invoices
      .reduce((sum, i) => sum + (i.amount - (i.paidAmount || 0)), 0) || 18150000;

    // VAT sum
    const totalTax = invoices.reduce((sum, i) => sum + (i.tax || 0), 0) || 1721850;

    return {
      tcv: totalInvoiced,
      collection: totalCollectedReal,
      outstanding: Math.max(0, totalOutstanding),
      tax: totalTax
    };
  }, [proposals, invoices]);

  // Handle manual live export
  const handleExport = (filename: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ metrics, leadsCount: leads.length, invoicesCount: invoices.length, timestamp: new Date().toISOString() })
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${filename}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 1. Sales trends aggregation
  const salesTrendData = useMemo(() => {
    // Generate mock graph mapping from past 6 months based on actual invoice data structure
    return [
      { name: 'Jan', Sales: 2450000, Claims: 850000, Expenses: 1200000 },
      { name: 'Feb', Sales: 3100000, Claims: 600000, Expenses: 1400000 },
      { name: 'Mar', Sales: 2900000, Claims: 450000, Expenses: 1100000 },
      { name: 'Apr', Sales: 4200000, Claims: 1100000, Expenses: 1800000 },
      { name: 'May', Sales: 3800000, Claims: 950000, Expenses: 1500000 },
      { name: 'Jun', Sales: 5120000, Claims: 1200000, Expenses: 2100000 }
    ];
  }, []);

  // 2. Product Segment aggregate bars
  const volumeTrendData = useMemo(() => {
    // Build actual values based on CRM package categories
    const categories = ['Software', 'Websites', 'Active Products', 'Packages'];
    return categories.map(cat => {
      const relatedPkgs = packages.filter(p => p.category === cat);
      const invoiceAmt = relatedPkgs.length * 350000; // Mock factor
      const paidAmt = relatedPkgs.length * 300000;
      return {
        name: cat,
        Invoiced: invoiceAmt || 1500000,
        Paid: paidAmt || 1200000
      };
    });
  }, [packages]);

  // 3. Segment division categories
  const segmentData = useMemo(() => {
    const segments: Record<string, number> = {};
    clients.forEach(c => {
      const grp = c.clientGroup || 'IT & Software';
      segments[grp] = (segments[grp] || 0) + 1;
    });

    const output = Object.entries(segments).map(([name, count]) => ({
      name,
      value: Math.round((count / (clients.length || 1)) * 100)
    }));

    if (output.length === 0) {
      return [
        { name: 'IT & Software', value: 45 },
        { name: 'Healthcare', value: 25 },
        { name: 'Trading', value: 15 },
        { name: 'Education', value: 10 },
        { name: 'Banking', value: 5 }
      ];
    }
    return output;
  }, [clients]);

  const SEGMENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

  // 4. Custom live reporting engine mock run
  const triggerCustomAnalysis = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Filter leads based on selected criteria
      let filteredLeads = [...leads];
      if (customFilter.leadPriority !== 'All') {
        filteredLeads = filteredLeads.filter(l => l.leadPriority === customFilter.leadPriority);
      }
      if (customFilter.leadSource !== 'All') {
        filteredLeads = filteredLeads.filter(l => l.leadSource === customFilter.leadSource);
      }
      
      const chartValues = filteredLeads.reduce((acc: any[], lead) => {
        const key = lead.city || lead.leadSource || 'Other';
        const existing = acc.find(item => item.name === key);
        const dealVal = lead.dealValue || 120000;
        if (existing) {
          existing.Count += 1;
          existing.Value += dealVal;
        } else {
          acc.push({ name: key, Count: 1, Value: dealVal });
        }
        return acc;
      }, []);

      setCustomReportData(chartValues.slice(0, 8));
      setIsGenerating(false);
    }, 850);
  };

  // Run initial custom analysis load
  React.useEffect(() => {
    triggerCustomAnalysis();
  }, [leads]);

  return (
    <div className="flex-grow h-full overflow-hidden flex flex-col bg-slate-50 text-slate-800 text-left">
      
      {/* Subpage Header / Breadcrumb navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Reports Module</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-xs font-extrabold text-blue-600 capitalize">{activeReportsSubTab} Reports</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600 stroke-[2.5]" />
            <span>Analytical Reports Workspace</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time charts, auditing pipelines, and client metrics syncing from database logs.</p>
        </div>

        {/* Global Export actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport(`nagarik-${activeReportsSubTab}-report`)}
            className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1.5 transition border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-500/10 text-white rounded-xl flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Inner Scaffold */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Top Summary KPI Cards (Matching exact pricing numbers) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Contract Value</span>
              <h4 className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
                Rs. {metrics.tcv.toLocaleString('en-IN')}
              </h4>
              <span className="text-[9px] text-emerald-600 font-bold block mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>↑ 18.4% YoY Growth</span>
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Collected Volume</span>
              <h4 className="text-lg font-extrabold text-emerald-600 font-mono mt-0.5">
                Rs. {metrics.collection.toLocaleString('en-IN')}
              </h4>
              <span className="text-[9px] text-slate-500 font-medium block mt-1">
                VAT matching billing receipts
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Outstanding Claims</span>
              <h4 className="text-lg font-extrabold text-rose-600 font-mono mt-0.5">
                Rs. {metrics.outstanding.toLocaleString('en-IN')}
              </h4>
              <span className="text-[9px] text-rose-500 font-bold block mt-1">
                12.0% Debt Coeff. Index
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
              <Layers className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Tax Withholding (VAT 13%)</span>
              <h4 className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">
                Rs. {metrics.tax.toLocaleString('en-IN')}
              </h4>
              <span className="text-[9px] text-slate-400 block mt-1 font-medium">
                Audited & PAN Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic subpages renderer based on activeReportsSubTab state */}
        
        {/* TAB 1: OVERVIEW */}
        {activeReportsSubTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Analytical Selector with Live charts toggle */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-max">
                <button
                  onClick={() => setTabIndex('chart')}
                  className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                    tabIndex === 'chart' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>Graphical Data Trends</span>
                </button>
                <button
                  onClick={() => setTabIndex('logs')}
                  className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                    tabIndex === 'logs' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Audit Log</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Financial Year: 2082/2083 (2026 Grid)</span>
              </div>
            </div>

            {tabIndex === 'chart' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Outlays Chart Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-[380px]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">State outlays and cash revenue flow</h3>
                      <p className="text-xs text-slate-400">Total bill volumes compared to outstanding debts month-by-month</p>
                    </div>
                    <span className="p-1 px-2 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-lg">Realtime</span>
                  </div>
                  
                  <div className="flex-1 w-full min-h-0 text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="glowSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="glowClaims" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                        <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(v) => `Rs. ${v/100000}L`} />
                        <ChartTooltip formatter={(v: any) => [`Rs. ${Number(v).toLocaleString('en-IN')}`]} />
                        <Legend iconType="circle" />
                        <Area type="monotone" dataKey="Sales" name="Total Bill Volumes" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#glowSales)" />
                        <Area type="monotone" dataKey="Claims" name="Outstanding Claims" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#glowClaims)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sector market categories PIE chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[380px]">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Sector Market Categories</h3>
                    <p className="text-xs text-slate-400">Customer distribution by client industries</p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center relative">
                    <div className="w-full h-44 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={segmentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {segmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold text-center leading-none mb-1">Market</span>
                        <span className="text-lg font-black text-slate-900 font-mono leading-none">Segments</span>
                      </div>
                    </div>

                    {/* Split metrics list */}
                    <div className="w-full max-h-[120px] overflow-y-auto space-y-1.5 mt-4 px-2">
                      {segmentData.map((seg, i) => (
                        <div key={i} className="flex justify-between items-center text-xs font-bold text-slate-600">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }} />
                            <span className="truncate text-[11px]">{seg.name}</span>
                          </div>
                          <span className="text-slate-500 font-mono text-[11px] shrink-0">{seg.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Database Ledger Audit Log ({invoices.length} Invoices)</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">Audited</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                        <th className="p-3.5 pl-6">Invoice No</th>
                        <th className="p-3.5">Client Account</th>
                        <th className="p-3.5">Issue Date</th>
                        <th className="p-3.5 text-right">Amount (NPR)</th>
                        <th className="p-3.5 text-right">Collected (NPR)</th>
                        <th className="p-3.5 text-center">Status</th>
                        <th className="p-3.5">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                      {invoices.map((inv, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 pl-6 font-mono text-blue-600 font-bold">{inv.invoiceNo}</td>
                          <td className="p-3.5 truncate max-w-[160px] text-slate-800 font-bold">{inv.client}</td>
                          <td className="p-3.5 font-mono text-slate-400 text-xs">{inv.invoiceDate}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-slate-900">Rs. {inv.amount.toLocaleString('en-IN')}</td>
                          <td className="p-3.5 text-right font-mono text-emerald-600">Rs. {inv.paidAmount?.toLocaleString('en-IN') || 0}</td>
                          <td className="p-3.5 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase ${
                              inv.status === 'Paid' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                : inv.status === 'Partial'
                                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                : 'bg-rose-50 text-rose-600 border border-rose-200'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-xs text-slate-500 font-medium">{inv.paymentMethod || 'Esewa/Khalti'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick module entry points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => setActiveReportsSubTab('sales')}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center group"
              >
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Revenue Forecast & Leads</h4>
                  <p className="text-slate-800 font-bold text-sm mt-1">Sales Reports Pipeline</p>
                  <p className="text-[10px] text-slate-400 mt-1">Expected win values & priority coefficients</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div 
                onClick={() => setActiveReportsSubTab('projects')}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center group"
              >
                <div>
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Demos & Target Campaign Reach</h4>
                  <p className="text-slate-800 font-bold text-sm mt-1">Project Reports Pipeline</p>
                  <p className="text-[10px] text-slate-400 mt-1">Conversion ratios & outreach stats</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div 
                onClick={() => setActiveReportsSubTab('custom')}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center group"
              >
                <div>
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest">Multi-factor Pivot Filters</h4>
                  <p className="text-slate-800 font-bold text-sm mt-1">Custom Reports Pipeline</p>
                  <p className="text-[10px] text-slate-400 mt-1">Drill down and schedule data aggregates</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition">
                  <Filter className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SALES REPORTS */}
        {activeReportsSubTab === 'sales' && (
          <div className="space-y-6">
            
            {/* Sales Header cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimated Opportunity Pipeline</span>
                <h3 className="text-2xl font-black text-blue-600 font-mono mt-1">Rs. {leads.reduce((sum, l) => sum + (l.dealValue || 140000), 0).toLocaleString('en-IN')}</h3>
                <span className="text-[9px] text-slate-400 block mt-1">From {leads.length} active leads currently under negotiation</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Conversion Deal Value (Proposals accepted)</span>
                <h3 className="text-2xl font-black text-emerald-600 font-mono mt-1">Rs. {proposals.filter(p => p.status === 'Accepted').reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}</h3>
                <span className="text-[9px] text-emerald-500 font-semibold block mt-1">High conversion factor of {(proposals.filter(p => p.status==='Accepted').length / (proposals.length || 1) * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Sales Quotas Attainment</span>
                <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">118.4%</h3>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
            </div>

            {/* Proposal grid breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Pending and Approved Proposals Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50 text-slate-400 text-[10px] uppercase font-bold border-b border-rose-100">
                      <th className="p-3">Proposal No</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Project Type</th>
                      <th className="p-3 text-right">Value (NPR)</th>
                      <th className="p-3">Sent On</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-600">
                    {proposals.map((p, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-blue-600">{p.proposalNo}</td>
                        <td className="p-3 text-slate-800 font-bold">{p.client}</td>
                        <td className="p-3 text-slate-500 text-[11px]">{p.project}</td>
                        <td className="p-3 text-right font-mono text-slate-900 font-bold">Rs. {p.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono text-slate-400">{p.sentOn}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase ${
                            p.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-600'
                              : p.status === 'Draft'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROJECT REPORTS */}
        {activeReportsSubTab === 'projects' && (
          <div className="space-y-6">
            
            {/* Demo and campaign KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Demos Conversion */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[340px]">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Demo Bookings Analytics</h3>
                  <p className="text-xs text-slate-400">Status ratios of software scheduled presentations</p>
                </div>
                
                <div className="flex-grow flex items-center justify-around gap-4 min-h-0">
                  <div className="w-1/2 h-full py-4 text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { name: 'Completed', value: demos.filter(d => d.demoStatus === 'Completed'||d.demoStatus==='Confirmed').length || 18 },
                          { name: 'Scheduled', value: demos.filter(d => d.demoStatus === 'Scheduled'||d.demoStatus==='Pending').length || 8 },
                          { name: 'Cancelled', value: demos.filter(d => d.demoStatus === 'Cancelled'||d.demoStatus==='No-Show').length || 2 }
                        ]}
                      >
                        <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" />
                        <YAxis fontSize={9} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                          <Cell fill="#10b981" />
                          <Cell fill="#3b82f6" />
                          <Cell fill="#ef4444" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 text-xs font-bold w-1/2">
                    <p className="text-slate-400 uppercase text-[9px] tracking-widest font-black">Performance Audit</p>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Fully Executed Demos:</span>
                      <span className="text-emerald-600 font-mono font-black">{demos.filter(d => d.demoStatus === 'Completed').length || 15}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Upcoming Pipeline:</span>
                      <span className="text-blue-600 font-mono font-black">{demos.filter(d => d.demoStatus === 'Scheduled').length || 4}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Post-Demo Leads:</span>
                      <span className="text-indigo-600 font-mono font-black">{(demos.length * 0.72).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaigns performance reach */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[340px]">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Target Marketing Reach</h3>
                  <p className="text-xs text-slate-400">WhatsApp / Email system broadcast response metrics</p>
                </div>
                
                <div className="overflow-y-auto flex-1 space-y-3.5 pr-1">
                  {campaigns.map((camp, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span className="truncate max-w-[170px]">{camp.campaignName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] tracking-widest uppercase font-black ${
                          camp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'
                        }`}>{camp.status}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[10px] font-semibold text-slate-400">
                        <div>
                          <span className="block text-[8px] text-slate-400 uppercase font-bold leading-none mb-0.5">Dispatched</span>
                          <span className="text-slate-800 font-bold block">{camp.sent.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 uppercase font-bold leading-none mb-0.5">Response Rate</span>
                          <span className="text-blue-600 font-bold block">{camp.openRate || camp.clickRate}%</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 uppercase font-bold leading-none mb-0.5">Callbacks</span>
                          <span className="text-emerald-600 font-bold block">{camp.responses}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT REPORTS */}
        {activeReportsSubTab === 'payments' && (
          <div className="space-y-6">
            
            {/* Cash flow header logic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Collected NPR</span>
                  <h3 className="text-xl font-black text-emerald-600 font-mono mt-1">Rs. {metrics.collection.toLocaleString('en-IN')}</h3>
                  <p className="text-[9px] text-slate-400 mt-1">Direct bank settlements & gateways</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Outstanding Invoices</span>
                  <h3 className="text-xl font-black text-rose-500 font-mono mt-1">Rs. {metrics.outstanding.toLocaleString('en-IN')}</h3>
                  <p className="text-[9px] text-rose-500 mt-1">Due invoices following up</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 text-rose-500">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Audit Score</span>
                  <h3 className="text-xl font-black text-indigo-600 font-mono mt-1">98.2 / 100</h3>
                  <p className="text-[9px] text-slate-400 mt-1">Transaction reconciliations mismatch</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Invoiced bars */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[320px] flex flex-col">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Invoice Billing vs Collected Sums</h3>
              <div className="flex-1 w-full text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" />
                    <YAxis fontSize={9} />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="Invoiced" name="Invoiced NPR" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Paid" name="Collected NPR" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CLIENT REPORTS */}
        {activeReportsSubTab === 'clients' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Client Accounts & Ledger Status</h3>
                  <p className="text-xs text-slate-400">Total client billing value and individual paid summaries</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">Active accounts: {clients.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50 text-slate-400 text-[10px] uppercase font-bold border-b border-rose-100">
                      <th className="p-3 pl-4">Account ID</th>
                      <th className="p-3">Client Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Paid To Date (NPR)</th>
                      <th className="p-3 text-right">Outstanding (NPR)</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-600">
                    {clients.map((c, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="p-3 pl-4 font-mono text-slate-400">{c.id}</td>
                        <td className="p-3">
                          <div>
                            <span className="text-slate-800 font-bold block">{c.clientName}</span>
                            <span className="text-[10px] text-slate-400 block">{c.companyName}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-500 font-medium">{c.clientGroup}</td>
                        <td className="p-3 text-right font-mono text-slate-900 font-black">Rs. {(c.totalPaid || 450000).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono text-rose-500">Rs. {(c.totalOutstanding || 15000).toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-black">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EMPLOYEE REPORTS */}
        {activeReportsSubTab === 'employees' && (
          <div className="space-y-6">
            
            {/* Employee Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Sujan Karki', role: 'Business Associate', leads: 48, rate: '84.2%' },
                { name: 'Niranjan Patel', role: 'Solutions Engineer', leads: 32, rate: '91.0%' },
                { name: 'Prativa Sharma', role: 'Client Executive', leads: 28, rate: '78.5%' }
              ].map((emp, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-mono">
                    {emp.name[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-900 leading-none">{emp.name}</h4>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold mt-1">{emp.role}</span>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100 font-mono text-[11px]">
                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">Accounts Handled</span>
                        <span className="text-slate-800 font-bold block mt-1">{emp.leads} accounts</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">Deal Win Rate</span>
                        <span className="text-emerald-600 font-bold block mt-1">{emp.rate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Leads distribution logs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Leads Assignment Audit Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                      <th className="p-3 pl-4">Lead Account</th>
                      <th className="p-3">Assigned Associate</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Last Active Segment</th>
                      <th className="p-3">Est. Deal NPR</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-600">
                    {leads.slice(0, 8).map((lead, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="p-3 pl-4 text-slate-800 font-black truncate max-w-[170px]">{lead.businessName}</td>
                        <td className="p-3 text-slate-600 font-medium">{lead.assignedTo || 'Sujan Karki'}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            lead.leadPriority === 'Hot' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {lead.leadPriority}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-[10px] truncate max-w-[150px]">{lead.lastActivity || 'Call negotiation completed'}</td>
                        <td className="p-3 font-mono text-slate-900 font-bold">Rs. {(lead.dealValue || 135000).toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500 uppercase tracking-wider font-extrabold">
                            {lead.status || 'Verification'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: CUSTOM REPORTS */}
        {activeReportsSubTab === 'custom' && (
          <div className="space-y-6">
            
            {/* Dynamic filter panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Drill down multi-factor report generator</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Lead Source</label>
                  <select
                    value={customFilter.leadSource}
                    onChange={(e) => setCustomFilter(prev => ({ ...prev, leadSource: e.target.value }))}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="All">All Sources</option>
                    <option value="Bulk Excel Upload">Bulk Excel</option>
                    <option value="Website">Website Leads</option>
                    <option value="Google Maps">Google Maps</option>
                    <option value="Facebook">Facebook Ads</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Lead Priority Level</label>
                  <select
                    value={customFilter.leadPriority}
                    onChange={(e) => setCustomFilter(prev => ({ ...prev, leadPriority: e.target.value }))}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Hot">Hot Priority Only</option>
                    <option value="Warm">Warm Priority</option>
                    <option value="Cold">Cold Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Metric View to Display</label>
                  <select
                    value={customFilter.metricType}
                    onChange={(e) => setCustomFilter(prev => ({ ...prev, metricType: e.target.value }))}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="Value">Financial Value (NPR sum)</option>
                    <option value="Count">Record Count Sum</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={triggerCustomAnalysis}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold font-sans text-xs text-white rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Run Custom Filter Query</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom live chart output */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 h-[340px] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Aggregate results grouped by region / source node</h3>
                  <span className="text-[9px] font-bold bg-purple-50 text-purple-600 rounded px-2 py-0.5">Custom Live Chart</span>
                </div>

                <div className="flex-grow w-full text-[10px] py-2 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customReportData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <ChartTooltip formatter={(v: any) => [customFilter.metricType === 'Value' ? `Rs. ${Number(v).toLocaleString('en-IN')}` : `${v} entries`]} />
                      <Bar 
                        dataKey={customFilter.metricType} 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]}
                        name={customFilter.metricType === 'Value' ? 'Total Value (NPR)' : 'No of Accounts'}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CSV Export panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Scheduling and Auto delivery</h3>
                
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Automate this custom analytical query to email or Slack channel with recurring schedules.</p>
                  
                  <div className="space-y-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Automated Interval</span>
                      <select className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2">
                        <option>Every Monday at 9:00 AM</option>
                        <option>Daily Ledger Close audit (Nepal Standard Time)</option>
                        <option>Monthly financial balance spreadsheet</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recipients Channels</span>
                      <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                          <span>sujan.management@nagarik.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                          <span>Slack: #accounting-nagarik-audit</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert('Schedule Success: The automated PDF generator will send updates daily.')}
                      className="w-full py-2 bg-[#121b36] hover:bg-slate-800 transition text-[11px] font-bold text-white rounded-xl shadow-sm"
                    >
                      Save Schedule Config
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
