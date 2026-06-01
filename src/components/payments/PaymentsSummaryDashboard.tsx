import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { PaymentInvoice } from '../../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  Eye, 
  MoreVertical, 
  X, 
  Printer, 
  FileDown, 
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  CheckCircle,
  CreditCard,
  Plus
} from 'lucide-react';

// Exact starting 10 rows from the screenshot
export const defaultStartingInvoices: PaymentInvoice[] = [
  {
    id: "INV-2025-048",
    invoiceNo: "INV-2025-048",
    client: "SoftTech Solutions",
    project: "Nagarik CRM Development",
    invoiceDate: "10 May 2025",
    dueDate: "20 Jun 2025",
    amount: 1250000,
    paidAmount: 1250000,
    discount: 0,
    tax: 143805,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    paidOn: "15 May 2025",
    transactionId: "NMB20250515123456",
    notes: "Payment received via NMB Bank transfer."
  },
  {
    id: "INV-2025-047",
    invoiceNo: "INV-2025-047",
    client: "ABC Trading Co.",
    project: "E-commerce Website",
    invoiceDate: "15 May 2025",
    dueDate: "30 Jun 2025",
    amount: 875000,
    paidAmount: 875000,
    discount: 0,
    tax: 100625,
    status: "Paid",
    paymentMethod: "Khalti",
    paidOn: "16 May 2025",
    transactionId: "KHLT9083123456",
    notes: "Paid instantly via Khalti wallet integration."
  },
  {
    id: "INV-2025-046",
    invoiceNo: "INV-2025-046",
    client: "Himalayan Bank Ltd.",
    project: "Inventory Management System",
    invoiceDate: "01 Apr 2025",
    dueDate: "10 May 2025",
    amount: 920000,
    paidAmount: 920000,
    discount: 0,
    tax: 105800,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    paidOn: "05 Apr 2025",
    transactionId: "NBL77201948511",
    notes: "Cleared directly to corporate primary account."
  },
  {
    id: "INV-2025-045",
    invoiceNo: "INV-2025-045",
    client: "Bright Future School",
    project: "Corporate Website Redesign",
    invoiceDate: "05 Apr 2025",
    dueDate: "15 May 2025",
    amount: 450000,
    paidAmount: 450000,
    discount: 5000,
    tax: 51750,
    status: "Paid",
    paymentMethod: "eSewa",
    paidOn: "05 Apr 2025",
    transactionId: "ESEW908741235",
    notes: "Settled online via eSewa merchant payment portal."
  },
  {
    id: "INV-2025-044",
    invoiceNo: "INV-2025-044",
    client: "Green Valley Hospital",
    project: "HRM System Development",
    invoiceDate: "20 May 2025",
    dueDate: "15 Jul 2025",
    amount: 1000000,
    paidAmount: 300000,
    discount: 0,
    tax: 115000,
    status: "Partial",
    paymentMethod: "Bank Transfer",
    paidOn: "—",
    transactionId: "TXPN3908214",
    notes: "First milestone payment received; awaiting second stage approval."
  },
  {
    id: "INV-2025-043",
    invoiceNo: "INV-2025-043",
    client: "Tech Innovators",
    project: "Portfolio Website",
    invoiceDate: "25 May 2025",
    dueDate: "25 Jun 2025",
    amount: 75000,
    paidAmount: 75000,
    discount: 0,
    tax: 8625,
    status: "Paid",
    paymentMethod: "Khalti",
    paidOn: "26 May 2025",
    transactionId: "KHLT882940215",
    notes: "Full settlement on completion."
  },
  {
    id: "INV-2025-042",
    invoiceNo: "INV-2025-042",
    client: "Blue Sky Travels",
    project: "School Management System",
    invoiceDate: "10 May 2025",
    dueDate: "10 Jul 2025",
    amount: 680000,
    paidAmount: 0,
    discount: 0,
    tax: 78200,
    status: "Overdue",
    paymentMethod: "—",
    paidOn: "—",
    transactionId: "",
    notes: "Payment delay escalation pending."
  },
  {
    id: "INV-2025-041",
    invoiceNo: "INV-2025-041",
    client: "Dreamz Restaurant",
    project: "Travel Booking Website",
    invoiceDate: "18 May 2025",
    dueDate: "20 Jul 2025",
    amount: 745000,
    paidAmount: 350000,
    discount: 0,
    tax: 85675,
    status: "Partial",
    paymentMethod: "eSewa",
    paidOn: "18 May 2025",
    transactionId: "ESEW32049102",
    notes: "Initial deployment payment cleared."
  },
  {
    id: "INV-2025-040",
    invoiceNo: "INV-2025-040",
    client: "Nepal Tourism Board",
    project: "Mobile App Development",
    invoiceDate: "12 May 2025",
    dueDate: "05 Jul 2025",
    amount: 550000,
    paidAmount: 0,
    discount: 0,
    tax: 63250,
    status: "Overdue",
    paymentMethod: "—",
    paidOn: "—",
    transactionId: "",
    notes: "Under finance clearance."
  },
  {
    id: "INV-2025-039",
    invoiceNo: "INV-2025-039",
    client: "Annapurna Pvt. Ltd.",
    project: "Landing Page Development",
    invoiceDate: "01 May 2025",
    dueDate: "15 May 2025",
    amount: 150000,
    paidAmount: 150000,
    discount: 0,
    tax: 17250,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    paidOn: "01 May 2025",
    transactionId: "NBL3049182390",
    notes: "Final landing page release fee cleared."
  }
];

