import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { Demo } from '../types';
import { 
  Video, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Search, 
  Copy, 
  Check, 
  Plus, 
  Eye, 
  Edit, 
  MoreVertical, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  FileText, 
  Bell, 
  Download, 
  RefreshCw, 
  AlertCircle,
  X,
  XCircle,
  CheckCircle,
  User,
  ArrowUpRight,
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';
import { mockUsers } from '../data';
import { GoogleMeetSimulator } from './GoogleMeetSimulator';

// Define the expanded structure of a Demo item as depicted in the reference screenshot
interface EnhancedDemo extends Demo {
  city: string;
  phone: string;
  clientResponse: 'Interested' | 'Under Review' | 'Need Time' | 'Not Interested' | 'Client Busy' | '-';
  nextAction: 'Demo Today' | 'Send Proposal' | 'Reminder Sent' | 'Follow-up' | 'Close' | 'Reschedule' | 'Demo 25 My' | string;
  leadSource: string;
  createdOn: string;
  imageUrl?: string;
  rescheduledCount?: number;
}

export const DemosView: React.FC = () => {
  const { demos, addDemo, updateDemo, deleteDemo, activeDemoSubTab, setActiveDemoSubTab } = useCRM();

  // Selected Demo instance Workspace details
  const [selectedDemoId, setSelectedDemoId] = useState<string>('D-001');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMeetOpen, setIsMeetOpen] = useState(false);

  // States for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [demoByFilter, setDemoByFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Table row checkbox selectors
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form input validation schemas for new schedules
  const [newDemoForm, setNewDemoForm] = useState({
    clientName: '',
    city: 'Kathmandu',
    contactPerson: '',
    phone: '',
    productService: 'Ecommerce System',
    demoMode: 'Online' as 'Online' | 'On-site',
    demoDate: new Date().toISOString().split('T')[0],
    demoTime: '11:00 AM',
    demoStatus: 'Scheduled' as any,
    assignedTo: 'Sujan Karki',
    clientResponse: '-' as any,
    nextAction: 'Demo Today',
    leadSource: 'Google Maps',
    meetingLink: 'meet.google.com/abc-defg-hij',
    demoAgenda: 'Full system feature presentation, user role definitions.'
  });

  // Master local database containing the exact 8 item records presented in the user's reference image
  const [localDemos, setLocalDemos] = useState<EnhancedDemo[]>(() => {
    const saved = localStorage.getItem('nagarik_enhanced_demos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Local recovery warning:", e);
      }
    }
    return [
      {
        id: 'D-001',
        clientName: 'Fashion Hub',
        city: 'Kathmandu',
        contactPerson: 'Ramesh Shrestha',
        phone: '9851123456',
        productService: 'Ecommerce System',
        demoMode: 'Online',
        demoDate: '2025-05-18',
        demoTime: '11:00 AM',
        demoStatus: 'Scheduled',
        assignedTo: 'Sujan Karki',
        clientResponse: '-',
        nextAction: 'Demo Today',
        leadSource: 'Google Maps',
        createdOn: '15 May 2025, 10:15 AM',
        meetingLink: 'meet.google.com/abc-defg-hij',
        outcomeNextStep: 'Conduct complete custom billing overview.',
        remarksNotes: 'Client interested in full ecommerce with inventory.',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'D-002',
        clientName: 'ABC Law Associates',
        city: 'Kathmandu',
        contactPerson: 'Adv. Bipin Neupane',
        phone: '9841203541',
        productService: 'Court Management System',
        demoMode: 'Online',
        demoDate: '2025-05-18',
        demoTime: '02:00 PM',
        demoStatus: 'Scheduled',
        assignedTo: 'Anita Sharma',
        clientResponse: '-',
        nextAction: 'Demo Today',
        leadSource: 'Direct Search',
        createdOn: '15 May 2025, 01:45 PM',
        meetingLink: 'meet.google.com/abc-defg-hij',
        outcomeNextStep: 'Demo today, display hearing boards module.',
        remarksNotes: 'Requires calendar integrations for schedules.'
      },
      {
        id: 'D-003',
        clientName: 'Green Valley Hospital',
        city: 'Chitwan',
        contactPerson: 'Dr. Suman Kafle',
        phone: '9801234567',
        productService: 'eHMIS System',
        demoMode: 'On-site',
        demoDate: '2025-05-19',
        demoTime: '10:30 AM',
        demoStatus: 'Completed',
        assignedTo: 'Ramesh Thapa',
        clientResponse: 'Interested',
        nextAction: 'Send Proposal',
        leadSource: 'Google Maps',
        createdOn: '16 May 2025, 09:00 AM',
        meetingLink: 'meet.google.com/hospital-demo',
        outcomeNextStep: 'Send Proposal suite and customized pricing modules.',
        remarksNotes: 'Looking to link OPD records with regional billing systems.'
      },
      {
        id: 'D-004',
        clientName: 'New Shree Hardware',
        city: 'Pokhara',
        contactPerson: 'Dipak Adhikari',
        phone: '9812345678',
        productService: 'Website Development',
        demoMode: 'Online',
        demoDate: '2025-05-20',
        demoTime: '11:00 AM',
        demoStatus: 'Scheduled',
        assignedTo: 'Sujan Karki',
        clientResponse: '-',
        nextAction: 'Reminder Sent',
        leadSource: 'Facebook Ad',
        createdOn: '15 May 2025, 10:15 AM',
        meetingLink: 'meet.google.com/abc-defg-hij',
        outcomeNextStep: 'Automated notification ping sent early morning.',
        remarksNotes: 'Wants full catalog integrated with Instagram feeds.'
      },
      {
        id: 'D-005',
        clientName: 'Bright Future School',
        city: 'Bhaktapur',
        contactPerson: 'Rajesh Giri',
        phone: '9853322110',
        productService: 'School Management System',
        demoMode: 'On-site',
        demoDate: '2025-05-20',
        demoTime: '03:00 PM',
        demoStatus: 'Completed',
        assignedTo: 'Anita Sharma',
        clientResponse: 'Need Time',
        nextAction: 'Follow-up',
        leadSource: 'Referral',
        createdOn: '17 May 2025, 12:30 PM',
        meetingLink: 'meet.google.com/school-demo',
        outcomeNextStep: 'Draft school system quotation package.',
        remarksNotes: 'Board meeting required to approve licensing metrics.'
      },
      {
        id: 'D-006',
        clientName: 'City Mart',
        city: 'Lalitpur',
        contactPerson: 'Binod Shrestha',
        phone: '9801122335',
        productService: 'Ecommerce System',
        demoMode: 'Online',
        demoDate: '2025-05-21',
        demoTime: '11:30 AM',
        demoStatus: 'Completed',
        assignedTo: 'Bikram Raut',
        clientResponse: 'Not Interested',
        nextAction: 'Close',
        leadSource: 'Instagram Page',
        createdOn: '18 May 2025, 08:30 AM',
        meetingLink: 'meet.google.com/mart-demo',
        outcomeNextStep: 'Client decided to keep conventional channels.',
        remarksNotes: 'Prefers simple catalog without online transaction portal.'
      },
      {
        id: 'D-007',
        clientName: 'Himalayan Traders',
        city: 'Butwal',
        contactPerson: 'Ganesh Rawal',
        phone: '9841555677',
        productService: 'Inventory System',
        demoMode: 'On-site',
        demoDate: '2025-05-22',
        demoTime: '10:00 AM',
        demoStatus: 'Cancelled',
        assignedTo: 'Ramesh Thapa',
        clientResponse: 'Client Busy',
        nextAction: 'Reschedule',
        leadSource: 'Google Maps',
        createdOn: '19 May 2025, 04:00 PM',
        meetingLink: 'meet.google.com/steel-demo',
        outcomeNextStep: 'Reschedule demo for subsequent weeks.',
        remarksNotes: 'Travel conflict, requested callback near weekend.'
      },
      {
        id: 'D-008',
        clientName: 'Om Steel Suppliers',
        city: 'Biratnagar',
        contactPerson: 'Surendra Tamang',
        phone: '9851025510',
        productService: 'Inventory System',
        demoMode: 'Online',
        demoDate: '2025-05-23',
        demoTime: '02:30 PM',
        demoStatus: 'Rescheduled',
        assignedTo: 'Anita Sharma',
        clientResponse: 'Interested',
        nextAction: 'Demo 25 My',
        leadSource: 'LinkedIn Outreach',
        createdOn: '20 May 2025, 10:00 AM',
        meetingLink: 'meet.google.com/steel-demo',
        outcomeNextStep: 'Re-initialize customized inventory overview.',
        remarksNotes: 'Needs tracking of weight scales metrics in CBM calculations.'
      }
    ];
  });

  // Sync to database
  useEffect(() => {
    localStorage.setItem('nagarik_enhanced_demos', JSON.stringify(localDemos));
  }, [localDemos]);

  // Utility to grab representative avatar image
  const getAvatar = (name: string): string => {
    const user = mockUsers.find(u => u.name === name);
    return user ? user.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
  };

  // Status tag UI formatting
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed':
        return <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-emerald-500/20">Completed</span>;
      case 'Scheduled':
        return <span className="bg-blue-500/10 text-blue-600 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-blue-500/20">Scheduled</span>;
      case 'Cancelled':
        return <span className="bg-rose-500/10 text-rose-600 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-rose-500/20">Cancelled</span>;
      case 'Rescheduled':
        return <span className="bg-purple-500/10 text-purple-600 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-purple-500/20">Rescheduled</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-slate-200">{status}</span>;
    }
  };

  // Client response tag UI formatting
  const getClientResponseBadge = (response: string) => {
    switch(response) {
      case 'Interested':
        return <span className="text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50/20">Interested</span>;
      case 'Need Time':
        return <span className="text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50/20">Need Time</span>;
      case 'Not Interested':
        return <span className="text-rose-600 border border-rose-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50/20">Not Interested</span>;
      case 'Client Busy':
        return <span className="text-slate-500 text-[11px] font-semibold">{response}</span>;
      case '-':
      default:
        return <span className="text-slate-400 font-bold">-</span>;
    }
  };

  // Product/Service tag colors
  const getProductTag = (product: string) => {
    switch(product) {
      case 'Ecommerce System':
        return <span className="bg-[#ecfdf5] text-[#10b981] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#10b981]/15 leading-none">Ecommerce System</span>;
      case 'Court Management System':
        return <span className="bg-[#f5f3ff] text-[#8b5cf6] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#8b5cf6]/15 leading-none">Court Management System</span>;
      case 'eHMIS System':
        return <span className="bg-[#eff6ff] text-[#3b82f6] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#3b82f6]/15 leading-none">eHMIS System</span>;
      case 'Website Development':
        return <span className="bg-[#ecfdf5] text-[#06b6d4] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#06b6d4]/15 leading-none">Website Development</span>;
      case 'School Management System':
        return <span className="bg-[#fdf2f8] text-[#ec4899] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#ec4899]/15 leading-none font-mono">School Management System</span>;
      case 'Inventory System':
        return <span className="bg-[#fffbeb] text-[#f59e0b] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#f59e0b]/15 leading-none">Inventory System</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md leading-none">{product}</span>;
    }
  };

  // Core handler to finalize schedules
  const handleCreateDemo = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `D-${Date.now().toString().slice(-3)}`;
    const newRecord: EnhancedDemo = {
      ...newDemoForm,
      id: generatedId,
      createdOn: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outcomeNextStep: 'Demo scheduled, prepare initial materials.',
    };

    setLocalDemos([newRecord, ...localDemos]);
    setSelectedDemoId(newRecord.id);
    setIsAddOpen(false);

    // Call context to keep in sync
    addDemo({
      clientName: newRecord.clientName,
      contactPerson: newRecord.contactPerson,
      productService: newRecord.productService,
      demoMode: newRecord.demoMode,
      demoDate: newRecord.demoDate,
      demoTime: newRecord.demoTime,
      demoStatus: newRecord.demoStatus as any,
      assignedTo: newRecord.assignedTo,
      outcomeNextStep: newRecord.outcomeNextStep,
      meetingLink: newRecord.meetingLink,
      demoAgenda: newRecord.demoAgenda,
      remarksNotes: newRecord.remarksNotes
    });
  };

  const handleUpdateDemo = (updated: EnhancedDemo) => {
    const nextList = localDemos.map(d => d.id === updated.id ? updated : d);
    setLocalDemos(nextList);
    // Sync back to context
    updateDemo({
      id: updated.id,
      clientName: updated.clientName,
      contactPerson: updated.contactPerson,
      productService: updated.productService,
      demoMode: updated.demoMode,
      demoDate: updated.demoDate,
      demoTime: updated.demoTime,
      demoStatus: updated.demoStatus as any,
      assignedTo: updated.assignedTo,
      outcomeNextStep: updated.outcomeNextStep || '',
      meetingLink: updated.meetingLink,
      demoAgenda: updated.demoAgenda,
      remarksNotes: updated.remarksNotes
    });
  };

  const handleDeleteDemo = (id: string) => {
    if (confirm("Are you sure you want to delete this Demo entry?")) {
      const nextList = localDemos.filter(d => d.id !== id);
      setLocalDemos(nextList);
      deleteDemo(id);
      if (selectedDemoId === id && nextList.length > 0) {
        setSelectedDemoId(nextList[0].id);
      }
    }
  };

  // Bulk CSV file export simulator
  const handleExportCSV = () => {
    const csvHeaders = "ID,Business Name,City,Product,Demo Date,Demo By,Status,Response,Next Action\n";
    const csvRows = localDemos.map(d => 
      `"${d.id}","${d.clientName}","${d.city}","${d.productService}","${d.demoDate} ${d.demoTime}","${d.assignedTo}","${d.demoStatus}","${d.clientResponse}","${d.nextAction}"`
    ).join("\n");
    const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Nagarik_Demos_Database.csv');
    a.click();
  };

  // Row selectors
  const toggleRowSelected = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredDemos.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredDemos.map(d => d.id));
    }
  };

  // Filtering of main demo list based on subtabs and visual options
  const filteredDemos = localDemos.filter(demo => {
    // 1. Sidebar tab filter matches
    if (activeDemoSubTab === 'scheduled' && demo.demoStatus !== 'Scheduled') return false;
    if (activeDemoSubTab === 'completed' && demo.demoStatus !== 'Completed') return false;
    if (activeDemoSubTab === 'cancelled' && demo.demoStatus !== 'Cancelled') return false;
    if (activeDemoSubTab === 'follow-ups' && !demo.nextAction) return false;

    // 2. Search box text matching
    const query = searchQuery.toLowerCase();
    const textMatch = 
      demo.clientName.toLowerCase().includes(query) ||
      demo.city.toLowerCase().includes(query) ||
      demo.contactPerson.toLowerCase().includes(query) ||
      demo.phone.includes(query) ||
      demo.assignedTo.toLowerCase().includes(query) ||
      demo.productService.toLowerCase().includes(query);
    if (!textMatch) return false;

    // 3. Dropdowns logic
    if (statusFilter && demo.demoStatus !== statusFilter) return false;
    if (productFilter && demo.productService !== productFilter) return false;
    if (demoByFilter && demo.assignedTo !== demoByFilter) return false;
    if (sourceFilter && demo.leadSource !== sourceFilter) return false;
    if (dateFilter && demo.demoDate !== dateFilter) return false;

    return true;
  });

  const selectedDemo = localDemos.find(d => d.id === selectedDemoId) || localDemos[0];

  // Helper values for display rendering
  const totalDemosCount = localDemos.length;
  const scheduledCount = localDemos.filter(d => d.demoStatus === 'Scheduled').length;
  const completedCount = localDemos.filter(d => d.demoStatus === 'Completed').length;
  const cancelledCount = localDemos.filter(d => d.demoStatus === 'Cancelled').length;
  const rescheduledCount = localDemos.filter(d => d.demoStatus === 'Rescheduled').length;
  const conversionWonCount = localDemos.filter(d => d.demoStatus === 'Completed' && d.clientResponse === 'Interested').length;

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-50 font-sans text-left min-h-0 overflow-hidden h-full">
      
      {/* LEFT PORTION: Grid / List view catalog */}
      <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
        
        {/* TOP COMPREHENSIVE RESPONSIVE SUBTABS STRIP BAR */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 shrink-0 overflow-x-auto scrollbar-none select-none">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {[
              { key: 'all', label: 'All Demos' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
              { key: 'follow-ups', label: 'Follow-ups' },
              { key: 'calendar', label: 'Activity Calendar' },
              { key: 'feedback', label: 'Feedback & Reviews' }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveDemoSubTab(item.key)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition whitespace-nowrap cursor-pointer ${
                  activeDemoSubTab === item.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 transition leading-none shrink-0 cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Demo</span>
          </button>
        </div>

        {/* CONTAINER FOR THE MAIN SCROLLABLE CONTENT (METRIC CARDS, FILTERS, TABLE, OR CALENDAR / FEEDBACK VIEW) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
        
        {/* SUBTAB RENDERING - SCREEN 1: CALENDAR VIEW */}
        {activeDemoSubTab === 'calendar' ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Demo Activity Calendar Planner</h3>
                <p className="text-xs text-slate-400 mt-1">Review scheduled products presentation timeslots across interactive calendar index</p>
              </div>
              <button 
                onClick={() => setActiveDemoSubTab('all')} 
                className="px-4 py-1.5 border border-slate-200 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition"
              >
                ← Back to Spreadsheet View
              </button>
            </div>

            {/* Simulated 2025 Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-slate-50 p-3 text-center text-xs font-black text-slate-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, idx) => {
                const dayNum = idx - 3; // Offset to start May on Thursday (May 1, 2025 starts on Thursday)
                const isValidDay = dayNum > 0 && dayNum <= 31;
                const paddedDay = isValidDay ? `2025-05-${dayNum.toString().padStart(2, '0')}` : null;
                const dayEvents = paddedDay ? localDemos.filter(d => d.demoDate === paddedDay) : [];

                return (
                  <div key={idx} className="bg-white min-h-[110px] p-2.5 transition flex flex-col justify-between hover:bg-slate-50/50">
                    <span className={`text-[11px] font-black tracking-tight ${isValidDay ? 'text-slate-755' : 'text-slate-300'}`}>
                      {isValidDay ? dayNum : ''}
                    </span>
                    <div className="space-y-1 mt-1 flex-grow overflow-y-auto">
                      {dayEvents.map(ev => (
                        <div 
                          key={ev.id} 
                          onClick={() => { setSelectedDemoId(ev.id); }}
                          className={`text-[9px] p-1.5 rounded-lg border cursor-pointer font-bold leading-tight select-none transition ${
                            ev.demoStatus === 'Completed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : ev.demoStatus === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : ev.demoStatus === 'Rescheduled'
                              ? 'bg-purple-50 text-purple-700 border-purple-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}
                        >
                          <div className="font-extrabold truncate">{ev.clientName}</div>
                          <div className="mt-0.5 text-[8px] opacity-75">{ev.demoTime}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) 
        
        // SUBTAB RENDERING - SCREEN 2: FEEDBACK WORKSPACE
        : activeDemoSubTab === 'feedback' ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Client Demo Reviews & Feedbacks</h3>
                <p className="text-xs text-slate-400 mt-1">Review star ratings, core remarks, and experience testimonies registered after system checkouts</p>
              </div>
              <button 
                onClick={() => setActiveDemoSubTab('all')} 
                className="px-4 py-1.5 border border-slate-200 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition"
              >
                ← Back to Spreadsheet View
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localDemos.filter(d => d.demoStatus === 'Completed').map(ev => (
                <div key={ev.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 text-xs flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-none">{ev.clientName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold mt-1 block">{ev.productService}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < (ev.clientResponse === 'Interested' ? 5 : i < 4 ? 4 : 3) ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed mt-2.5">
                      "{ev.remarksNotes || 'Great systems layout flow! Presentation covered all user modules, payment triggers feel optimized.'}"
                    </p>
                  </div>
                  <div className="border-t border-slate-200/50 pt-2.5 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Presented By: {ev.assignedTo}</span>
                    <span>Date: {ev.demoDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) 
        
        // STANDARD LAYOUT WITH SPREADSHEETS AND METRIC BAR (MATCHING IMAGE EXACTLY)
        : (
          <>
            {/* Top Stat Metrics Cards Row (Matching 6 cards of screenshot) */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {/* Card 1: Total Demos */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left relative overflow-hidden transition hover:shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 block">Total Demos</span>
                  <div className="p-1 px-1.5 rounded-lg bg-blue-150 text-blue-600 block"><Calendar className="w-4 h-4" /></div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{152 + (totalDemosCount - 8)}</h3>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-1 flex items-center gap-0.5">
                    <span className="text-[#10b981]">↑ 18.6%</span> <span className="text-slate-400 font-medium">from last month</span>
                  </span>
                </div>
              </div>

              {/* Card 2: Scheduled */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left relative overflow-hidden transition hover:shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 block">Scheduled</span>
                  <div className="p-1 px-1.5 rounded-lg bg-emerald-100 text-emerald-600 block"><Calendar className="w-4 h-4" /></div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{48 + (scheduledCount - 4)}</h3>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-1 flex items-center gap-0.5">
                    <span className="text-[#10b981]">↑ 12.5%</span> <span className="text-slate-400 font-medium">from last month</span>
                  </span>
                </div>
              </div>

              {/* Card 3: Completed */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left relative overflow-hidden transition hover:shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 block">Completed</span>
                  <div className="p-1 px-1.5 rounded-lg bg-indigo-100 text-[#4f46e5] block"><CheckCircle2 className="w-4 h-4" /></div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{68 + (completedCount - 3)}</h3>
                  <span className="text-[10px] text-[#10b981] font-bold block mt-1 flex items-center gap-0.5">
                    <span className="text-[#10b981]">↑ 22.4%</span> <span className="text-slate-400 font-medium">from last month</span>
                  </span>
                </div>
              </div>

              {/* Card 4: Cancelled */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left relative overflow-hidden transition hover:shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 block">Cancelled</span>
                  <div className="p-1 px-1.5 rounded-lg bg-orange-100 text-orange-650 block"><XCircle className="w-4 h-4" /></div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{12 + (cancelledCount - 1)}</h3>
                  <span className="text-[10px] text-orange-500 font-bold block mt-1 flex items-center gap-0.5">
                    <span className="text-rose-500">↓ 8.3%</span> <span className="text-slate-400 font-medium">from last month</span>
                  </span>
                </div>
              </div>

              {/* Card 5: Rescheduled */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left relative overflow-hidden transition hover:shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 block">Rescheduled</span>
                  <div className="p-1 px-1.5 rounded-lg bg-teal-100 text-teal-650 block"><RefreshCw className="w-4 h-4" /></div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{24 + (rescheduledCount - 1)}</h3>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-1 flex items-center gap-0.5">
                    <span className="text-[#10b981]">↑ 14.2%</span> <span className="text-slate-400 font-medium">from last month</span>
                  </span>
                </div>
              </div>

              {/* Card 6: Conversion (Won) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left relative overflow-hidden transition hover:shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 block">Conversion (Won)</span>
                  <div className="p-1 px-1.5 rounded-lg bg-slate-100 text-slate-600 block"><ArrowUpRight className="w-4 h-4" /></div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{18 + (conversionWonCount - 2)}</h3>
                  <span className="text-[10px] text-[#10b981] font-bold block mt-1 flex items-center gap-0.5">
                    <span className="text-[#10b981]">↑ 16.7%</span> <span className="text-slate-400 font-medium">from last month</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-4 text-xs font-bold shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Text search */}
                <div className="relative flex-grow max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by business name, contact, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-400 text-xs font-semibold text-slate-700 bg-slate-50/50 rounded-xl outline-none transition"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center text-slate-400 gap-1.5 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-none bg-transparent text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </div>

                {/* Product Dropdown */}
                <div className="flex items-center text-slate-400 gap-1.5 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="border-none bg-transparent text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="">All Products</option>
                    <option value="Ecommerce System">Ecommerce System</option>
                    <option value="Court Management System">Court Management System</option>
                    <option value="eHMIS System">eHMIS System</option>
                    <option value="Website Development">Website Development</option>
                    <option value="School Management System">School Management System</option>
                    <option value="Inventory System">Inventory System</option>
                  </select>
                </div>

                {/* Demo By Dropdown */}
                <div className="flex items-center text-slate-400 gap-1.5 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <select
                    value={demoByFilter}
                    onChange={(e) => setDemoByFilter(e.target.value)}
                    className="border-none bg-transparent text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="">All Demo By</option>
                    <option value="Sujan Karki">Sujan Karki</option>
                    <option value="Anita Sharma">Anita Sharma</option>
                    <option value="Bikram Raut">Bikram Raut</option>
                    <option value="Ramesh Thapa">Ramesh Thapa</option>
                  </select>
                </div>

                {/* Sources Dropdown */}
                <div className="flex items-center text-slate-400 gap-1.5 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="border-none bg-transparent text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="">All Sources</option>
                    <option value="Google Maps">Google Maps</option>
                    <option value="Facebook Ad">Facebook Ad</option>
                    <option value="Instagram Page">Instagram Page</option>
                    <option value="LinkedIn Outreach">LinkedIn Outreach</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>

                {/* Date Dropdown */}
                <div className="relative">
                  <input
                    type="date"
                    value={dateFilter}
                    placeholder="Demo Date"
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 focus:border-blue-400 text-slate-600 bg-slate-50/50 rounded-xl outline-none cursor-pointer"
                  />
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('');
                    setProductFilter('');
                    setDemoByFilter('');
                    setSourceFilter('');
                    setDateFilter('');
                  }}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 font-bold transition rounded-xl cursor-pointer"
                >
                  Reset
                </button>

                {/* Export button */}
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold transition rounded-xl text-slate-700 inline-flex items-center gap-1.5 ml-auto shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Core Leads table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto w-full select-none">
                <table className="w-full border-collapse text-left text-xs font-semibold text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 border-b border-slate-250 font-bold uppercase text-[10px] tracking-wider select-none h-11">
                      <th className="py-2.5 px-4 w-10 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedRows.length === filteredDemos.length && filteredDemos.length > 0}
                          onChange={toggleAllRows}
                          className="w-3.5 h-3.5 accent-blue-600"
                        />
                      </th>
                      <th className="py-2.5 px-3 w-10">#</th>
                      <th className="py-2.5 px-4">Business Name</th>
                      <th className="py-2.5 px-4">Product / Service</th>
                      <th className="py-2.5 px-4">Demo Date & Time</th>
                      <th className="py-2.5 px-4">Demo By</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Client Response</th>
                      <th className="py-2.5 px-4">Next Action</th>
                      <th className="py-2.5 px-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDemos.map((demo, idx) => (
                      <tr 
                        key={demo.id}
                        onClick={() => setSelectedDemoId(demo.id)}
                        className={`border-b border-slate-200 transition h-14 hover:bg-slate-50/50 cursor-pointer ${
                          selectedDemoId === demo.id ? 'bg-[#f8fafc]' : ''
                        }`}
                      >
                        {/* checkbox selectors */}
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox"
                            checked={selectedRows.includes(demo.id)}
                            onChange={() => toggleRowSelected(demo.id)}
                            className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                          />
                        </td>
                        
                        {/* Row Index */}
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px] font-bold">{idx + 1}</td>

                        {/* Business Name */}
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-extrabold text-slate-800 block text-[13px]">{demo.clientName}</span>
                            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{demo.city}</span>
                          </div>
                        </td>

                        {/* Product / Service tag */}
                        <td className="py-3 px-4">{getProductTag(demo.productService)}</td>

                        {/* Demo Date & Time */}
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-700 block text-[12px]">{new Date(demo.demoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="text-[10px] text-slate-400 block font-bold mt-0.5">{demo.demoTime}</span>
                          </div>
                        </td>

                        {/* Demo By avatar and role designation details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5 pr-2">
                            <img 
                              src={getAvatar(demo.assignedTo)} 
                              alt={demo.assignedTo} 
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="leading-tight">
                              <span className="text-[12px] font-black text-slate-800 block">{demo.assignedTo}</span>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5 block tracking-wide">
                                {mockUsers.find(u => u.name === demo.assignedTo)?.role || 'Executive'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status badge pill */}
                        <td className="py-3 px-4">{getStatusBadge(demo.demoStatus)}</td>

                        {/* Client Response status tag */}
                        <td className="py-3 px-4">{getClientResponseBadge(demo.clientResponse)}</td>

                        {/* Next Action link tag */}
                        <td className="py-3 px-4">
                          <button 
                            type="button"
                            className="text-blue-600 hover:text-blue-500 font-extrabold text-[12px] cursor-pointer hover:underline"
                          >
                            {demo.nextAction}
                          </button>
                        </td>

                        {/* Actions icons drawer list */}
                        <td className="py-3 px-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button 
                              onClick={() => { setSelectedDemoId(demo.id); }}
                              className="p-1 px-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition rounded-lg"
                              title="Review details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setSelectedDemoId(demo.id); }}
                              className="p-1 px-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition rounded-lg"
                              title="Edit schedule details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDemo(demo.id)}
                              className="p-1 px-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition rounded-lg"
                              title="Remove"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table pagination footer */}
              <div className="p-4 bg-white border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-400">
                <div className="select-none text-[11px] font-bold">
                  Showing 1 to {filteredDemos.length} of {totalDemosCount + 144} entries
                </div>

                <div className="flex items-center gap-1">
                  <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[11px] text-slate-500 disabled:opacity-50">‹</button>
                  <button className="px-3 py-1.5 rounded-lg text-[11px] bg-blue-600 text-white shadow font-black">1</button>
                  <button className="px-3 py-1.5 rounded-lg text-[11px] border border-slate-200 hover:bg-slate-50 text-slate-500">2</button>
                  <button className="px-3 py-1.5 rounded-lg text-[11px] border border-slate-200 hover:bg-slate-50 text-slate-500">3</button>
                  <button className="px-3 py-1.5 rounded-lg text-[11px] border border-slate-200 hover:bg-slate-50 text-slate-500">4</button>
                  <button className="px-3 py-1.5 rounded-lg text-[11px] border border-slate-200 hover:bg-slate-50 text-slate-500">5</button>
                  <span className="px-2 text-slate-300">...</span>
                  <button className="px-3 py-1.5 rounded-lg text-[11px] border border-slate-200 hover:bg-slate-50 text-slate-500">19</button>
                  <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[11px] text-slate-500">›</button>
                </div>

                {/* Page Size select control */}
                <div className="inline-flex items-center text-slate-400 gap-1.5 px-2 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg font-bold">
                  <select className="border-none bg-transparent text-slate-700 outline-none cursor-pointer">
                    <option value="10">10 / page</option>
                    <option value="20">20 / page</option>
                    <option value="50">50 / page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Charts Footer Section (3 card columns layout matching bottom section of image exactly) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* Box 1: Demos by Product (Donut Chart representation) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left select-none max-w-full">
                <div>
                  <h4 className="text-sm font-black text-slate-800">Demos by Product</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Distribution percentage shares across active products index</p>
                </div>

                <div className="flex items-center gap-4 mt-4 flex-wrap sm:flex-nowrap">
                  {/* Conic Donut SVG representation */}
                  <div className="relative w-28 h-28 shrink-0 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      {/* Segment 1: Ecommerce (23%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="23 77" strokeDashoffset="100" />
                      {/* Segment 2: Website (18%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0ea5e9" strokeWidth="3.2" strokeDasharray="18 82" strokeDashoffset="77" />
                      {/* Segment 3: Court Management (17%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3.2" strokeDasharray="17 83" strokeDashoffset="59" />
                      {/* Segment 4: eHMIS System (14%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" strokeDasharray="14 86" strokeDashoffset="42" />
                      {/* Segment 5: School Management (12%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="3.2" strokeDasharray="12 88" strokeDashoffset="28" />
                      {/* Segment 6: Others (15%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="16" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-inner">
                      <span className="text-[15px] font-black leading-none text-slate-800">152</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5 uppercase tracking-wider font-extrabold">Demos</span>
                    </div>
                  </div>

                  {/* Legends */}
                  <div className="space-y-1.5 flex-1 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />Ecommerce System</span>
                      <span className="text-slate-800 font-extrabold text-right shrink-0">35 (23%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]" />Website Dev</span>
                      <span className="text-slate-800 font-extrabold text-right shrink-0">28 (18%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />Court MGMT</span>
                      <span className="text-slate-800 font-extrabold text-right shrink-0">26 (17%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />eHMIS System</span>
                      <span className="text-slate-800 font-extrabold text-right shrink-0">22 (14%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />School Software</span>
                      <span className="text-slate-800 font-extrabold text-right shrink-0">18 (12%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />Others</span>
                      <span className="text-slate-800 font-extrabold text-right shrink-0">23 (15%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Demos by Status (Donut Chart representation) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left select-none max-w-full">
                <div>
                  <h4 className="text-sm font-black text-slate-800">Demos by Status</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Conversion success rates across communicate milestones</p>
                </div>

                <div className="flex items-center gap-4 mt-4 flex-wrap sm:flex-nowrap">
                  {/* Conic Donut SVG representation */}
                  <div className="relative w-28 h-28 shrink-0 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      {/* Segment 1: Scheduled (32%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="32 68" strokeDashoffset="100" />
                      {/* Segment 2: Completed (45%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" strokeDasharray="45 55" strokeDashoffset="68" />
                      {/* Segment 3: Cancelled (8%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3.2" strokeDasharray="8 92" strokeDashoffset="23" />
                      {/* Segment 4: Rescheduled (15%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="15" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-inner">
                      <span className="text-[15px] font-black leading-none text-slate-800">100%</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5 uppercase tracking-wider font-extrabold">Status</span>
                    </div>
                  </div>

                  {/* Legends */}
                  <div className="space-y-2 flex-1 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />Scheduled</span>
                      <span className="text-slate-800 font-extrabold text-right">48 (32%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />Completed</span>
                      <span className="text-slate-800 font-extrabold text-right">68 (45%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />Cancelled</span>
                      <span className="text-slate-800 font-extrabold text-right">12 (8%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />Rescheduled</span>
                      <span className="text-slate-800 font-extrabold text-right">24 (15%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Upcoming Demos Feed List */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between text-left select-none">
                <div>
                  <h4 className="text-sm font-black text-slate-800">Upcoming Demos</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Coming presentation schedules chronological dashboard</p>
                </div>

                <div className="space-y-3.5 mt-4">
                  {localDemos.filter(d => d.demoStatus === 'Scheduled').slice(0, 3).map((demo) => (
                    <div key={demo.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 hover:bg-slate-100/30 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-slate-800 block text-[11px] truncate leading-none mb-1">{demo.clientName}</span>
                          <span className="text-[9px] text-slate-400 font-bold block truncate leading-none">{demo.productService}</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-slate-100 hover:bg-slate-200/50 px-2.5 py-1 rounded text-slate-500 font-bold tracking-tight text-right shrink-0">
                        {new Date(demo.demoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {demo.demoTime}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveDemoSubTab('calendar')}
                  className="mt-4 flex items-center justify-center w-full py-2 border border-slate-200 hover:bg-slate-50/50 transition font-bold text-xs text-blue-600 rounded-xl gap-1 hover:scale-101 cursor-pointer"
                >
                  <span>View Calendar →</span>
                </button>
              </div>

            </div>
          </>
        )}
      </div> {/* closes inner scrollable container */}
    </div> {/* closes outer non-scrollable flex-grow left column container */}

    {/* RIGHT WORKSPACE RESPONSIVE DRAWER PANEL */}
    <div className="shrink-0 flex select-none font-sans text-left">
      {/* Backdrop overlay for mobile devices */}
      {selectedDemoId && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[80] lg:hidden transition-opacity duration-200 animate-fade-in"
          onClick={() => setSelectedDemoId('')}
        />
      )}
      
      {/* Drawer Container Panel */}
      <aside className={`fixed lg:sticky top-0 right-0 bottom-0 z-[90] lg:z-10 w-full lg:w-[400px] bg-white border-l border-slate-150 lg:border-slate-200 lg:shadow-none shadow-2xl flex flex-col h-full lg:h-[calc(100vh-64px)] overflow-y-auto shrink-0 transition-all duration-300 ${
        selectedDemoId ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 hidden lg:flex'
      } p-6 space-y-6 scrollbar-thin`}>
        {selectedDemo ? (
          <div className="space-y-6 flex-grow flex flex-col justify-between">
            {/* Drawer Header info */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-150 shrink-0 select-none bg-white">
              <div>
                <div className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1">
                  <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
                  <span>Demo Workspace Entry</span>
                </div>
                <h3 className="text-base font-black text-slate-800 leading-tight truncate max-w-[170px] sm:max-w-[220px]">{selectedDemo.clientName}</h3>
                <span className="text-[9px] text-slate-400 font-bold mt-1 block tracking-wider uppercase font-mono">ID: {selectedDemo.id}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  {selectedDemo.demoStatus === 'Scheduled' && (
                    <span className="bg-[#eff6ff] text-blue-600 border border-blue-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block">Scheduled</span>
                  )}
                  {selectedDemo.demoStatus === 'Completed' && (
                    <span className="bg-[#ecfdf5] text-emerald-600 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block">Completed</span>
                  )}
                  {selectedDemo.demoStatus === 'Cancelled' && (
                    <span className="bg-[#fff1f2] text-rose-600 border border-rose-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block">Cancelled</span>
                  )}
                  {selectedDemo.demoStatus === 'Rescheduled' && (
                    <span className="bg-[#faf5ff] text-purple-600 border border-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block">Rescheduled</span>
                  )}
                </div>
                
                {/* Responsive Dismiss Button */}
                <button 
                  type="button"
                  onClick={() => setSelectedDemoId('')}
                  className="p-1 px-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition"
                  title="Close Details Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overlaid Exterior Photo with Key Contact information Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs text-xs font-semibold">
              <div className="relative h-28 bg-slate-100">
                <img 
                  src={selectedDemo.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"} 
                  alt={selectedDemo.clientName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                  <div className="text-white leading-tight">
                    <span className="text-[14px] font-black block">{selectedDemo.clientName}</span>
                    <span className="text-[9px] opacity-80 block tracking-wide mt-1 inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedDemo.city}, Bagmati</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3.5 bg-slate-50/50">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-none">Contact Person</span>
                      <span className="text-[12px] font-extrabold text-slate-800 block mt-1 leading-none">{selectedDemo.contactPerson} (Owner)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
                  <span className="text-slate-800 font-mono text-[12px] font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedDemo.phone}
                  </span>
                  
                  {/* WhatsApp contact prompt */}
                  <a 
                    href={`https://wa.me/977${selectedDemo.phone}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 px-2.5 border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg text-[10px] font-black tracking-tight inline-flex items-center gap-1 transition"
                  >
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Presentation Specific Details List */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3.5 font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Product / Service</span>
                <span className="text-slate-800 font-extrabold text-right">{selectedDemo.productService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Demo Date & Time</span>
                <span className="text-slate-800 font-extrabold text-right">{selectedDemo.demoDate} • {selectedDemo.demoTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Demo Mode</span>
                <span className="text-slate-800 font-extrabold text-right">{selectedDemo.demoMode === 'Online' ? 'Google Meet' : 'On-site Visit'}</span>
              </div>

              {selectedDemo.demoMode === 'Online' && selectedDemo.meetingLink && (
                <div className="space-y-2">
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold truncate flex-1 leading-none">
                      {selectedDemo.meetingLink}
                    </span>
                    <button 
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDemo.meetingLink || '');
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="p-1.5 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80 rounded-lg transition shrink-0 cursor-pointer"
                      title="Copy Link"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMeetOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer animate-pulse animate-duration-1000"
                  >
                    <Video className="w-4 h-4 text-white shrink-0" />
                    <span>Join Google Meet Call</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-200/50 pt-2.5">
                <span className="text-slate-400 font-bold">Demo By</span>
                <div className="flex items-center gap-1.5 text-right">
                  <img src={getAvatar(selectedDemo.assignedTo)} className="w-5 h-5 rounded-full object-cover" alt={selectedDemo.assignedTo} />
                  <span className="text-slate-800 font-extrabold text-[11px]">{selectedDemo.assignedTo}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Lead Source</span>
                <span className="text-slate-800 font-extrabold text-right">{selectedDemo.leadSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Created On</span>
                <span className="text-slate-800 font-extrabold text-right">{selectedDemo.createdOn}</span>
              </div>
            </div>

            {/* Custom Status & Interactive response update forms */}
            <div className="space-y-4 pt-1 text-xs">
              <h4 className="font-extrabold text-slate-850 uppercase text-[10px] tracking-wider block">Demo Status & Response</h4>

              {/* Status selectors */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Status</label>
                <select
                  value={selectedDemo.demoStatus}
                  onChange={(e) => handleUpdateDemo({ ...selectedDemo, demoStatus: e.target.value as any })}
                  className="w-full border border-slate-200 px-3 py-2 bg-slate-50 hover:bg-slate-100/30 rounded-xl outline-none font-bold text-slate-700 focus:border-blue-400"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>

              {/* Client responses selection metrics */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Client Response</label>
                <select
                  value={selectedDemo.clientResponse}
                  onChange={(e) => handleUpdateDemo({ ...selectedDemo, clientResponse: e.target.value as any })}
                  className="w-full border border-slate-200 px-3 py-2 bg-slate-50 hover:bg-slate-100/30 rounded-xl outline-none font-bold text-slate-700 focus:border-blue-400"
                >
                  <option value="-">-</option>
                  <option value="Interested">Interested</option>
                  <option value="Need Time">Need Time</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Client Busy">Client Busy</option>
                </select>
              </div>

              {/* Next action hyperlink toggle */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Next Action</label>
                  <select
                    value={selectedDemo.nextAction}
                    onChange={(e) => handleUpdateDemo({ ...selectedDemo, nextAction: e.target.value })}
                    className="w-full border border-slate-200 px-2.5 py-2 bg-slate-50 hover:bg-slate-100/30 rounded-xl outline-none font-bold text-slate-700 focus:border-blue-400"
                  >
                    <option value="Demo Today">Demo Today</option>
                    <option value="Send Proposal">Send Proposal</option>
                    <option value="Reminder Sent">Reminder Sent</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Close">Close</option>
                    <option value="Reschedule">Reschedule</option>
                  </select>
                </div>

                {/* Followup time slots choice */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={selectedDemo.nextFollowUpDate || "2025-05-19"}
                    onChange={(e) => handleUpdateDemo({ ...selectedDemo, nextFollowUpDate: e.target.value })}
                    className="w-full border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/30 rounded-xl outline-none text-slate-650 focus:border-blue-400 font-bold"
                  />
                </div>
              </div>

              {/* Comments box area */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Remarks / Notes</label>
                <textarea
                  value={selectedDemo.remarksNotes || ''}
                  onChange={(e) => handleUpdateDemo({ ...selectedDemo, remarksNotes: e.target.value })}
                  placeholder="Record summary observations..."
                  rows={2}
                  className="w-full border border-slate-200 p-2.5 bg-slate-50/50 focus:bg-white rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-xs font-semibold text-slate-700 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  alert(`Information and follow-ups successfully validated for ${selectedDemo.clientName}!`);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-black text-white text-xs rounded-xl shadow-md cursor-pointer transition select-none active:scale-98"
              >
                Update Demo
              </button>
            </div>

            {/* Quick Actions grid widget (Matching 6 elegant icons from screenshot) */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-slate-850 uppercase text-[10px] tracking-wider block">Quick Actions</h4>
              
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-500 tracking-tight">
                {/* 1. Reschedule Demo */}
                <button 
                  onClick={() => {
                    const promptDate = prompt("Reschedule Presentation Date (YYYY-MM-DD):", selectedDemo.demoDate);
                    if (promptDate) {
                      handleUpdateDemo({ ...selectedDemo, demoDate: promptDate, demoStatus: 'Rescheduled', nextAction: 'Reschedule' });
                    }
                  }}
                  className="flex flex-col items-center justify-center p-2.5 bg-purple-50 hover:bg-purple-100 text-[#8b5cf6] border border-purple-200/50 rounded-xl cursor-pointer transition select-none"
                >
                  <RefreshCw className="w-4 h-4 mb-1.5" />
                  <span>Reschedule Demo</span>
                </button>

                {/* 2. Send Reminder */}
                <button 
                  onClick={() => {
                    alert(`Reminder schedule for ${selectedDemo.clientName} pre-compiled and successfully broadcasted!`);
                    handleUpdateDemo({ ...selectedDemo, nextAction: 'Reminder Sent' });
                  }}
                  className="flex flex-col items-center justify-center p-2.5 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/40 rounded-xl cursor-pointer transition select-none"
                >
                  <Bell className="w-4 h-4 mb-1.5" />
                  <span>Send Reminder</span>
                </button>

                {/* 3. Send WhatsApp */}
                <a 
                  href={`https://wa.me/977${selectedDemo.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 bg-green-50 hover:bg-green-100 text-[#10b981] border border-green-200/50 rounded-xl cursor-pointer transition select-none"
                >
                  <Send className="w-4 h-4 mb-1.5" />
                  <span>Send WhatsApp</span>
                </a>

                {/* 4. Create Proposal */}
                <button 
                  onClick={() => {
                    alert(`Draft Quotation PR-2025-001 created automatically for ${selectedDemo.clientName}.`);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/50 rounded-xl cursor-pointer transition select-none"
                >
                  <FileText className="w-4 h-4 mb-1.5" />
                  <span>Create Proposal</span>
                </button>

                {/* 5. Add Note */}
                <button 
                  onClick={() => {
                    const promptNote = prompt("Add a quick remark note:");
                    if (promptNote) {
                      handleUpdateDemo({ ...selectedDemo, remarksNotes: (selectedDemo.remarksNotes ? selectedDemo.remarksNotes + ' ' : '') + promptNote });
                    }
                  }}
                  className="flex flex-col items-center justify-center p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/50 rounded-xl cursor-pointer transition select-none"
                >
                  <Edit className="w-4 h-4 mb-1.5" />
                  <span>Add Note</span>
                </button>

                {/* 6. Mark as Completed */}
                <button 
                  onClick={() => {
                    handleUpdateDemo({ ...selectedDemo, demoStatus: 'Completed', clientResponse: 'Interested', nextAction: 'Send Proposal' });
                    alert(`${selectedDemo.clientName} demo marked as Completed (Client Response: Interested, Next Action: Send Proposal)!`);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 bg-teal-50 hover:bg-teal-100 text-teal-600 border border-teal-200/50 rounded-xl cursor-pointer transition select-none"
                >
                  <CheckCircle2 className="w-4 h-4 mb-1.5" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-slate-400 text-center select-none h-full min-h-[300px]">
            <Video className="w-10 h-10 text-slate-350 bg-slate-50 p-2.5 rounded-full animate-bounce stroke-[1.5]" />
            <h4 className="text-xs font-black text-slate-600 uppercase mt-4">Review selected workspace</h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Double-click on any client row in the list to trigger active management consoles</p>
          </div>
        )}
      </aside>
    </div>

      {/* SCHEDULE DEMO MODAL POPUP DIALOGUE */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-[450px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto text-slate-800 animate-slide-up text-left">
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 mb-4 select-none">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Schedule Product Presentation</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-full bg-slate-100 text-slate-400 hover:text-slate-650 transition">✕</button>
            </div>

            {/* Quick Load Preset templates */}
            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 select-none">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                <span>Instant Presentation Presets</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                {[
                  { label: '🏥 Himalayan Hospital', presetIdx: 0 },
                  { label: '⚖️ Everest Law DMS', presetIdx: 1 },
                  { label: '🛒 Mega Mart POS', presetIdx: 2 }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const data = [
                        { clientName: 'Himalayan Hospital HMIS', selectedProduct: 'eHMIS Solution Suite', demoDate: '2025-06-15', demoMode: 'Online', demoDuration: '45 Min', salesRepAssigned: 'Gaurab', phone: '9851011223' },
                        { clientName: 'Everest Law Board Room', selectedProduct: 'Enterprise Court DMS', demoDate: '2025-06-16', demoMode: 'On-Site', demoDuration: '60 Min', salesRepAssigned: 'Rohan', phone: '9841887766' },
                        { clientName: 'Mega Mart Lalitpur', selectedProduct: 'Omnichannel POS ERP', demoDate: '2025-06-17', demoMode: 'Online', demoDuration: '30 Min', salesRepAssigned: 'Saraswati', phone: '9803112233' }
                      ][preset.presetIdx];
                      setNewDemoForm({
                        ...newDemoForm,
                        clientName: data.clientName,
                        selectedProduct: data.selectedProduct,
                        demoDate: data.demoDate,
                        demoMode: data.demoMode as any,
                        demoDuration: data.demoDuration,
                        salesRepAssigned: data.salesRepAssigned,
                        phone: data.phone,
                        demoTime: '11:00 AM',
                        assignedUsers: [data.salesRepAssigned],
                        remarksNotes: `Quick scheduled preset product review with ${data.salesRepAssigned}.`
                      });
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/20 text-[10px] font-bold text-slate-700 transition flex items-center justify-between cursor-pointer leading-tight"
                  >
                    <span className="truncate">{preset.label}</span>
                    <Sparkles className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateDemo} className="space-y-4 text-xs font-bold text-slate-505">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Business Client Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Retail Center"
                  value={newDemoForm.clientName}
                  onChange={(e) => setNewDemoForm({ ...newDemoForm, clientName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Contact Person Name</label>
                  <input 
                    type="text" 
                    placeholder="Principal/Owner"
                    value={newDemoForm.contactPerson}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Contact Number</label>
                  <input 
                    type="text" 
                    placeholder="98********"
                    value={newDemoForm.phone}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Product Suite</label>
                  <select 
                    value={newDemoForm.productService}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, productService: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Ecommerce System">Ecommerce System</option>
                    <option value="Court Management System">Court Management System</option>
                    <option value="eHMIS System">eHMIS System</option>
                    <option value="Website Development">Website Development</option>
                    <option value="School Management System">School Management System</option>
                    <option value="Inventory System">Inventory System</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Mode</label>
                  <select 
                    value={newDemoForm.demoMode}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, demoMode: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Online">Online Video Meet</option>
                    <option value="On-site">On-site Visit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Presentation Month/Date</label>
                  <input 
                    type="date"
                    value={newDemoForm.demoDate}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, demoDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Starting Timeslot</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 11:30 AM"
                    value={newDemoForm.demoTime}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, demoTime: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Assigned Demo By Representative</label>
                  <select 
                    value={newDemoForm.assignedTo}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, assignedTo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Sujan Karki">Sujan Karki</option>
                    <option value="Anita Sharma">Anita Sharma</option>
                    <option value="Bikram Raut">Bikram Raut</option>
                    <option value="Ramesh Thapa">Ramesh Thapa</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Region/City</label>
                  <input 
                    type="text" 
                    placeholder="City"
                    value={newDemoForm.city}
                    onChange={(e) => setNewDemoForm({ ...newDemoForm, city: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Meeting Link / Virtual Room</label>
                <input 
                  type="text" 
                  placeholder="meet.google.com/..."
                  value={newDemoForm.meetingLink}
                  onChange={(e) => setNewDemoForm({ ...newDemoForm, meetingLink: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Presentation Agenda / Primary Concerns</label>
                <textarea 
                  placeholder="Details of client requirements..."
                  value={newDemoForm.demoAgenda}
                  onChange={(e) => setNewDemoForm({ ...newDemoForm, demoAgenda: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs h-16 font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3 text-xs select-none">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-md cursor-pointer transition">Create Demo Schedule</button>
                <button type="button" onClick={() => setIsAddOpen(false)} className="py-3 px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition">Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION TRIGGER OVERLAY BUTTON AT BOTTOM LEFT EXACTLY COMPLIANT WITH SCHEDULE DEMO BUTTON IN SCREENSHOT */}
      <div className="fixed bottom-6 left-6 z-40 select-none hidden xl:block animate-pulse-slow">
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 font-extrabold hover:bg-blue-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 px-5 py-3 rounded-full flex items-center gap-2 border border-blue-450 cursor-pointer transition text-xs uppercase"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Schedule Demo</span>
        </button>
      </div>

      {isMeetOpen && selectedDemo && (
        <GoogleMeetSimulator 
          onClose={() => setIsMeetOpen(false)}
          clientName={selectedDemo.clientName}
          contactPerson={selectedDemo.contactPerson}
          productName={selectedDemo.productService}
        />
      )}

    </div>
  );
};
