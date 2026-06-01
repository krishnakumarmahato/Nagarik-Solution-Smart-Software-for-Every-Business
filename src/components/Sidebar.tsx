import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  mockUsers 
} from '../data';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  PhoneCall, 
  Tv, 
  FileText, 
  Package, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  UserSquare2, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Map,
  BadgeAlert,
  User,
  LogOut,
  CalendarDays
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeLeadSubTab, 
    setActiveLeadSubTab, 
    activeCallSubTab,
    setActiveCallSubTab,
    activeDemoSubTab,
    setActiveDemoSubTab,
    activeProposalSubTab,
    setActiveProposalSubTab,
    activePackageSubTab,
    setActivePackageSubTab,
    activeClientSubTab,
    setActiveClientSubTab,
    activePaymentSubTab,
    setActivePaymentSubTab,
    activeReportsSubTab,
    setActiveReportsSubTab,
    currentUser, 
    switchUser,
    leads,
    demos,
    invoices
  } = useCRM();

  const [leadsOpen, setLeadsOpen] = useState(true);
  const [callsOpen, setCallsOpen] = useState(false);
  const [demosOpen, setDemosOpen] = useState(true);
  const [proposalsOpen, setProposalsOpen] = useState(true);
  const [packagesOpen, setPackagesOpen] = useState(true);
  const [clientsOpen, setClientsOpen] = useState(true);
  const [paymentsOpen, setPaymentsOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Dynamic counter logic
  const hotLeadsCount = leads.filter(l => l.leadPriority === 'Hot').length;
  const duplicateLeadsCount = 5; // Fixed mock score based on screen
  
  // Follow ups count
  const todayFollowUps = leads.filter(l => l.followUpStatus === 'Follow-up Required' || l.leadPriority === 'Hot').length;

  return (
    <aside className="w-64 bg-[#0d162d] text-slate-300 flex flex-col h-screen overflow-y-auto select-none border-r border-[#1a2b4c] shrink-0 font-sans">
      {/* Brand Logo and Header */}
      <div className="p-5 border-b border-[#1a2b4c] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-lg border border-blue-400">
          N
        </div>
        <div>
          <h1 className="text-white font-bold leading-none tracking-tight text-lg">Nagarik Solution</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Smart Software For Every Business</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'dashboard' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'hover:bg-[#152345] hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* Leads Menu Group */}
        <div>
          <button
            onClick={() => {
              setActiveTab('leads');
              setLeadsOpen(!leadsOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'leads' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>Leads</span>
            </div>
            {leadsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {leadsOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              <button
                onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('all'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'leads' && activeLeadSubTab === 'all' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                All Leads
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('website'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'leads' && activeLeadSubTab === 'website' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                Website Leads
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('software'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'leads' && activeLeadSubTab === 'software' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                Software Leads
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('social'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'leads' && activeLeadSubTab === 'social' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                Social Media Leads
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('hot'); }}
                className={`w-full flex items-center justify-between text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'leads' && activeLeadSubTab === 'hot' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                <span>Hot Leads</span>
                <span className="bg-red-500 text-white text-[9px] px-1.5 rounded-full font-bold">2,156</span>
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('due'); }}
                className={`w-full flex items-center justify-between text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'leads' && activeLeadSubTab === 'due' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                <span>Follow-up Due</span>
                <span className="bg-amber-500 text-white text-[9px] px-1.5 rounded-full font-bold">18</span>
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('duplicates'); }}
                className={`w-full flex items-center justify-between text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'leads' && activeLeadSubTab === 'duplicates' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                <span>Duplicate Leads</span>
                <span className="bg-indigo-500 text-white text-[9px] px-1.5 rounded-full font-bold">248</span>
              </button>
            </div>
          )}
        </div>

        {/* Modules Map Node (Flow Map) */}
        <button
          onClick={() => setActiveTab('map')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'map' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'hover:bg-[#152345] hover:text-white'
          }`}
        >
          <Map className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Leads Flow Diagram</span>
          <span className="ml-auto text-[9px] text-emerald-400 border border-emerald-400/30 px-1 rounded uppercase tracking-widest font-black">Steps</span>
        </button>

        {/* Campaigns */}
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'campaigns' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'hover:bg-[#152345] hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4 shrink-0" />
          <span>Campaigns</span>
        </button>

        {/* Calls & Follow-ups menu */}
        <div>
          <button
            onClick={() => {
              setActiveTab('calls');
              setCallsOpen(!callsOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'calls' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Calls & Follow-ups</span>
            </div>
            {callsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {callsOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              <button
                onClick={() => { setActiveTab('calls'); setActiveCallSubTab('today'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'calls' && activeCallSubTab === 'today' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                Today's Follow-ups
              </button>
              <button
                onClick={() => { setActiveTab('calls'); setActiveCallSubTab('all'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'calls' && activeCallSubTab === 'all' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                All Follow-ups
              </button>
              <button
                onClick={() => { setActiveTab('calls'); setActiveCallSubTab('history'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'calls' && activeCallSubTab === 'history' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                Follow-up History
              </button>
              <button
                onClick={() => { setActiveTab('calls'); setActiveCallSubTab('logs'); }}
                className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-all ${
                  activeTab === 'calls' && activeCallSubTab === 'logs' 
                    ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                }`}
              >
                Call Logs
              </button>
            </div>
          )}
        </div>

        {/* Demo Management */}
        <div>
          <button
            onClick={() => {
              setActiveTab('demos');
              setDemosOpen(!demosOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'demos' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tv className="w-4 h-4 shrink-0" />
              <span>Demo Management</span>
            </div>
            {demosOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {demosOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              {[
                { key: 'all', label: 'All Demos' },
                { key: 'scheduled', label: 'Scheduled Demos' },
                { key: 'completed', label: 'Completed Demos' },
                { key: 'cancelled', label: 'Cancelled Demos' },
                { key: 'follow-ups', label: 'Demo Follow-ups' },
                { key: 'calendar', label: 'Demo Calendar' },
                { key: 'feedback', label: 'Demo Feedback' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab('demos'); setActiveDemoSubTab(item.key); }}
                  className={`w-full flex items-center gap-2 text-left py-1.5 px-2 rounded text-xs transition-all ${
                    activeTab === 'demos' && activeDemoSubTab === item.key 
                      ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                      : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activeTab === 'demos' && activeDemoSubTab === item.key ? 'bg-blue-400' : 'bg-slate-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Proposals / Quotations */}
        <div>
          <button
            onClick={() => {
              setActiveTab('proposals');
              setProposalsOpen(!proposalsOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'proposals' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Proposals / Quotations</span>
            </div>
            {proposalsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {proposalsOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              {[
                { key: 'all', label: 'All Proposals' },
                { key: 'draft', label: 'Draft Proposals' },
                { key: 'sent', label: 'Sent Proposals' },
                { key: 'viewed', label: 'Viewed Proposals' },
                { key: 'accepted', label: 'Accepted Proposals' },
                { key: 'rejected', label: 'Rejected Proposals' },
                { key: 'expired', label: 'Expired Proposals' },
                { key: 'templates', label: 'Templates' },
                { key: 'settings', label: 'Settings' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { setActiveTab('proposals'); setActiveProposalSubTab(item.key); }}
                  className={`w-full flex items-center gap-2 text-left py-1.5 px-2 rounded text-xs transition-all ${
                    activeTab === 'proposals' && activeProposalSubTab === item.key 
                      ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                      : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activeTab === 'proposals' && activeProposalSubTab === item.key ? 'bg-blue-400' : 'bg-slate-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products & Packages */}
        <div>
          <button
            onClick={() => {
              setActiveTab('packages');
              setPackagesOpen(!packagesOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'packages' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 shrink-0" />
              <span>Products & Packages</span>
            </div>
            {packagesOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {packagesOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              {[
                { key: 'all', label: 'All Products' },
                { key: 'software', label: 'Software' },
                { key: 'websites', label: 'Websites' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { setActiveTab('packages'); setActivePackageSubTab(item.key); }}
                  className={`w-full flex items-center gap-2 text-left py-1.5 px-2 rounded text-xs transition-all ${
                    activeTab === 'packages' && activePackageSubTab === item.key 
                      ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                      : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activeTab === 'packages' && activePackageSubTab === item.key ? 'bg-blue-400' : 'bg-slate-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clients */}
        <div>
          <button
            onClick={() => {
              setActiveTab('clients');
              setClientsOpen(!clientsOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'clients' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Clients</span>
            </div>
            {clientsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {clientsOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              {[
                { key: 'all_clients', label: 'All Clients' },
                { key: 'groups', label: 'Client Groups' },
                { key: 'contacts', label: 'Contacts' },
                { key: 'activity', label: 'Client Activity' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { setActiveTab('clients'); setActiveClientSubTab(item.key); }}
                  className={`w-full flex items-center gap-2 text-left py-1.5 px-2 rounded text-xs transition-all ${
                    activeTab === 'clients' && activeClientSubTab === item.key 
                      ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                      : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activeTab === 'clients' && activeClientSubTab === item.key ? 'bg-blue-400' : 'bg-slate-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              setActiveTab('payments');
              setPaymentsOpen(!paymentsOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'payments' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 shrink-0" />
              <span>Payments</span>
            </div>
            {paymentsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {paymentsOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              {[
                { key: 'all-payments', label: 'All Payments' },
                { key: 'invoices', label: 'Invoices' },
                { key: 'recurring-payments', label: 'Recurring Payments' },
                { key: 'refunds', label: 'Refunds' },
                { key: 'payment-methods', label: 'Payment Methods' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { setActiveTab('payments'); setActivePaymentSubTab(item.key); }}
                  className={`w-full flex items-center gap-2 text-left py-1.5 px-2 rounded text-xs transition-all ${
                    activeTab === 'payments' && activePaymentSubTab === item.key 
                      ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                      : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activeTab === 'payments' && activePaymentSubTab === item.key ? 'bg-blue-400' : 'bg-slate-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reports */}
        <div>
          <button
            onClick={() => {
              setActiveTab('reports');
              setReportsOpen(!reportsOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'reports' 
                ? 'bg-[#1a2b4d] text-white font-semibold' 
                : 'hover:bg-[#152345] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Reports</span>
            </div>
            {reportsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {reportsOpen && (
            <div className="mt-1 pl-8 pr-1 space-y-0.5 border-l-2 border-[#1a2b4c] ml-5">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'sales', label: 'Sales Reports' },
                { key: 'projects', label: 'Project Reports' },
                { key: 'payments', label: 'Payment Reports' },
                { key: 'clients', label: 'Client Reports' },
                { key: 'employees', label: 'Employee Reports' },
                { key: 'custom', label: 'Custom Reports' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { setActiveTab('reports'); setActiveReportsSubTab(item.key); }}
                  className={`w-full flex items-center gap-2 text-left py-1.5 px-2 rounded text-xs transition-all ${
                    activeTab === 'reports' && activeReportsSubTab === item.key 
                      ? 'text-white bg-blue-600/35 font-semibold border-r-4 border-blue-500' 
                      : 'text-slate-400 hover:text-white hover:bg-[#152345]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activeTab === 'reports' && activeReportsSubTab === item.key ? 'bg-blue-400' : 'bg-slate-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team & Roles */}
        <button
          onClick={() => setActiveTab('team')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'team' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'hover:bg-[#152345] hover:text-white'
          }`}
        >
          <UserSquare2 className="w-4 h-4 shrink-0" />
          <span>Team & Roles</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'settings' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'hover:bg-[#152345] hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>

        {/* Support */}
        <button
          onClick={() => setActiveTab('support')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'support' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'hover:bg-[#152345] hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Support</span>
        </button>
      </div>

      {/* Today's Follow-up Floating Sidebar Card (visible exactly in screenshot bottom left) */}
      {activeTab !== 'reports' && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-[#142247] border border-[#1e346c] flex flex-col gap-3 relative overflow-hidden shrink-0">
          <div className="absolute right-[-10px] bottom-[-10px] w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center z-10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">Today's Follow-ups</span>
              <span className="text-3xl font-extrabold text-[#f43f5e] tracking-tight">{todayFollowUps > 0 ? todayFollowUps : 18}</span>
            </div>
            <CalendarDays className="w-8 h-8 text-slate-400 rotate-12 stroke-[1.5]" />
          </div>
          <button 
            onClick={() => { setActiveTab('leads'); setActiveLeadSubTab('due'); }}
            className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 transition text-[11px] font-bold text-white rounded-lg z-10 shadow"
          >
            View All →
          </button>
        </div>
      )}

      {/* Proposals Overview Card */}
      {activeTab !== 'reports' && (
        <div className="mx-4 my-2 p-4 rounded-xl bg-[#142247]/80 border border-[#1e346c] flex flex-col gap-3 relative overflow-hidden shrink-0">
          <div className="absolute right-[-10px] bottom-[-10px] w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center z-10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">Proposals Overview</span>
              <span className="text-3xl font-extrabold text-white tracking-tight">32</span>
            </div>
            <div className="relative w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center border border-blue-500/30 text-blue-400">
              <FileText className="w-5 h-5" />
              <div className="absolute -bottom-1 -right-0.5 bg-amber-500 w-3 h-3 rounded-full flex items-center justify-center text-[6px] text-white border border-[#142247]">
                ⏱
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => { setActiveTab('proposals'); setActiveProposalSubTab('all'); }}
            className="w-full flex items-center justify-between text-left transition text-[11px] font-bold text-slate-400 hover:text-white z-10 pt-1"
          >
            <span>This Month</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Reports Overview Card */}
      {activeTab === 'reports' && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-[#142247] border border-[#1e346c] flex flex-col gap-3 relative overflow-hidden shrink-0">
          <div className="absolute right-[-10px] bottom-[-10px] w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center z-10 w-full">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Reports Overview</h4>
            <BarChart3 className="w-5 h-5 text-blue-400 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5 text-[11px] font-semibold text-slate-300 z-10">
            <div className="flex justify-between">
              <span>Total Reports:</span>
              <span className="text-white font-mono">48</span>
            </div>
            <div className="flex justify-between">
              <span>Scheduled:</span>
              <span className="text-white font-mono">12</span>
            </div>
            <div className="flex justify-between">
              <span>Generated:</span>
              <span className="text-white font-mono">156</span>
            </div>
          </div>
          <button 
            onClick={() => { setActiveReportsSubTab('overview'); }}
            className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 transition text-[11px] font-bold text-white rounded-lg z-10 shadow"
          >
            View All Reports →
          </button>
        </div>
      )}

      {/* User profile with switch trigger */}
      <div className="p-4 border-t border-[#1a2b4c] relative shrink-0">
        <div 
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-3 p-1.5 hover:bg-[#152345] rounded-xl cursor-pointer transition"
        >
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-9 h-9 rounded-full ring-2 ring-blue-500/50 object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-white truncate leading-none mb-1">{currentUser.name}</h3>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold truncate leading-none">{currentUser.role}</span>
          </div>
        </div>

        {userMenuOpen && (
          <div className="absolute left-4 bottom-16 right-4 bg-[#142345] border border-[#1e386c] rounded-xl shadow-2xl p-2 z-[999]">
            <p className="text-[10px] text-slate-400 px-3 py-1 font-bold tracking-widest uppercase mb-1">Switch Persona</p>
            {mockUsers.map(u => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setUserMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition ${
                  currentUser.id === u.id 
                    ? 'bg-blue-600 text-white font-semibold shadow' 
                    : 'text-slate-300 hover:bg-[#1c305c] hover:text-white'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                <div className="leading-tight">
                  <p className="font-medium">{u.name}</p>
                  <span className="text-[8px] text-slate-400 font-bold block">{u.role}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