interface PaymentsSummaryDashboardProps {
  onShowTaxInvoice: (invoice: PaymentInvoice) => void;
  triggerToast: (msg: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const PaymentsSummaryDashboard: React.FC<PaymentsSummaryDashboardProps> = ({
  onShowTaxInvoice,
  triggerToast,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const { invoices: contextInvoices, updateInvoice } = useCRM();

  // Combine default with context added ones safely to avoid missing rows
  const allInvoices = useMemo(() => {
    const combined = [...defaultStartingInvoices];
    contextInvoices.forEach(ci => {
      if (!combined.some(item => item.id === ci.id || item.invoiceNo === ci.invoiceNo)) {
        combined.unshift(ci);
      }
    });
    return combined;
  }, [contextInvoices]);

  // Selected details drawer state
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentInvoice | null>(defaultStartingInvoices[0]);

  // Filter systems
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');

  // Checkbox tracker
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);

  // Distinct projects selection
  const distinctProjects = useMemo(() => {
    const projSet = new Set<string>();
    allInvoices.forEach(i => { if (i.project) projSet.add(i.project); });
    return Array.from(projSet);
  }, [allInvoices]);

  // Filter executor
  const filteredInvoices = useMemo(() => {
    return allInvoices.filter(inv => {
      const matchesSearch = 
        inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.project.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || inv.paymentMethod === paymentFilter;
      const matchesProject = projectFilter === 'All' || inv.project === projectFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesProject;
    });
  }, [allInvoices, searchQuery, statusFilter, paymentFilter, projectFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInvoiceIds(filteredInvoices.map(i => i.id));
    } else {
      setSelectedInvoiceIds([]);
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop row click selection
    setSelectedInvoiceIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPaymentFilter('All');
    setProjectFilter('All');
    triggerToast('Filters reset to default view.');
  };

  const handleExport = () => {
    const dataString = JSON.stringify(filteredInvoices, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nagarik_invoice_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast('Success: Exported billing list successfully.');
  };

  // Status Badge Helper
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partial': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getClientInitialAndColor = (clientName: string) => {
    const letter = clientName.trim().charAt(0).toUpperCase();
    const bgColors: { [key: string]: string } = {
      'S': 'bg-indigo-600',
      'A': 'bg-emerald-600',
      'H': 'bg-purple-600',
      'B': 'bg-blue-600',
      'G': 'bg-emerald-500',
      'T': 'bg-teal-600',
      'D': 'bg-sky-500',
      'N': 'bg-indigo-700'
    };
    return {
      letter,
      bg: bgColors[letter] || 'bg-slate-500'
    };
  };

  // Recharts Revenue Trend Chart (exact points matching image)
  const revenueTrendData = [
    { label: 'Jan', amount: 15 },
    { label: 'Feb', amount: 28 },
    { label: 'Mar', amount: 45 },
    { label: 'Apr', amount: 43 },
    { label: 'May', amount: 62 },
    { label: 'Jun', amount: 78 }
  ];

  // Pie chart Status Data
  const pieStatusData = [
    { name: 'Paid', value: 132, color: '#10b981' },
    { name: 'Partial', value: 18, color: '#f59e0b' },
    { name: 'Overdue', value: 12, color: '#ef4444' }
  ];

  // Pie chart Method Data
  const pieMethodData = [
    { name: 'Bank Transfer', value: 68, color: '#3b82f6', pct: '42.0%' },
    { name: 'Khalti', value: 36, color: '#8b5cf6', pct: '22.2%' },
    { name: 'eSewa', value: 34, color: '#14b8a6', pct: '21.0%' },
    { name: 'Cash', value: 12, color: '#f59e0b', pct: '7.4%' },
    { name: 'Others', value: 12, color: '#94a3b8', pct: '7.4%' }
  ];

  // Top clients revenue listing representation
  const topClientsData = [
    { name: 'SoftTech Solutions', value: 1250000, barWidthPercent: '100%' },
    { name: 'Himalayan Bank Ltd.', value: 1000000, barWidthPercent: '80%' },
    { name: 'ABC Trading Co.', value: 875000, barWidthPercent: '70%' },
    { name: 'Blue Sky Travels', value: 745000, barWidthPercent: '60%' },
    { name: 'Green Valley Hospital', value: 680000, barWidthPercent: '55%' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Metrics Row (exact 5 metrics cards matching image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-500">Total Revenue</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Rs. 68,45,000</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3.5 text-emerald-600 text-xs font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>16.7%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-500">Paid Amount</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Rs. 66,20,000</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3.5 text-emerald-600 text-xs font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>14.3%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-500">Outstanding Amount</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Rs. 2,25,000</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3.5 text-rose-600 text-xs font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            <span>8.5%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-500">Overdue Amount</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Rs. 1,05,000</h3>
            </div>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3.5 text-rose-600 text-xs font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            <span>12.2%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-500">Total Transactions</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">162</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3.5 text-emerald-600 text-xs font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>10.8%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
        </div>

      </div>

      {/* Main Workspace Frame: (Grid of 12 Column Layout. Table + Drawer Panel) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Table Sector -> Takes the bulk of width, shrinks when selectedInvoice is visible */}
        <div className="flex-1 min-w-0 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Action Filter Controls Ribbon */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 animate-fade-in flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              
              {/* Search */}
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by invoice no., client name, project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-medium"
                />
              </div>

              {/* Status Selector */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none hover:border-slate-300 transition font-medium cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Overdue">Overdue</option>
              </select>

              {/* Methods Selector */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none hover:border-slate-300 transition font-medium cursor-pointer"
              >
                <option value="All">All Payment Methods</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Khalti">Khalti</option>
                <option value="eSewa">eSewa</option>
                <option value="Cash">Cash</option>
                <option value="—">No Method (—)</option>
              </select>

              {/* Projects Selector */}
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none hover:border-slate-300 transition font-medium overflow-ellipsis max-w-[150px] cursor-pointer"
              >
                <option value="All">All Projects</option>
                {distinctProjects.map(proj => (
                  <option key={proj} value={proj}>{proj}</option>
                ))}
              </select>

              {/* Reset Switch */}
              <button
                onClick={handleResetFilters}
                className="p-2 border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

            </div>

            {/* Export trigger */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white border border-slate-250 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* List Table with checkbox selection and precise styling */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredInvoices.length > 0 && selectedInvoiceIds.length === filteredInvoices.length}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Invoice No.</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Invoice Date</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Paid On</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => {
                    const isSelected = selectedInvoice?.id === inv.id;
                    const avatar = getClientInitialAndColor(inv.client);
                    const isChecked = selectedInvoiceIds.includes(inv.id);
                    const isOverdue = inv.status === 'Overdue';

                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedInvoice(inv)}
                        className={`hover:bg-slate-50/50 transition cursor-pointer ${
                          isSelected ? 'bg-blue-50/40 relative font-medium' : ''
                        }`}
                      >
                        {/* Checkbox tab */}
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleToggleSelect(inv.id, e as any)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Invoice Number */}
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-blue-600 hover:underline">
                            {inv.invoiceNo}
                          </span>
                        </td>

                        {/* Client Identity (Square Avatar + Name) */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${avatar.bg}`}>
                              {avatar.letter}
                            </div>
                            <span className="text-slate-800 font-medium truncate max-w-[120px]">{inv.client}</span>
                          </div>
                        </td>

                        {/* Project */}
                        <td className="py-3.5 px-3 text-slate-500 truncate max-w-[130px]" title={inv.project}>
                          {inv.project}
                        </td>

                        {/* Dates */}
                        <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {inv.invoiceDate}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px] whitespace-nowrap">
                          <span className={isOverdue ? "text-rose-600 font-bold" : "text-slate-500"}>
                            {inv.dueDate}
                          </span>
                        </td>

                        {/* Gross Amount */}
                        <td className="py-3.5 px-3 font-bold font-mono text-slate-900 whitespace-nowrap">
                          Rs. {inv.amount.toLocaleString()}
                        </td>

                        {/* Status (Exact Badge aesthetics) */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(inv.status)}`}>
                            {inv.status}
                          </span>
                        </td>

                        {/* Payment Method */}
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          {inv.paymentMethod}
                        </td>

                        {/* Paid On Date */}
                        <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {inv.paidOn}
                        </td>

                        {/* Actions (View + menu) */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setSelectedInvoice(inv); onShowTaxInvoice(inv); }}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                              title="Quick Tax Invoice Receipt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => triggerToast(`CRM Command: Manage properties of ${inv.invoiceNo}`)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400 bg-slate-50/20">
                      <div className="max-w-sm mx-auto flex flex-col items-center gap-1.5">
                        <span className="font-bold text-slate-500">No Invoices Found</span>
                        <span className="text-xs text-slate-400 leading-relaxed">Relax filters or reset searches to view the entire outstanding invoice list ledger.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with exact counts + Pagers */}
          <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing 1 to {filteredInvoices.length} of 162 entries
            </span>
            
            <div className="flex items-center gap-1.5 text-xs">
              <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50" disabled>&lt;</button>
              <button className="w-8 h-8 px-1.5 py-1 bg-blue-600 text-white font-bold rounded-lg shadow-sm">1</button>
              <button className="w-8 h-8 px-1.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">2</button>
              <button className="w-8 h-8 px-1.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">3</button>
              <button className="w-8 h-8 px-1.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">4</button>
              <button className="w-8 h-8 px-1.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">5</button>
              <span className="text-slate-400 font-bold px-1 select-none">...</span>
              <button className="w-8 h-8 px-1.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">17</button>
              <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">&gt;</button>

              <select className="ml-2.5 border border-slate-200 rounded-lg p-1 text-xs bg-white text-slate-700 outline-none">
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>

        </div>

        {/* Right Details Panel Component (matches exact UI side card when invoice selected) */}
        {selectedInvoice && (
          <div className="w-full lg:w-[380px] bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden shrink-0 flex flex-col justify-start">
            
            {/* Drawer Title Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-sm font-bold text-slate-800">Payment Details</span>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document metadata block inside Card detail wrapper */}
            <div className="p-4.5 bg-slate-50/80 border-b border-slate-100 flex items-start gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 border border-blue-100 shadow-sm">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-900 font-mono tracking-tight">
                    {selectedInvoice.invoiceNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-500 truncate mt-1">
                  {selectedInvoice.project}
                </h4>
                <p className="text-[11px] font-semibold text-slate-600 truncate mt-0.5">
                  {selectedInvoice.client}
                </p>
              </div>
            </div>

            {/* Key Field logs layout */}
            <div className="p-4.5 space-y-3.5 text-xs">
              
              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Invoice Date</span>
                <span className="font-mono text-slate-700 text-right">{selectedInvoice.invoiceDate}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Due Date</span>
                <span className="font-mono text-blue-900 text-right">{selectedInvoice.dueDate}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Amount</span>
                <span className="font-mono font-bold text-slate-700 text-right">Rs. {selectedInvoice.amount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Paid Amount</span>
                <span className="font-mono font-bold text-slate-700 text-right">Rs. {selectedInvoice.paidAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-start text-emerald-600">
                <span className="mt-0.5">Discount</span>
                <span className="font-mono text-right">Rs. {selectedInvoice.discount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Tax (13%)</span>
                <span className="font-mono text-slate-700 text-right">Rs. {selectedInvoice.tax.toLocaleString()}</span>
              </div>

              <div className="h-px bg-slate-100 my-1" />

              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-800">Total Amount</span>
                <span className="font-mono text-sm font-extrabold text-blue-900">
                  Rs. {selectedInvoice.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Payment Method</span>
                <span className="font-semibold text-slate-700 text-right">{selectedInvoice.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Transaction ID</span>
                <span className="font-mono text-slate-700 text-right break-all max-w-[170px]">{selectedInvoice.transactionId || '—'}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-400 mt-0.5">Paid On</span>
                <span className="font-mono text-slate-700 text-right">{selectedInvoice.paidAmount > 0 ? (selectedInvoice.paidOn || '—') : '—'}</span>
              </div>

              {selectedInvoice.notes && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notes</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              {/* Remittance quick simulators inside drawer details */}
              {selectedInvoice.status !== 'Paid' && (
                <div className="pt-3 border-t border-slate-100 shrink-0 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Quick Settler Payment</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const updated: PaymentInvoice = {
                          ...selectedInvoice,
                          paidAmount: selectedInvoice.amount,
                          status: 'Paid',
                          paidOn: new Date().toISOString().split('T')[0],
                          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
                        };
                        updateInvoice(updated);
                        setSelectedInvoice(updated);
                        triggerToast(`Success: Remitted Rs. ${selectedInvoice.amount.toLocaleString()} fully!`);
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10.5px] rounded-lg shadow-sm transition"
                    >
                      Remit Fully
                    </button>
                    <button
                      onClick={() => {
                        const midVal = Math.round(selectedInvoice.amount / 2);
                        const updated: PaymentInvoice = {
                          ...selectedInvoice,
                          paidAmount: selectedInvoice.paidAmount + midVal,
                          status: 'Partial',
                          paidOn: new Date().toISOString().split('T')[0],
                          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
                        };
                        updateInvoice(updated);
                        setSelectedInvoice(updated);
                        triggerToast(`Success: Remitted Rs. ${midVal.toLocaleString()} partial payment!`);
                      }}
                      className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] rounded-lg transition"
                    >
                      Remit Half (50%)
                    </button>
                  </div>
                </div>
              )}

              {/* Form Action drawer footer buttons (exact layout) */}
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => onShowTaxInvoice(selectedInvoice)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Invoice</span>
                </button>
                <button
                  onClick={() => {
                    const printSection = document.createElement('div');
                    printSection.innerHTML = `<h1>Tax Record - ${selectedInvoice.invoiceNo}</h1><p>Client: ${selectedInvoice.client}</p><p>Total Paid: Rs. ${selectedInvoice.paidAmount}</p>`;
                    window.print();
                    triggerToast('Initiated raw system PDF print.');
                  }}
                  className="px-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition"
                  title="Download / Print receipt"
                >
                  <Printer className="w-4 h-4 ml-0.5" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Row of 4 Charts at the Bottom (Matches the screenshot perfectly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Chart 1: Revenue Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Revenue Trend</h4>
            <span className="text-[10px] text-slate-400 block pb-1">Past 6 Months (Lakh Rupees representation)</span>
          </div>
          <div className="h-40 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#afb8c6" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#afb8c6" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}L`} />
                <Tooltip formatter={(value) => [`Rs. ${Number(value) * 100000}`, 'Volume']} />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 3, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Payments by Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Payments by Status</h4>
            <span className="text-[10px] text-slate-400 block pb-1">Ledger Distribution Ratio</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-4">
            
            {/* Pie Container */}
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={44}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Content Legend */}
            <div className="flex-1 space-y-1 text-[11px] text-slate-600">
              {pieStatusData.map((item) => {
                const total = pieStatusData.reduce((acc, current) => acc + current.value, 0);
                const pct = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-800 pl-1 shrink-0 font-mono">{item.value} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 3: Payments by Method */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Payments by Method</h4>
            <span className="text-[10px] text-slate-400 block pb-1">Transaction Channels Ratio</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-4">
            
            {/* Pie Container */}
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={44}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Content Legend */}
            <div className="flex-1 space-y-0.5 text-[10.5px] text-slate-600">
              {pieMethodData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800 pl-1 shrink-0 font-mono">{item.value} ({item.pct})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Top Clients by Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Top Clients by Revenue</h4>
            <span className="text-[10px] text-slate-400 block pb-1">Highest remitting enterprise customers</span>
          </div>

          <div className="space-y-2 mt-4">
            {topClientsData.map((client) => (
              <div key={client.name} className="text-[11px]">
                <div className="flex justify-between items-center text-slate-600 mb-0.5">
                  <span className="font-medium truncate max-w-[140px]">{client.name}</span>
                  <span className="font-bold text-slate-800 font-mono">Rs. {client.value.toLocaleString()}</span>
                </div>
                
                {/* Horizontal bar representation */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: client.barWidthPercent }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
