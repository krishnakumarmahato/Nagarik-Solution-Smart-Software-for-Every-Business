import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Search, Plus, Upload, Bell, Calendar, Info } from 'lucide-react';

interface HeaderProps {
  onAddLeadClick?: () => void;
  onImportClick?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAddLeadClick, 
  onImportClick, 
  searchQuery, 
  setSearchQuery 
}) => {
  const { activeTab, activeLeadSubTab, currentUser } = useCRM();
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);

  // Status handler
  React.useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Format breadcrumbs nice & professional
  const getTabLabel = () => {
    switch(activeTab) {
      case 'dashboard': return 'Sales Dashboard';
      case 'leads': 
        if (activeLeadSubTab === 'website') return 'Website Leads';
        if (activeLeadSubTab === 'software') return 'Software Leads';
        if (activeLeadSubTab === 'social') return 'Social Media Leads';
        if (activeLeadSubTab === 'hot') return 'Hot Leads';
        if (activeLeadSubTab === 'due') return 'Follow-up Due';
        if (activeLeadSubTab === 'duplicates') return 'Duplicate Leads';
        return 'All Leads';
      case 'campaigns': return 'Campaigns';
      case 'calls': return 'Calls & Follow-ups';
      case 'demos': return 'Demo Management';
      case 'proposals': return 'Proposals / Quotations';
      case 'packages': return 'Products & Packages';
      case 'clients': return 'Clients';
      case 'payments': return 'Payments';
      case 'reports': return 'Reports Suite';
      case 'map': return 'Leads Module Flow Diagram';
      default: return activeTab;
    }
  };

  const getStepIndicator = () => {
    switch (activeTab) {
      case 'leads':
        if (activeLeadSubTab === 'website') return 'Step 2 of 7';
        if (activeLeadSubTab === 'software') return 'Step 3 of 7';
        if (activeLeadSubTab === 'social') return 'Step 4 of 7';
        if (activeLeadSubTab === 'hot') return 'Step 5 of 7';
        if (activeLeadSubTab === 'due') return 'Step 6 of 7';
        if (activeLeadSubTab === 'duplicates') return 'Step 7 of 7';
        return 'Step 1 of 7';
      default: return null;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none z-10 font-sans">
      {/* Tab Context / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{getTabLabel()}</h2>
            {getStepIndicator() && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase bg-blue-100/75 border border-blue-200 text-blue-600 px-2.5 py-0.5 rounded-full tracking-wide">
                  {getStepIndicator()}
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition" title="View step details">
                  <Info className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-0.5 capitalize">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#a0aec0] font-semibold">{activeTab}</span>
            {activeTab === 'leads' && (
              <>
                <span>&gt;</span>
                <span className="text-slate-600 font-bold">{activeLeadSubTab === 'all' ? 'All Leads' : activeLeadSubTab + ' Leads'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Interactive Elements */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl outline-none placeholder:text-slate-400 transition"
          />
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddLeadClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer select-none border border-blue-400/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 text-white hover:rotate-90 transition stroke-[2.5]" />
            <span>Add Lead</span>
          </button>
          <button
            onClick={onImportClick}
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs rounded-xl cursor-pointer select-none active:scale-95 transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import</span>
          </button>
        </div>

        {/* Notifications and Profile */}
        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="relative p-2 text-slate-600 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition select-none">
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-black text-white bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-white">
              12
            </span>
          </div>

          <div className="p-2 text-emerald-600 bg-[#ecfdf5] hover:bg-emerald-100 border border-emerald-100/80 rounded-xl cursor-pointer transition select-none" title="Calendar events">
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="flex items-center gap-2 pl-1">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-sm"
            />
            <div className="text-left leading-none shrink-0 hidden md:block">
              <p className="text-xs font-black text-slate-800">{currentUser.name}</p>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5 block">{currentUser.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
