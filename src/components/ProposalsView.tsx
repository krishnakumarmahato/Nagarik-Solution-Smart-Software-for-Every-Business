import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { Proposal, ProposalItem } from '../types';
import { 
  FileText, 
  Trash, 
  Send, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Plus, 
  DollarSign, 
  Sparkles, 
  Eye, 
  FileDown, 
  MoreVertical, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown, 
  Bell, 
  Clock, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  FileCheck, 
  X, 
  Copy, 
  Settings as SettingsIcon,
  HelpCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { mockUsers } from '../data';

export const ProposalsView: React.FC = () => {
  const { 
    proposals, 
    addProposal, 
    updateProposal, 
    activeProposalSubTab, 
    setActiveProposalSubTab,
    currentUser 
  } = useCRM();
  
  // State variables for interactive search & filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [selectedProposalId, setSelectedProposalId] = useState<string>('P-001'); // Default selected Fashion Hub (P-001)
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Detail panel active tab state
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'items' | 'history' | 'notes' | 'files'>('overview');

  // New proposal drafting form state
  const [newProp, setNewProp] = useState({
    client: '',
    project: '',
    productInterest: 'School Software Suite',
    amount: 85000,
    validDays: 14,
    owner: 'Sujan Karki',
    notes: '',
    items: [
      { id: '1', name: 'Software Custom Implementation Module', quantity: 1, price: 75000, tax: 13, discount: 0 },
      { id: '2', name: 'Premium Cloud Setup and Licensing', quantity: 1, price: 10000, tax: 13, discount: 0 }
    ]
  });

  const updateItemField = (index: number, field: keyof ProposalItem, value: any) => {
    const updatedItems = [...newProp.items];
    let parsedVal = value;
    if (field === 'quantity' || field === 'price' || field === 'tax' || field === 'discount') {
      parsedVal = Number(value) || 0;
    }
    updatedItems[index] = { ...updatedItems[index], [field]: parsedVal } as ProposalItem;
    
    const total = updatedItems.reduce((acc, it) => {
      const line = it.price * it.quantity - it.discount;
      return acc + line + (line * (it.tax / 100));
    }, 0);

    setNewProp({
      ...newProp,
      items: updatedItems,
      amount: Math.round(total)
    });
  };

  const addNewItemRow = () => {
    const newItem: ProposalItem = {
      id: String(Date.now()),
      name: 'Custom Corporate Module',
      quantity: 1,
      price: 15000,
      tax: settings.defaultTaxRate || 13,
      discount: 0
    };
    const updatedItems = [...newProp.items, newItem];
    const total = updatedItems.reduce((acc, it) => {
      const line = it.price * it.quantity - it.discount;
      return acc + line + (line * (it.tax / 100));
    }, 0);
    setNewProp({
      ...newProp,
      items: updatedItems,
      amount: Math.round(total)
    });
    triggerToast('New pricing line item appended.');
  };

  const removeItemRow = (index: number) => {
    if (newProp.items.length <= 1) {
      triggerToast('A quotation draft requires at least one active pricing item.');
      return;
    }
    const updatedItems = newProp.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((acc, it) => {
      const line = it.price * it.quantity - it.discount;
      return acc + line + (line * (it.tax / 100));
    }, 0);
    setNewProp({
      ...newProp,
      items: updatedItems,
      amount: Math.round(total)
    });
    triggerToast('Pricing line item removed.');
  };

  // Settings State (for the subpage Settings)
  const [settings, setSettings] = useState({
    defaultTaxRate: 13,
    proposalPrefix: 'PR-',
    validPeriodDays: 14,
    companyPAN: '602415124',
    signatureName: 'Sujan Karki',
    designation: 'Marketing Executive'
  });

  // Templates array (for static Templates subpage)
  const sampleTemplates = [
    { id: 'T-001', name: 'E-commerce Standard Website Proposal', category: 'Websites', validity: '15 Days', baseAmount: 'Rs. 85,000' },
    { id: 'T-002', name: 'Corporate Portal with Content Management System', category: 'Websites', validity: '30 Days', baseAmount: 'Rs. 1,80,000' },
    { id: 'T-003', name: 'School ERP Suite Core Module Edition', category: 'Software', validity: '15 Days', baseAmount: 'Rs. 1,10,000' },
    { id: 'T-004', name: 'Hospital eHMIS Integrated System Draft', category: 'Software', validity: '30 Days', baseAmount: 'Rs. 2,40,000' }
  ];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const selectedProposal = proposals.find(p => p.id === selectedProposalId || p.proposalNo === selectedProposalId) || proposals[0];

  const downloadProposalFile = (prop: Proposal, fileName: string) => {
    const textContent = `
========================================
       NAGARIK SOLUTION CRM SYSTEM
       PROPOSAL ESTIMATE DOCUMENT
========================================
Proposal Reference No: ${prop.proposalNo}
Client Legal Entity:   ${prop.client}
Project Name Code:     ${prop.project}
Investment Estimate:   Rs. ${prop.amount.toLocaleString()}
Status Indicator:      ${prop.status}
Sent On Date:          ${prop.sentOn}
Validity Expiration:   ${prop.validUntil}
Managing Account Owner:  ${prop.owner}

FEATURE INCLUSIONS & SCOPE SCHEDULE:
${prop.items ? prop.items.map(it => `- ${it.name} (Qty: ${it.quantity}) x Price: Rs. ${it.price.toLocaleString()} (Tax Rate: ${it.tax}%)`).join('\n') : '- Standard Core Implementation Modules\n- Server setup initialization'}

OFFICIAL DISPATCH DEALS & REMARKS:
${prop.notes || 'Official software and website license solutions custom-tailored for dynamic client directories.'}

========================================
This is an authentic computer-generated system extract.
Thank you for partnering with Nagarik Solution.
========================================
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Extract compiled! Download of "${fileName}" triggered successfully.`);
  };

  // Status badging styles
  const getBadgeClass = (status: string) => {
    switch(status) {
      case 'Accepted': 
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block';
      case 'Viewed': 
        return 'bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block';
      case 'Sent': 
        return 'bg-sky-50 text-sky-600 border border-sky-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block';
      case 'Draft': 
        return 'bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block';
      case 'Rejected': 
        return 'bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block';
      case 'Expired': 
        return 'bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block';
      default: 
        return 'bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block';
    }
  };

  // Filter list logic based on side navigation subtabs + filter header bar values
  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      // 1. Sidebar tab filter
      if (activeProposalSubTab && activeProposalSubTab !== 'all') {
        if (activeProposalSubTab === 'draft' && p.status !== 'Draft') return false;
        if (activeProposalSubTab === 'sent' && p.status !== 'Sent') return false;
        if (activeProposalSubTab === 'viewed' && p.status !== 'Viewed') return false;
        if (activeProposalSubTab === 'accepted' && p.status !== 'Accepted') return false;
        if (activeProposalSubTab === 'rejected' && p.status !== 'Rejected') return false;
        if (activeProposalSubTab === 'expired' && p.status !== 'Expired') return false;
        if (activeProposalSubTab === 'templates' || activeProposalSubTab === 'settings') {
          // Handled separately below inside templates view
        }
      }

      // 2. Filter bar status dropdown
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;

      // 3. Filter bar client dropdown
      if (clientFilter !== 'All' && p.client !== clientFilter) return false;

      // 4. Filter bar owner dropdown
      if (ownerFilter !== 'All' && p.owner !== ownerFilter) return false;

      // 5. General Search query (ID, Client, Project)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesClient = p.client.toLowerCase().includes(query);
        const matchesProject = p.project.toLowerCase().includes(query);
        const matchesNo = p.proposalNo.toLowerCase().includes(query);
        if (!matchesClient && !matchesProject && !matchesNo) return false;
      }

      return true;
    });
  }, [proposals, activeProposalSubTab, searchQuery, statusFilter, clientFilter, ownerFilter]);

  // Clients options extracted dynamically from list
  const clientOptions = useMemo(() => {
    const set = new Set(proposals.map(p => p.client));
    return Array.from(set);
  }, [proposals]);

  // Owners options extracted dynamically
  const ownerOptions = useMemo(() => {
    const set = new Set(proposals.map(p => p.owner));
    return Array.from(set);
  }, [proposals]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setClientFilter('All');
    setOwnerFilter('All');
    triggerToast('All search parameters and filters successfully reset.');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.client || !newProp.project) {
      triggerToast('Please provide a valid client name and project scope title.');
      return;
    }

    const calculatedTotal = newProp.items.reduce((acc, it) => {
      const line = it.price * it.quantity - it.discount;
      return acc + line + (line * (it.tax / 100));
    }, 0);

    const sent = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + newProp.validDays);

    // Format new proposal NO
    const lastNo = proposals.length + 1;
    const trackingNo = `PR-2025-00${lastNo < 10 ? '0' + lastNo : lastNo}`;

    addProposal({
      client: newProp.client,
      project: newProp.project,
      productInterest: newProp.productInterest,
      amount: Math.round(calculatedTotal),
      status: 'Sent',
      sentOn: sent,
      validUntil: expiry.toISOString().split('T')[0],
      owner: newProp.owner,
      lastActivity: `Sent ${sent}`,
      items: newProp.items,
      notes: newProp.notes || 'Drafted via Nagarik Admin proposal desk.',
      history: [
        { date: `${sent} 10:00 AM`, action: 'Proposal Draft Set & Saved', user: newProp.owner },
        { date: `${sent} 11:30 AM`, action: 'Sent link to lead client contact email', user: newProp.owner }
      ]
    });

    setIsAddOpen(false);
    triggerToast(`Proposal ${trackingNo} for ${newProp.client} has been successfully sent.`);
    
    // Reset form
    setNewProp({
      client: '',
      project: '',
      productInterest: 'School Software Suite',
      amount: 85000,
      validDays: 14,
      owner: 'Sujan Karki',
      notes: '',
      items: [
        { id: '1', name: 'Software Custom Implementation Module', quantity: 1, price: 75000, tax: 13, discount: 0 },
        { id: '2', name: 'Premium Cloud Setup and Licensing', quantity: 1, price: 10000, tax: 13, discount: 0 }
      ]
    });
  };

  const loadTemplate = (templateName: string, amt: number) => {
    setNewProp({
      client: 'Draft Client Company Ltd',
      project: templateName,
      productInterest: templateName.includes('E-commerce') ? 'Ecommerce Web Store' : 'eSchool Solutions Suite',
      amount: amt,
      validDays: 15,
      owner: 'Sujan Karki',
      notes: 'Generated from pre-configured systems template.',
      items: [
        { id: '1', name: `${templateName} Core Engine`, quantity: 1, price: amt - 15000, tax: 13, discount: 0 },
        { id: '2', name: 'Configuration & Direct Training License', quantity: 1, price: 15000, tax: 13, discount: 0 }
      ]
    });
    setIsAddOpen(true);
    triggerToast(`Template "${templateName}" applied to new proposal draft successfully!`);
  };

  return (
    <div id="proposals-workspace-root" className="flex-grow flex flex-col h-screen overflow-hidden bg-[#fafbfc] font-sans">
      
      {/* 1. Header Area with exact logo metadata matching the screenshot right panel */}
      <header className="bg-white border-b border-slate-150 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center shrink-0 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">Proposals / Quotations</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span>Proposals / Quotations</span>
            <span>&gt;</span>
            <span className="text-slate-600 capitalize font-bold">{activeProposalSubTab === 'all' ? 'All Proposals' : `${activeProposalSubTab} Proposals`}</span>
          </div>
        </div>

        {/* Right header action bar with dynamic dates, notify bell and profile */}
        <div className="flex items-center gap-4 self-end sm:self-auto">
          {/* Mock Date Selector */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:shadow-sm cursor-pointer transition select-none">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>18 May – 18 Jun 2025</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Create Button */}
          <button 
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="bg-[#2463eb] hover:bg-[#1d4ed8] text-white px-4 py-1.5 text-xs font-black rounded-lg flex items-center gap-1.5 shadow-sm transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create Proposal</span>
          </button>

          {/* Visual alert notification */}
          <div className="relative p-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-full cursor-pointer transition select-none shrink-0" title="System alerts">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">12</span>
          </div>

          <div className="h-8 w-px bg-slate-200 shrink-0" />

          {/* User Persona Profile info matching topright of screen exactly */}
          <div className="flex items-center gap-2.5">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div className="hidden md:block leading-tight select-none">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                <span>{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </h4>
              <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block mt-0.5">{currentUser.role || 'Marketing Executive'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Outer Content Layout (Split Left content vs Right workspace drawer) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Scrollable Panel containing cards, filter header and list */}
        <div className="flex-1 overflow-y-auto px-6 py-5 select-none space-y-5 scrollbar-thin">
          
          {/* ONLY DISPLAY GENERAL VIEW IF NOT IN SETTINGS OR TEMPLATES TABS */}
          {activeProposalSubTab !== 'templates' && activeProposalSubTab !== 'settings' ? (
            <>
              {/* 2. Stat Counts grid row representing metrics exact counters shown on top layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {[
                  { title: 'Total Proposals', value: '85', change: '18.7%', positive: true, icon: FileText, color: 'text-blue-500 bg-blue-50/70 border-blue-100' },
                  { title: 'Sent', value: '42', change: '16.2%', positive: true, icon: Send, color: 'text-emerald-500 bg-emerald-50/70 border-emerald-100' },
                  { title: 'Viewed', value: '28', change: '22.1%', positive: true, icon: Eye, color: 'text-purple-500 bg-purple-50/70 border-purple-100' },
                  { title: 'Accepted', value: '18', change: '20.0%', positive: true, icon: CheckCircle, color: 'text-amber-500 bg-amber-50/70 border-amber-100' },
                  { title: 'Rejected', value: '5', change: '16.7%', positive: false, icon: XCircle, color: 'text-rose-500 bg-rose-50/70 border-rose-100' },
                  { title: 'Expired', value: '4', change: '11.1%', positive: false, icon: Clock, color: 'text-sky-500 bg-sky-55/70 border-sky-100' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-slate-150 p-4 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition">
                    <div className="space-y-1.5 min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">{stat.title}</span>
                      <h3 className="text-2xl font-black text-slate-850 tracking-tight leading-none">{stat.value}</h3>
                      <div className="flex items-center gap-1 text-[9px] font-bold">
                        <span className={stat.positive ? 'text-emerald-500' : 'text-rose-500'}>
                          {stat.positive ? '↑' : '↓'} {stat.change}
                        </span>
                        <span className="text-slate-400">from last month</span>
                      </div>
                    </div>
                    <div className={`p-2.5 rounded-xl border shrink-0 ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. Interactive Filters Control Panel precisely layouted matching search inputs */}
              <div className="bg-white border border-slate-150 rounded-xl p-3.5 shadow-[0_1px_2.5px_rgba(0,0,0,0.015)] space-y-3">
                <div className="flex flex-col xl:flex-row gap-2">
                  
                  {/* Search box with dynamic queries */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by proposal number, client, or project..."
                      className="w-full bg-[#f8fafc] border border-slate-200 pl-10 pr-4 py-2 text-xs font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  {/* Dropdowns filters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex items-center gap-2">
                    
                    {/* Filter Status Selector */}
                    <div className="relative min-w-[110px]">
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 py-2 pl-2.5 pr-8 text-xs font-bold text-slate-600 rounded-lg focus:outline-none cursor-pointer appearance-none"
                      >
                        <option value="All">All Status</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Viewed">Viewed</option>
                        <option value="Sent">Sent</option>
                        <option value="Draft">Draft</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Expired">Expired</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Filter Client Selector */}
                    <div className="relative min-w-[125px]">
                      <select 
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 py-2 pl-2.5 pr-8 text-xs font-bold text-slate-600 rounded-lg focus:outline-none cursor-pointer appearance-none truncate"
                      >
                        <option value="All">All Clients</option>
                        {clientOptions.map((cli, idx) => (
                          <option key={idx} value={cli}>{cli}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Filter Owners Selector */}
                    <div className="relative min-w-[125px]">
                      <select 
                        value={ownerFilter}
                        onChange={(e) => setOwnerFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 py-2 pl-2.5 pr-8 text-xs font-bold text-slate-600 rounded-lg focus:outline-none cursor-pointer appearance-none"
                      >
                        <option value="All">All Owners</option>
                        {ownerOptions.map((own, idx) => (
                          <option key={idx} value={own}>{own}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Date select */}
                    <div className="relative min-w-[120px]">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-2 px-2.5 text-xs font-bold text-slate-500 rounded-lg cursor-pointer">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Date Range</span>
                      </div>
                    </div>

                    {/* Action trigger items */}
                    <button 
                      type="button"
                      onClick={() => triggerToast('Advanced filtering configuration tray toggled.')}
                      className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg transition cursor-pointer shrink-0"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                      <span>More Filters</span>
                    </button>

                    <button 
                      type="button"
                      onClick={resetFilters}
                      className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg transition cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => downloadProposalFile(selectedProposal, `Proposals_Export_Registry_${new Date().toISOString().split('T')[0]}.txt`)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-black rounded-lg transition cursor-pointer shrink-0"
                    >
                      <FileDown className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export</span>
                    </button>

                  </div>
                </div>
              </div>

              {/* 4. Core Proposal Directory Table list rendering exactly as in image layout */}
              <div className="bg-white border border-slate-150 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-150 text-[10px] uppercase font-black tracking-wider text-slate-400">
                        <th className="py-4.5 px-4 w-10">
                          <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked={false} />
                        </th>
                        <th className="py-4.5 px-4 font-black">Proposal #</th>
                        <th className="py-4.5 px-4 font-black">Client / Project</th>
                        <th className="py-4.5 px-4 font-black">Amount</th>
                        <th className="py-4.5 px-4 font-black text-center">Status</th>
                        <th className="py-4.5 px-4 font-black">Sent On</th>
                        <th className="py-4.5 px-4 font-black">Valid Until</th>
                        <th className="py-4.5 px-4 font-black">Owner</th>
                        <th className="py-4.5 px-4 font-black">Last Activity</th>
                        <th className="py-2.5 px-4 text-center font-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredProposals.length > 0 ? (
                        filteredProposals.map((prop) => (
                          <tr 
                            key={prop.id}
                            className={`hover:bg-slate-50/60 transition cursor-pointer ${
                              selectedProposal?.id === prop.id ? 'bg-blue-50/15' : ''
                            }`}
                            onClick={() => setSelectedProposalId(prop.id)}
                          >
                            <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            </td>
                            {/* Proposal Anchor Key matching blue clickable look */}
                            <td className="py-4 px-4 font-mono font-bold text-[#2563eb] hover:underline whitespace-nowrap">
                              {prop.proposalNo}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-extrabold text-slate-800 leading-tight">{prop.client}</div>
                              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{prop.project}</div>
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">
                              Rs. {prop.amount.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-block mx-auto ${getBadgeClass(prop.status)}`}>
                                {prop.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-medium text-slate-600 whitespace-nowrap">
                              {prop.sentOn !== '-' ? prop.sentOn : '—'}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {prop.status === 'Expired' ? (
                                <div>
                                  <div className="font-medium text-slate-600">{prop.validUntil}</div>
                                  <span className="text-[9px] font-black uppercase text-[#ef4444] tracking-widest">(Expired)</span>
                                </div>
                              ) : (
                                <span className="font-medium text-slate-600">{prop.validUntil !== '-' ? prop.validUntil : '—'}</span>
                              )}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {/* Representative profile matching image with tiny circle and text */}
                              <div className="flex items-center gap-2">
                                <div className="w-5.5 h-5.5 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                  <img 
                                    src={prop.owner === 'Sujan Karki' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'} 
                                    alt={prop.owner}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-bold text-slate-700">{prop.owner}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-700">{prop.status}</div>
                              <div className="text-[9px] font-semibold text-slate-450 mt-0.5">{prop.lastActivity}</div>
                            </td>
                            {/* Interactive row actions */}
                            <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => { setSelectedProposalId(prop.id); setActiveDetailTab('overview'); }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => downloadProposalFile(prop, `Quotation_${prop.proposalNo}.txt`)}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600 transition"
                                  title="Download PDF Estimates"
                                >
                                  <FileDown className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => triggerToast(`Option dropdown trigger for quotation ${prop.proposalNo}.`)}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="py-8 text-center text-slate-400 font-bold">
                            No proposals matched the selected filtration settings. Click Reset to clear filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 5. Pagination Footer exact layout style */}
                <div className="bg-slate-50/50 border-t border-slate-150 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-xs font-semibold text-slate-500">
                    Showing <strong className="text-slate-800">1</strong> to <strong className="text-slate-800">{filteredProposals.length}</strong> of <strong className="text-slate-800">{filteredProposals.length}</strong> entries
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-100 transition">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button className="px-3 py-1 text-xs font-black bg-blue-600 text-white rounded-lg shadow-sm">1</button>
                      <button className="px-3 py-1 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition">2</button>
                      <button className="px-3 py-1 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition">3</button>
                      <span className="text-slate-400 px-1 font-bold">...</span>
                      <button className="px-3 py-1 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition">11</button>
                      <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-100 transition">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <select 
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="bg-white border border-slate-200 text-[11px] font-bold py-1 px-1.5 pr-6 rounded focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="10">10 / page</option>
                        <option value="20">20 / page</option>
                        <option value="50">50 / page</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* 6. Bottom Bento Charts Row exactly matching visually striking graphics in screenshot */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4.5 pt-1">
                
                {/* Visual A: Proposals by Status Donut */}
                <div className="bg-white border border-slate-150 rounded-xl p-4.5 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight mb-4">Proposals by Status</h3>
                    
                    <div className="flex items-center justify-around gap-2 my-2">
                      {/* High-fidelity responsive HTML vector SVG segment render */}
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          {/* Background gray circle */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                          {/* Segment A (Blue - Sent: 49.4%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="4.2" strokeDasharray="49.4 50.6" strokeDashoffset="0" />
                          {/* Segment B (Purple - Viewed: 32.9%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="4.2" strokeDasharray="32.9 67.1" strokeDashoffset="-49.4" />
                          {/* Segment C (Green - Accepted: 21.2%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="21.2 78.8" strokeDashoffset="-82.3" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xs text-slate-400 font-bold leading-none">Accepted</span>
                          <span className="text-lg font-black text-[#10b981] mt-0.5">21.2%</span>
                        </div>
                      </div>

                      {/* Legend details */}
                      <div className="space-y-1 my-2">
                        {[
                          { label: 'Accepted', count: 18, pct: '21.2%', color: 'bg-[#10b981]' },
                          { label: 'Viewed', count: 28, pct: '32.9%', color: 'bg-[#a855f7]' },
                          { label: 'Sent', count: 42, pct: '49.4%', color: 'bg-[#2563eb]' },
                          { label: 'Draft', count: 12, pct: '14.1%', color: 'bg-slate-400' },
                          { label: 'Rejected', count: 5, pct: '5.9%', color: 'bg-[#ef4444]' },
                          { label: 'Expired', count: 4, pct: '4.7%', color: 'bg-[#f59e0b]' }
                        ].map((item, id) => (
                          <div key={id} className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                            <span className="text-slate-500 w-14 truncate">{item.label}</span>
                            <span className="text-slate-800">{item.count}</span>
                            <span className="text-slate-450">({item.pct})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual B: Proposals by Owner Donut */}
                <div className="bg-white border border-slate-150 rounded-xl p-4.5 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight mb-4">Proposals by Owner</h3>
                    
                    <div className="flex items-center justify-around gap-2 my-2">
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="32.9 67.1" strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="25.9 74.1" strokeDashoffset="-32.9" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="23.5 76.5" strokeDashoffset="-58.8" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="4.2" strokeDasharray="17.6 82.4" strokeDashoffset="-82.3" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] text-slate-400 font-bold leading-none">Total Value</span>
                          <span className="text-xs font-black text-slate-800 mt-1">100%</span>
                        </div>
                      </div>

                      {/* Legend details */}
                      <div className="space-y-1.5 my-2">
                        {[
                          { label: 'Sujan Karki', count: 28, pct: '32.9%', color: 'bg-blue-500' },
                          { label: 'Anita Sharma', count: 22, pct: '25.9%', color: 'bg-emerald-500' },
                          { label: 'Ramesh Thapa', count: 20, pct: '23.5%', color: 'bg-amber-500' },
                          { label: 'Dipak Adhikari', count: 15, pct: '17.6%', color: 'bg-slate-500' }
                        ].map((owner, id) => (
                          <div key={id} className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className={`w-2 h-2 rounded-full ${owner.color} shrink-0`} />
                            <span className="text-slate-500 w-16 truncate">{owner.label}</span>
                            <span className="text-slate-800">{owner.count}</span>
                            <span className="text-slate-450">({owner.pct})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual C: Proposal Value Overview styled Sparkline */}
                <div className="bg-white border border-slate-150 rounded-xl p-4.5 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Proposal Value Overview</h3>
                    
                    <div className="leading-tight">
                      <span className="text-xs text-slate-450 font-bold">Total Proposal Value</span>
                      <h2 className="text-xl font-black text-slate-850 mt-1">Rs. 12,45,000</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Accepted Value</span>
                        <span className="text-xs font-extrabold text-emerald-600 mt-0.5 block">Rs. 2,85,000</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Acceptance Rate</span>
                        <span className="text-xs font-extrabold text-blue-600 mt-0.5 block">22.9%</span>
                      </div>
                    </div>

                    {/* Area Sparkline SVG */}
                    <div className="w-full h-12 pt-1">
                      <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0 25 Q15 15, 30 20 T60 12 T80 18 T100 10" 
                          fill="none" 
                          stroke="#2563eb" 
                          strokeWidth="2.2" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M0 25 Q15 15, 30 20 T60 12 T80 18 T100 10 L100 30 L0 30 Z" 
                          fill="url(#areaGrad)" 
                        />
                        <circle cx="100" cy="11" r="1.8" fill="#1d4ed8" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Visual D: Top Clients progress bars */}
                <div className="bg-white border border-slate-150 rounded-xl p-4.5 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Top Clients by Proposal Value</h3>
                    
                    <div className="space-y-2 text-[10px] font-bold text-slate-600">
                      {[
                        { name: 'Green Valley Hospital', val: 'Rs. 2,40,000', width: 'w-[95%]', color: 'bg-blue-600' },
                        { name: 'New Shree Hardware', val: 'Rs. 1,25,000', width: 'w-[52%]', color: 'bg-[#2463eb]' },
                        { name: 'ABC Law Associates', val: 'Rs. 1,80,000', width: 'w-[75%]', color: 'bg-teal-500' },
                        { name: 'Fashion Hub', val: 'Rs. 85,000', width: 'w-[35%]', color: 'bg-[#2563eb]' },
                        { name: 'City Mart', val: 'Rs. 95,000', width: 'w-[40%]', color: 'bg-indigo-500' }
                      ].map((cli, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between font-extrabold text-slate-700">
                            <span className="truncate max-w-[140px]">{cli.name}</span>
                            <span>{cli.val}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`${cli.width} ${cli.color} h-full rounded-full`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      type="button" 
                      onClick={() => triggerToast('Redirecting down to full client financial analytics dashboard.')}
                      className="text-[#2563eb] hover:underline text-[10px] font-black tracking-wider block uppercase pt-1"
                    >
                      View All Reports &gt;
                    </button>
                  </div>
                </div>

              </div>
            </>
          ) : activeProposalSubTab === 'templates' ? (
            
            /* REGULAR TEMPLATE SUBPAGE CODE IMPLEMENTED */
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white p-6 border border-slate-200 rounded-2xl">
                <h3 className="text-base font-black text-slate-800 mb-2">Systems Quotation Templates Desk</h3>
                <p className="text-xs text-slate-400">Pre-configured corporate packages ready to click, load, and transmit layout proposals directly to pipeline clients.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleTemplates.map((tp) => (
                  <div key={tp.id} className="bg-white border border-slate-150 rounded-2xl p-5 hover:shadow-md transition flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md tracking-wider">{tp.category}</span>
                      <h4 className="text-sm font-black text-slate-850 leading-snug">{tp.name}</h4>
                      <div className="flex gap-4 text-xs text-slate-400 font-semibold pt-1">
                        <span>Validity: <strong className="text-slate-600">{tp.validity}</strong></span>
                        <span>•</span>
                        <span>Starts Base: <strong className="text-[#10b981]">{tp.baseAmount}</strong></span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => loadTemplate(tp.name, parseInt(tp.baseAmount.replace(/[^0-9]/g, '')))}
                      className="w-full text-center py-2 border border-blue-500 hover:bg-blue-600 hover:text-white transition rounded-xl text-xs font-black text-blue-600 shrink-0 cursor-pointer"
                    >
                      Use template to draft quote
                    </button>
                  </div>
                ))}
              </div>
            </div>

          ) : (
            
            /* REGULAR SETTINGS SUBPAGE CODE IMPLEMENTED */
            <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-6 animate-fade-in">
              <div>
                <h3 className="text-md font-black text-slate-800">Proposal Console Parameters</h3>
                <p className="text-xs text-slate-400 mt-1">Specify layout standards for automatic pro-forma generation, tax deductions and default dispatch models.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Default VAT Taxation (%)</label>
                  <input 
                    type="number" 
                    value={settings.defaultTaxRate} 
                    onChange={(e) => setSettings({ ...settings, defaultTaxRate: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Proposal Number Prefix</label>
                  <input 
                    type="text" 
                    value={settings.proposalPrefix} 
                    onChange={(e) => setSettings({ ...settings, proposalPrefix: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Validity Auto Window (Days)</label>
                  <input 
                    type="number" 
                    value={settings.validPeriodDays} 
                    onChange={(e) => setSettings({ ...settings, validPeriodDays: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Company Registry PAN Code</label>
                  <input 
                    type="text" 
                    value={settings.companyPAN} 
                    onChange={(e) => setSettings({ ...settings, companyPAN: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => triggerToast('Quotation properties and generation constraints saved.')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black text-white cursor-pointer shadow transition"
                >
                  Save settings configuration
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 7. Right Workspace Panel showing "Proposal Details" exact layout rendering */}
        <aside className="w-[380px] bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden select-none">
          {selectedProposal ? (
            <div className="h-full flex flex-col justify-between overflow-hidden">
              
              {/* Header section with X dismissal toggle */}
              <div className="p-5 border-b border-slate-150 shrink-0">
                <div className="flex justify-between items-start">
                  
                  {/* File icon representation with bold reference */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-800">{selectedProposal.proposalNo}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                          selectedProposal.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          selectedProposal.status === 'Rejected' ? 'bg-rose-50 text-rose-500 border border-rose-200' :
                          'bg-blue-50 text-blue-600 border border-blue-150'
                        }`}>
                          {selectedProposal.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-800 mt-1 truncate max-w-[170px]">{selectedProposal.client}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[170px]">{selectedProposal.project}</p>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => triggerToast('Detailed view stays locked to keep active workspace overview.')}
                    className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>

                {/* Highlight prominent amount value styled green exactly as image */}
                <div className="mt-4 bg-[#f8fafc] border border-slate-150 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Investment Quotation</span>
                    <h2 className="text-xl font-black text-[#10b981] mt-0.5 font-mono">Rs. {selectedProposal.amount.toLocaleString()}</h2>
                  </div>
                  <div className="text-right leading-tight">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Valid Until</span>
                    <span className="text-[10px] font-bold text-slate-700 block mt-0.5">{selectedProposal.validUntil !== '-' ? selectedProposal.validUntil : 'Ongoing'}</span>
                  </div>
                </div>

                {/* Details Tab navigations inside sidebar */}
                <div className="flex gap-2.5 mt-4 text-[10px] font-bold border-b border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setActiveDetailTab('overview')}
                    className={`pb-1.5 border-b-2 font-black tracking-wide ${activeDetailTab === 'overview' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  >
                    Overview
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveDetailTab('items')}
                    className={`pb-1.5 border-b-2 font-black tracking-wide ${activeDetailTab === 'items' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  >
                    Items ({selectedProposal.items?.length || 2})
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveDetailTab('history')}
                    className={`pb-1.5 border-b-2 font-black tracking-wide ${activeDetailTab === 'history' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  >
                    History
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveDetailTab('notes')}
                    className={`pb-1.5 border-b-2 font-black tracking-wide ${activeDetailTab === 'notes' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  >
                    Notes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveDetailTab('files')}
                    className={`pb-1.5 border-b-2 font-black tracking-wide ${activeDetailTab === 'files' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  >
                    Files
                  </button>
                </div>

              </div>

              {/* Scrollable middle tabs container */}
              <div className="flex-1 overflow-y-auto p-5 scrollbar-thin space-y-4">
                
                {activeDetailTab === 'overview' ? (
                  <div className="space-y-3.5 text-xs text-slate-700">
                    <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-50">
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Client</span>
                      <strong className="col-span-2 font-bold text-slate-800 text-right truncate">{selectedProposal.client}</strong>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-50">
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Contact Person</span>
                      <strong className="col-span-2 font-bold text-slate-800 text-right">Ramesh Shrestha</strong>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-50">
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Email</span>
                      <strong className="col-span-2 font-mono text-blue-600 text-right truncate">ramesh@fashionhub.com</strong>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-50">
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Phone</span>
                      <strong className="col-span-2 font-bold text-slate-800 text-right">9851123456</strong>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-50">
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Project Scope</span>
                      <strong className="col-span-2 font-bold text-slate-800 text-right truncate">{selectedProposal.project}</strong>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1.5 items-center border-b border-slate-55">
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Assigned To</span>
                      <div className="col-span-2 flex items-center gap-1.5 justify-end">
                        <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                            alt={selectedProposal.owner} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <strong className="font-extrabold text-slate-800">{selectedProposal.owner}</strong>
                      </div>
                    </div>

                    {/* Collapsible Math summary styled exactly like screenshot */}
                    <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 mt-4 bg-slate-50/40">
                      <span className="text-[9px] tracking-wider uppercase font-black text-slate-450 block mb-1">Financial Quotation Sheet</span>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>Sub Total</span>
                          <span className="font-mono text-slate-800">Rs. {(selectedProposal.amount / 1.13).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>VAT (13%)</span>
                          <span className="font-mono text-slate-800">Rs. {(selectedProposal.amount - (selectedProposal.amount / 1.13)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>Discount</span>
                          <span className="font-mono text-emerald-600">Rs. 0</span>
                        </div>
                        
                        <div className="h-px bg-slate-200/70 my-1" />
                        
                        <div className="flex justify-between text-[#10b981] font-black text-sm">
                          <span>Total Amount</span>
                          <span className="font-mono">Rs. {selectedProposal.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow up indicator */}
                    <div className="border border-slate-150 rounded-xl p-3 flex gap-3.5 items-center bg-[#eff6ff]/35">
                      <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
                      <div className="leading-tight">
                        <p className="font-black text-slate-700 text-xs">No follow-up scheduled</p>
                        <button 
                          onClick={() => triggerToast(`Schedule Follow up modal launched.`)}
                          className="text-blue-600 font-extrabold text-[10px] hover:underline mt-0.5 block cursor-pointer"
                        >
                          Schedule Follow-up
                        </button>
                      </div>
                    </div>

                  </div>
                ) : activeDetailTab === 'items' ? (
                  <div className="space-y-3">
                    <span className="text-[9px] tracking-wider uppercase font-black text-slate-400 block">Itemized Quotation Items</span>
                    {selectedProposal.items && selectedProposal.items.map((item, idx) => {
                      const finalCost = item.price * item.quantity - item.discount;
                      return (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex justify-between gap-2 text-xs">
                          <div className="min-w-0">
                            <p className="font-black text-slate-800truncate">{item.name}</p>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Qty: {item.quantity} x Rs. {item.price.toLocaleString()}</span>
                            {item.discount > 0 && <span className="text-[9px] text-emerald-600 font-bold block">Promotional Dis: -Rs. {item.discount.toLocaleString()}</span>}
                          </div>
                          <span className="font-bold text-slate-800 whitespace-nowrap font-mono text-right shrink-0">Rs. {finalCost.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : activeDetailTab === 'history' ? (
                  <div className="space-y-3">
                    <span className="text-[9px] tracking-wider uppercase font-black text-slate-400 block">Quotation History Trails</span>
                    <div className="border-l border-slate-200 ml-2 pl-3.5 space-y-4">
                      {selectedProposal.history ? selectedProposal.history.map((hist, idx) => (
                        <div key={idx} className="relative text-xs">
                          <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-blue-500 border border-white" />
                          <p className="font-extrabold text-slate-800 leading-none">{hist.action}</p>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-1">{hist.date} • by {hist.user}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-slate-400">No activity trail found for this proposal registration.</p>
                      )}
                    </div>
                  </div>
                ) : activeDetailTab === 'notes' ? (
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-wider uppercase font-black text-slate-400 block">Negotiation & Scope Notes</span>
                    <div className="p-3.5 bg-yellow-50/50 border border-yellow-100 rounded-xl text-xs font-semibold leading-relaxed text-slate-700">
                      {selectedProposal.notes || 'No standard dispatch remarks recorded currently. Edit proposal configuration to record discussions.'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <span className="text-[9px] tracking-wider uppercase font-black text-slate-400 block">Associated Files & Attachments</span>
                    {selectedProposal.files && selectedProposal.files.length > 0 ? (
                      selectedProposal.files.map((file, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-200/60 bg-slate-50 text-xs">
                          <span className="font-bold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                          <button 
                            type="button"
                            onClick={() => downloadProposalFile(selectedProposal, file.name)}
                            className="p-1 hover:bg-slate-200 rounded text-blue-600 transition cursor-pointer"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between items-center p-3 rounded-xl border border-slate-150-dot bg-slate-50/70 text-xs text-slate-500">
                        <span>Pro-forma_Estimate_{selectedProposal.proposalNo}.pdf</span>
                        <button 
                          onClick={() => downloadProposalFile(selectedProposal, `Pro-forma_Estimate_${selectedProposal.proposalNo}.txt`)}
                          className="text-blue-600 font-extrabold hover:underline"
                        >
                          Generate PDF
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Form operations at the bottom styled grid */}
              <div className="p-4 bg-[#f8fafc] border-t border-slate-150 shrink-0 space-y-3">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest leading-none">Quick Actions</span>
                
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    type="button"
                    onClick={() => triggerToast(`Launched editorial panel for proposal ${selectedProposal.proposalNo}.`)}
                    className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-slate-600 text-[10px] font-bold"
                    title="Edit Estimate"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                    <span>Edit Proposal</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => triggerToast(`Link compiled and resent to email client contact person.`)}
                    className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-slate-600 text-[10px] font-bold"
                    title="Send Email"
                  >
                    <Send className="w-4 h-4 text-purple-500" />
                    <span>Send Email</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => downloadProposalFile(selectedProposal, `Proposal_Report_${selectedProposal.proposalNo}.txt`)}
                    className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-slate-600 text-[10px] font-bold"
                    title="Download Copy"
                  >
                    <FileDown className="w-4 h-4 text-emerald-500" />
                    <span>Download PDF</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      const lastId = proposals.length + 1;
                      const copyProp = {
                        ...selectedProposal,
                        id: `P-0${lastId}`,
                        proposalNo: `PR-2025-00${lastId < 10 ? '0' + lastId : lastId}`,
                        client: `Duplicate of ${selectedProposal.client}`,
                        status: 'Draft' as const,
                        sentOn: '-',
                        validUntil: '-'
                      };
                      addProposal(copyProp);
                      triggerToast(`Quotation copied! Generated new draft ${copyProp.proposalNo}.`);
                    }}
                    className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-slate-600 text-[10px] font-bold"
                    title="Duplicate Template"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Duplicate</span>
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    const rejected: Proposal = {
                      ...selectedProposal,
                      status: 'Rejected' as const,
                      lastActivity: `Rejected on ${new Date().toISOString().split('T')[0]}`
                    };
                    updateProposal(rejected);
                    triggerToast(`Proposal marked as rejected.`);
                  }}
                  className="w-full text-center py-2.5 bg-[#f43f5e] hover:bg-[#e11d48] text-white text-xs font-black rounded-lg transition shadow-sm cursor-pointer"
                >
                  Mark as Rejected
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 h-full text-center">
              <FileCheck className="w-12 h-12 stroke-[1.2] text-slate-300" />
              <p className="font-black text-slate-500 text-xs mt-3">No Proposal Selected</p>
            </div>
          )}
        </aside>

      </div>

      {/* 8. Dynamic Overlay Form modal to create or draft proposals */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-[500px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-800">Draft New Quotation Estimate</h3>
              <button 
                type="button"
                onClick={() => setIsAddOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company / Lead Client Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Biratnagar Trade Links"
                  value={newProp.client}
                  onChange={(e) => setNewProp({ ...newProp, client: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Project Scope Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Corporate Responsive Web Portal with CMS"
                  value={newProp.project}
                  onChange={(e) => setNewProp({ ...newProp, project: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Main Product Channel</label>
                  <select 
                    value={newProp.productInterest}
                    onChange={(e) => setNewProp({ ...newProp, productInterest: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="School Software Suite">School Software Suite</option>
                    <option value="CRM Software Suite">CRM Software Suite</option>
                    <option value="eHMIS Health records">eHMIS Health records</option>
                    <option value="Custom portal websites">Custom portal websites</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quotation Validity Period</label>
                  <select 
                    value={newProp.validDays}
                    onChange={(e) => setNewProp({ ...newProp, validDays: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
              </div>

              {/* Interactive list items builder inside addition dialog */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Core Pricing Items Scheduled</span>
                  <button
                    type="button"
                    onClick={addNewItemRow}
                    className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-105 border border-blue-200 px-2.5 py-1 rounded-lg font-black tracking-wide uppercase transition cursor-pointer h-7"
                  >
                    + Add Item
                  </button>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {newProp.items.map((item, idx) => (
                    <div key={item.id || idx} className="bg-white p-3 border border-slate-200 rounded-xl space-y-2 text-xs relative shadow-2xs">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="font-extrabold text-slate-400 text-[9px] uppercase tracking-wider">Item #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition cursor-pointer"
                          title="Remove Item"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItemField(idx, 'name', e.target.value)}
                          placeholder="Line item description..."
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400"
                          required
                        />

                        <div className="grid grid-cols-4 gap-2 text-[9px] font-bold text-slate-405">
                          <div>
                            <span className="block mb-0.5 uppercase tracking-wider">Price (Rs)</span>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => updateItemField(idx, 'price', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-800"
                              min="0"
                              required
                            />
                          </div>
                          <div>
                            <span className="block mb-0.5 uppercase tracking-wider">Qty</span>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemField(idx, 'quantity', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-800"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <span className="block mb-0.5 uppercase tracking-wider">Dis (Rs)</span>
                            <input
                              type="number"
                              value={item.discount}
                              onChange={(e) => updateItemField(idx, 'discount', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-800"
                              min="0"
                            />
                          </div>
                          <div>
                            <span className="block mb-0.5 uppercase tracking-wider">VAT %</span>
                            <input
                              type="number"
                              value={item.tax}
                              onChange={(e) => updateItemField(idx, 'tax', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-800"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200/60 pt-3 mt-1.5 space-y-1 text-xs text-slate-500 font-bold select-none leading-none">
                  {(() => {
                    const subTotal = newProp.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
                    const discountTotal = newProp.items.reduce((acc, it) => acc + it.discount, 0);
                    const taxTotal = newProp.items.reduce((acc, it) => {
                      const lineVal = it.price * it.quantity - it.discount;
                      return acc + (lineVal * (it.tax / 100));
                    }, 0);
                    const grandTotal = Math.round(subTotal - discountTotal + taxTotal);
                    return (
                      <>
                        <div className="flex justify-between py-0.5">
                          <span>Subtotal:</span>
                          <span className="font-mono text-slate-700">Rs. {subTotal.toLocaleString()}</span>
                        </div>
                        {discountTotal > 0 && (
                          <div className="flex justify-between py-0.5 text-emerald-600">
                            <span>Discount:</span>
                            <span className="font-mono">-Rs. {discountTotal.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-0.5">
                          <span>VAT Total:</span>
                          <span className="font-mono text-slate-700">Rs. {Math.round(taxTotal).toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-slate-200/70 my-1.5" />
                        <div className="flex justify-between text-sm font-black text-blue-600">
                          <span>Computed Estimate Total:</span>
                          <span className="font-mono text-[#10b981]">Rs. {grandTotal.toLocaleString()}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Negotiation / Quote terms notes</label>
                <textarea 
                  placeholder="Record discussions or installment schedules..."
                  value={newProp.notes}
                  onChange={(e) => setNewProp({ ...newProp, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs h-18 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Dispatched Proposal Link
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)} 
                  className="py-3 px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-[99999] text-xs font-bold animate-slide-left select-none max-w-sm border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
      
    </div>
  );
};
