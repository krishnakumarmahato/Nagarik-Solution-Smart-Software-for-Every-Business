import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { LeadsView } from './components/LeadsView';
import { DemosView } from './components/DemosView';
import { ProposalsView } from './components/ProposalsView';
import { PaymentsView } from './components/PaymentsView';
import { ReportsView } from './components/ReportsView';
import { CampaignsView } from './components/CampaignsView';
import { ClientsView } from './components/ClientsView';
import { PackagesView } from './components/PackagesView';
import { LeadsSubModulesMap } from './components/LeadsSubModulesMap';
import { Phone, Calendar, Clock, Video, ListCollapse, Upload, X, FileSpreadsheet, Check, Database, Search, Play, Volume2, Plus, MessageSquare } from 'lucide-react';

const PRESET_IMPORT_DATASETS = [
  {
    id: 'ktm_retail',
    name: 'Kathmandu Retail Business Pool',
    recordCount: 4,
    items: [
      { businessName: 'BhatBhateni Superstore Alco', contactName: 'Min Bahadur Gurung', phone: '9851025510', email: 'bhatbhateni@retail.com.np', category: 'Software Leads', status: 'Verification', remark: 'Requires multi-branch sales ledger package.' },
      { businessName: 'Civil Department Retail Group', contactName: 'Sagar Gurung', phone: '9841203541', email: 'sagar@civilmall.com', category: 'Software Leads', status: 'Under Discussion', remark: 'Looking to integrate payment APIs.' },
      { businessName: 'New Road Electronic Hub', contactName: 'Rajesh Shrestha', phone: '9803451120', email: 'rajesh.newroad@gmail.com', category: 'Website Leads', status: 'Verification', remark: 'Static ecommerce template inquiry.' },
      { businessName: 'Durbar Marg Fashion Outlet', contactName: 'Punam Basnet', phone: '9818456230', email: 'punam@durbarfashion.com', category: 'Website Leads', status: 'Under Discussion', remark: 'Requires catalog with Instagram feed.' }
    ]
  },
  {
    id: 'pokhara_hotel',
    name: 'Pokhara Lakeside Hotels Pool',
    recordCount: 3,
    items: [
      { businessName: 'Fishtail Lodge lakeside', contactName: 'Karan Thapa', phone: '9856012340', email: 'karan@fishtail.com.np', category: 'Software Leads', status: 'Verification', remark: 'Requires hotel PMS software setup.' },
      { businessName: 'Hotel Temple Tree resort', contactName: 'Nisha Karki', phone: '9846059120', email: 'nisha@templetree.com', category: 'Software Leads', status: 'Under Discussion', remark: 'Needs custom SMS client reminder package.' },
      { businessName: 'Mt. Kailash Spa & Retreat', contactName: 'Suraj Sharma', phone: '9801234567', email: 'suraj@mtkailash.com', category: 'Website Leads', status: 'Verification', remark: 'Static dynamic booking webpage template enquiry.' }
    ]
  }
];

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, setActiveLeadSubTab, addLead } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom states for importing
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState('ktm_retail');
  const [customCsvInput, setCustomCsvInput] = useState('Patan Craft Center,Sagar Maharjan,9851088490,patan.craft@nepal.org,Inquiry for static website\nDhulikhel organic Farm,Sushila Giri,9841556210,dhulikhel.organic@gmail.com,SaaS system demo scheduling request');
  const [importMethod, setImportMethod] = useState<'preset' | 'csv'>('preset');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerNewLeadShortcut = () => {
    setActiveTab('leads');
    setActiveLeadSubTab('all');
  };

  const runPresetBulkImport = (datasetId: string) => {
    const dataset = PRESET_IMPORT_DATASETS.find(d => d.id === datasetId);
    if (!dataset) return;
    
    dataset.items.forEach(item => {
      addLead({
        businessName: item.businessName,
        contactPerson: item.contactName,
        phone: item.phone,
        email: item.email,
        assignedTo: 'Sujan Karki',
        leadSource: 'Bulk Excel Upload',
        interestProduct: item.category === 'Software Leads' ? 'School Software Suite' : 'Corporate Dynamic Catalog Portal',
        stage: 'Inquiry',
        status: item.status,
        nepaliDate: '2083 Jestha 15',
        lastActivity: 'Bulk Imported via Excel Upload Workspace',
        nextFollowUpDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
        remarks: item.remark
      });
    });

    setIsImportOpen(false);
    triggerToast(`Database Append Success! Imported ${dataset.recordCount} validated leads to the CRM pool.`);
  };

  const runCsvBulkImport = () => {
    if (!customCsvInput.trim()) return;
    const lines = customCsvInput.split('\n').filter(l => l.trim() && l.includes(','));
    let importedCount = 0;

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        addLead({
          businessName: parts[0],
          contactPerson: parts[1],
          phone: parts[2],
          email: parts[3] || 'info@business.com.np',
          assignedTo: 'Sujan Karki',
          leadSource: 'Manual CSV Upload',
          interestProduct: 'School Software Suite',
          stage: 'Inquiry',
          status: 'Verification',
          nepaliDate: '2083 Jestha 15',
          lastActivity: 'Inserted via CSV copy paste parser tool',
          nextFollowUpDate: new Date(Date.now() + 4*24*60*60*1000).toISOString().split('T')[0],
          remarks: parts[4] || 'Batch imported row.'
        });
        importedCount++;
      }
    });

    setIsImportOpen(false);
    triggerToast(`CSV Compiled Success! Appended ${importedCount} accounts to active lead subtab indices.`);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'leads':
        return <LeadsView searchQuery={searchQuery} />;
      case 'map':
        return <LeadsSubModulesMap />;
      case 'demos':
        return <DemosView />;
      case 'proposals':
        return <ProposalsView />;
      case 'payments':
        return <PaymentsView />;
      case 'reports':
        return <ReportsView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'clients':
        return <ClientsView />;
      case 'packages':
        return <PackagesView />;
      case 'calls':
        return <CallsListView />;
      default:
        return <DashboardView />;
    }
  };

  const activeDataset = PRESET_IMPORT_DATASETS.find(d => d.id === selectedDatasetId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 font-sans text-left">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Controls bar */}
        {activeTab !== 'packages' && activeTab !== 'clients' && (
          <Header 
            onAddLeadClick={triggerNewLeadShortcut}
            onImportClick={() => setIsImportOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Selected Screen viewport */}
        <div className="flex-1 overflow-hidden">
          {renderActiveView()}
        </div>
      </div>

      {/* Spreadsheet / Excel Bulk Import Dialogue Open */}
      {isImportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] select-none text-slate-800 animate-fade-in text-left font-sans">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-7 border border-slate-100 flex flex-col gap-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Direct Spreadsheet Metadata Importer</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Stream bulk spreadsheet directory logs straight into active cached CRM states</p>
                </div>
              </div>
              <button 
                onClick={() => setIsImportOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Importer Method Selector */}
            <div className="flex gap-2">
              <button 
                onClick={() => setImportMethod('preset')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  importMethod === 'preset' ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500' : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Select Pre-Validated Templates</span>
              </button>
              <button 
                onClick={() => setImportMethod('csv')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  importMethod === 'csv' ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500' : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Paste custom CSV Lines</span>
              </button>
            </div>

            {importMethod === 'preset' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Select Corporate Business Directory</label>
                  <select 
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg outline-none text-xs font-semibold"
                  >
                    {PRESET_IMPORT_DATASETS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.recordCount} validated records)</option>
                    ))}
                  </select>
                </div>

                {/* Table Live Preview */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 block tracking-widest uppercase">Spreadsheet Preview Header Matrices</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[160px] overflow-y-auto">
                    <table className="w-full border-collapse text-left text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase text-[9px]">
                          <th className="py-2 px-3">Business Name</th>
                          <th className="py-2 px-3">POC</th>
                          <th className="py-2 px-3">Contact Number</th>
                          <th className="py-2 px-3">Inquiry category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeDataset?.items.map((it, idx) => (
                          <tr key={idx} className="border-b border-slate-100 font-semibold text-slate-700 hover:bg-slate-50/75">
                            <td className="py-2 px-3 text-slate-900">{it.businessName}</td>
                            <td className="py-2 px-3">{it.contactName}</td>
                            <td className="py-2 px-3 font-mono text-[10px]">{it.phone}</td>
                            <td className="py-2 px-3 text-slate-500">{it.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setIsImportOpen(false)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={() => runPresetBulkImport(selectedDatasetId)}
                    className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white transition rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Append ({activeDataset?.recordCount} Leads)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Paste Comma-Separated Values (CSV Format)</label>
                  <p className="text-[9px] text-slate-400 font-medium mb-1">Standard Row Matrice: <strong>BusinessName, ContactPerson, MobileNo, EmailAddress, Notes</strong> (One row per line)</p>
                  <textarea 
                    rows={4}
                    value={customCsvInput}
                    onChange={(e) => setCustomCsvInput(e.target.value)}
                    placeholder="e.g. Acme Corporation, Sandesh Karki, 9841029410, sandesh@acme.com, Requires license demo"
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg outline-none focus:border-blue-500 font-mono text-[10px]"
                  />
                </div>

                <div className="flex gap-2 pt-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setIsImportOpen(false)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={runCsvBulkImport}
                    className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white transition rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Parse and Append Row Indices</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Toast Notification element global workspace */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-850/60 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-[99999] text-xs font-bold animate-slide-left select-none max-w-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping-slow shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};

// Full-featured and highly interactive Call Center & Follow-ups Suite
const CallsListView: React.FC = () => {
  const { leads, activeCallSubTab, setActiveCallSubTab, updateLead, currentUser, addLead } = useCRM();
  
  // Local state for search, filters, dialer
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  
  // Custom Add Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    assignedTo: 'Sujan Karki',
    followUpStatus: 'Follow-up Required',
    nextFollowUpDate: '2026-05-30',
    leadPriority: 'Warm' as 'Hot' | 'Warm' | 'Cold',
    category: 'IT Services',
    leadSource: 'Walk-in',
    notes: '',
    type: 'Outbound Call',
    date: '2026-05-30',
    time: '12:00 PM',
    outcome: 'Answered',
    duration: '2m 30s',
    sentiment: 'Positive',
  });
  
  // Simulation Dialer Modal state
  const [activeDialLead, setActiveDialLead] = useState<any | null>(null);
  const [dialDuration, setDialDuration] = useState(0);
  const [dialIntervalId, setDialIntervalId] = useState<any | null>(null);
  const [dialNotes, setDialNotes] = useState('');
  const [dialOutcome, setDialOutcome] = useState('Interested');
  const [callSentiment, setCallSentiment] = useState('Positive');
  
  // Audio playback simulator
  const [activeAudioLog, setActiveAudioLog] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Mocked historical follow-up tracks with local storage persistence
  const [historicalLogs, setHistoricalLogs] = useState<any[]>(() => {
    const stored = localStorage.getItem('nagarik_historical_logs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 'H-001', businessName: 'Himalayan Coffee House', contactPerson: 'Nirajan Shrestha', phone: '9851122334', type: 'Outbound Call', date: '28 May 2026', time: '10:15 AM', outcome: 'Answered', notes: 'Agreed for Business Proposal. Sent starter catalog.', agent: 'Sujan Karki', duration: '3m 45s', sentiment: 'Positive' },
      { id: 'H-002', businessName: 'Everest Yoga Studio', contactPerson: 'Pranita Gurung', phone: '9848877665', type: 'WhatsApp Msg', date: '27 May 2026', time: '02:30 PM', outcome: 'Interested', notes: 'Inquired about customized scheduling integrations.', agent: 'Anita Sharma', duration: '-', sentiment: 'Positive' },
      { id: 'H-003', businessName: 'Green Valley Organics', contactPerson: 'Ramesh Adhikari', phone: '9812345678', type: 'On-site Demo', date: '26 May 2026', time: '11:00 AM', outcome: 'Demo Completed', notes: 'Gave full software demo on site. Very satisfied.', agent: 'Bikram Raut', duration: '45m 0s', sentiment: 'Very Positive' },
      { id: 'H-004', businessName: 'Kathmandu Pet Care', contactPerson: 'Sunita Joshi', phone: '9856677889', date: '25 May 2026', time: '04:12 PM', outcome: 'No Answer', notes: 'Attempted callback. Voicemail dropped.', agent: 'Ramesh Thapa', duration: '22s', sentiment: 'Neutral' },
      { id: 'H-005', businessName: 'BuyNepal Online Mart', contactPerson: 'Binod Shrestha', phone: '9801122335', type: 'Outbound Call', date: '24 May 2026', time: '01:05 PM', outcome: 'Answered', notes: 'Discussed online multi-payment gateway setup.', agent: 'Sujan Karki', duration: '5m 12s', sentiment: 'Positive' }
    ];
  });

  const saveHistoricalLogs = (newLogs: any[]) => {
    setHistoricalLogs(newLogs);
    localStorage.setItem('nagarik_historical_logs', JSON.stringify(newLogs));
  };

  // Handle active call timer simulation
  const startCallSimulation = (lead: any) => {
    setActiveDialLead(lead);
    setDialDuration(0);
    setDialNotes('');
    setDialOutcome('Interested');
    setCallSentiment('Positive');
    
    const interval = setInterval(() => {
      setDialDuration(prev => prev + 1);
    }, 1000);
    setDialIntervalId(interval);
  };

  const stopAndSaveCall = () => {
    if (dialIntervalId) {
      clearInterval(dialIntervalId);
    }
    
    // Create new historical log record
    const formattedDuration = `${Math.floor(dialDuration / 60)}m ${(dialDuration % 60).toString().padStart(2, '0')}s`;
    const newLog = {
      id: `H-${Date.now().toString().slice(-3)}`,
      businessName: activeDialLead.businessName,
      contactPerson: activeDialLead.contactPerson,
      phone: activeDialLead.phone,
      type: 'Outbound Call',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outcome: dialOutcome,
      notes: dialNotes || 'Simulated call completed.',
      agent: activeDialLead.assignedTo || currentUser?.name || 'Sujan Karki',
      duration: formattedDuration,
      sentiment: callSentiment
    };

    saveHistoricalLogs([newLog, ...historicalLogs]);

    // Update real lead status conditionally
    const updatedLead = {
      ...activeDialLead,
      followUpStatus: dialOutcome === 'Interested' ? 'Proposal Sent' : 
                       dialOutcome === 'Not Reachable' ? 'Call Attempted' : 
                       dialOutcome === 'No Interest' ? 'Client Closed' : 'Follow-up Required',
      remarks: dialNotes ? dialNotes : activeDialLead.remarks,
      nextFollowUpDate: dialOutcome === 'Interested' ? 'In 3 Days' : activeDialLead.nextFollowUpDate
    };
    
    updateLead(updatedLead);
    
    // Clear and end modal
    setActiveDialLead(null);
    setDialIntervalId(null);
    triggerToast(`Dial recorded! Simulated Call Log saved for ${activeDialLead.businessName}.`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get filtered lists based on navigation filter values
  const getSubTabData = () => {
    switch (activeCallSubTab) {
      case 'today': {
        const todayLeads = leads.filter(l => 
          l.followUpStatus !== 'Client Closed' &&
          (l.nextFollowUpDate === 'Today' || l.nextFollowUpDate === '2026-05-30' || l.nextFollowUpDate === 'Today\'s Follow-up')
        );
        if (todayLeads.length > 0) return todayLeads;
        return leads.filter(l => 
          (l.followUpStatus === 'Follow-up Required' || l.leadPriority === 'Hot') &&
          l.followUpStatus !== 'Client Closed'
        ).slice(0, 5);
      }
      case 'all':
        return leads.filter(l => l.followUpStatus !== 'Client Closed');
      case 'history':
        return historicalLogs;
      case 'logs':
        // Map historical into a call-logs representation
        return historicalLogs.filter(h => h.type === 'Outbound Call');
      default:
        return leads;
    }
  };

  const rawData = getSubTabData();

  // Apply textual Search Query & secondary dropdowns
  const filteredData = rawData.filter((item: any) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      item.businessName.toLowerCase().includes(term) ||
      item.contactPerson.toLowerCase().includes(term) ||
      (item.phone && item.phone.includes(term)) ||
      (item.notes && item.notes.toLowerCase().includes(term)) ||
      (item.agent && item.agent.toLowerCase().includes(term));
      
    const matchesOutcome = outcomeFilter ? (item.outcome || item.followUpStatus) === outcomeFilter : true;
    const matchesAgent = agentFilter ? (item.agent || item.assignedTo) === agentFilter : true;
    
    return matchesSearch && matchesOutcome && matchesAgent;
  });

  return (
    <div className="flex-grow flex flex-col h-full bg-slate-50 font-sans overflow-hidden text-left relative">
      
      {/* Toast feedback alerts */}
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-bounce-in">
          <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-1 text-slate-400 hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header bar controls with Subtab selector */}
      <div className="p-5 bg-white border-b border-slate-200 shrink-0 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-md font-black text-slate-800 tracking-tight flex items-center gap-1.5 leading-none">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Call Center Terminal & CRM Follow-ups</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Manage, filter, and simulate outbound customer dial queues & track action outcomes.</p>
          </div>

          {/* Subtab selection pills layout */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50 gap-0.5">
            <button
              onClick={() => setActiveCallSubTab('today')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition ${
                activeCallSubTab === 'today' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              Today's Follow-ups
            </button>
            <button
              onClick={() => setActiveCallSubTab('all')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition ${
                activeCallSubTab === 'all' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              All Follow-ups
            </button>
            <button
              onClick={() => setActiveCallSubTab('history')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition ${
                activeCallSubTab === 'history' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              Follow-up History
            </button>
            <button
              onClick={() => setActiveCallSubTab('logs')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition ${
                activeCallSubTab === 'logs' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              Call Logs
            </button>
          </div>
        </div>
      </div>

      {/* Stats summary banner row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 shrink-0 bg-slate-50 border-b border-slate-200/40 select-none">
        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-2xs">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Dial Queue Size</span>
          <h4 className="text-lg font-black text-slate-800 tracking-tight mt-0.5">{leads.filter(l => l.followUpStatus !== 'Client Closed').length} leads</h4>
          <span className="text-[9px] text-blue-600 font-extrabold block mt-0.5">Ready for communication</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-2xs">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Scheduled for Today</span>
          <h4 className="text-lg font-black text-slate-800 tracking-tight mt-0.5">{leads.filter(l => (l.followUpStatus === 'Follow-up Required' || l.leadPriority === 'Hot') && l.followUpStatus !== 'Client Closed').length} follow-ups</h4>
          <span className="text-[9px] text-rose-500 font-extrabold block mt-0.5 animate-pulse">Action required</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-2xs">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Historical Logs Recorded</span>
          <h4 className="text-lg font-black text-slate-800 tracking-tight mt-0.5">{historicalLogs.length} attempts</h4>
          <span className="text-[9px] text-emerald-500 font-extrabold block mt-0.5">100% database audit trails</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-2xs">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Average Call Duration</span>
          <h4 className="text-lg font-black text-slate-800 tracking-tight mt-0.5 font-sans">3m 12s</h4>
          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">From {historicalLogs.filter(h => h.type === 'Outbound Call').length} voice logs</span>
        </div>
      </div>

      {/* Secondary filter inputs and search bar inside sub-page */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Internal text search and filters */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 font-bold" />
            <input
              type="text"
              placeholder={`Search in ${
                activeCallSubTab === 'today' ? "Today's Follow-ups" :
                activeCallSubTab === 'all' ? "All Follow-ups" :
                activeCallSubTab === 'history' ? "Follow-up History" :
                "Call Logs"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 rounded-lg outline-none focus:border-blue-400"
            />
          </div>

          {/* Outcome Filter dropdown */}
          <div className="flex items-center text-xs text-slate-400 gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold">
            <span>Outcome/Status</span>
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="border-none bg-transparent text-slate-800 font-bold outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {activeCallSubTab === 'history' || activeCallSubTab === 'logs' ? (
                <>
                  <option value="Answered">Answered</option>
                  <option value="Demo Completed">Demo Completed</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Busy">Busy</option>
                  <option value="Interested">Interested</option>
                </>
              ) : (
                <>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Interested">Interested</option>
                  <option value="Call Attempted">Call Attempted</option>
                </>
              )}
            </select>
          </div>

          {/* Agent representative filter */}
          <div className="flex items-center text-xs text-slate-400 gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold">
            <span>Agent Representative</span>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="border-none bg-transparent text-slate-800 font-bold outline-none cursor-pointer"
            >
              <option value="">All Reps</option>
              <option value="Sujan Karki">Sujan Karki</option>
              <option value="Anita Sharma">Anita Sharma</option>
              <option value="Bikram Raut">Bikram Raut</option>
              <option value="Ramesh Thapa">Ramesh Thapa</option>
            </select>
          </div>
        </div>

        {/* Dynamic badge counter & Add action button */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 select-none uppercase hidden md:inline">
            Displaying {filteredData.length} records of {rawData.length} total
          </span>
          <button
            id="btn-add-call-record"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 border border-blue-400/20 active:scale-95 text-[11px] text-white font-extrabold uppercase rounded-lg shadow-2xs transition cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span>
              {activeCallSubTab === 'today' ? "Add Today's Follow-up" :
               activeCallSubTab === 'all' ? "Add Follow-up" :
               activeCallSubTab === 'history' ? "Add Follow-up History" :
               "Add Call Log"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="flex-grow p-5 overflow-auto">
        {filteredData.length === 0 ? (
          <div className="h-full bg-white rounded-2xl border border-slate-150 p-12 text-center flex flex-col items-center justify-center">
            <Phone className="w-10 h-10 text-slate-400 bg-slate-50 p-2.5 rounded-full animate-bounce" />
            <h4 className="text-xs font-black text-slate-700 uppercase mt-4">No matching records found</h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm">No follow-ups match your active search terms, outcome triggers, or sales representative filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((item: any, idx: number) => {
              const isLeadObj = !item.type; // Lead objects do not contain historical 'type'
              
              return (
                <div 
                  key={idx} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/50 hover:border-slate-300 hover:shadow-2xs transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">ID: {item.id}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="text-[9px] font-black text-blue-650 bg-blue-50 px-1.5 rounded uppercase tracking-wider">{item.category || item.type || 'CRM Activity'}</span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-800 leading-none">{item.businessName}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Contact: {item.contactPerson} • {item.phone}</p>
                    
                    {/* Notes display for touch-history or logs */}
                    {item.notes && (
                      <div className="bg-slate-50 rounded px-2.5 py-1.5 text-[10px] text-slate-600 border border-slate-100 font-medium italic mt-2">
                        "{item.notes}"
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3.5 mt-2.5 text-[10px] text-slate-500 font-semibold select-none leading-none">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date Logged: {item.nextFollowUpDate || item.date}</span>
                      </div>
                      
                      {item.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Duration: {item.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Right Hand Column */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3.5 border-t sm:border-t-0 border-slate-105 pt-3 sm:pt-0 shrink-0">
                    <div className="text-left sm:text-right leading-none select-none">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase block tracking-wider ${
                        (item.outcome || item.followUpStatus) === 'Answered' || (item.outcome || item.followUpStatus) === 'Demo Completed' || (item.outcome || item.followUpStatus) === 'Proposal Sent'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : (item.outcome || item.followUpStatus) === 'Follow-up Required' || (item.outcome || item.followUpStatus) === 'Interested'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {item.outcome || item.followUpStatus}
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Rep: {item.agent || item.assignedTo}</p>
                    </div>

                    {/* Operational Trigger Buttons based on Sub-pages context */}
                    {isLeadObj ? (
                      <button 
                        onClick={() => startCallSimulation(item)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase rounded-lg border border-blue-400/20 hover:scale-102 flex items-center gap-1.5 transition cursor-pointer select-none"
                      >
                        <Phone className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        <span>Dials client</span>
                      </button>
                    ) : (
                      item.duration !== '-' && (
                        <button 
                          onClick={() => {
                            if (activeAudioLog === item.id) {
                              setActiveAudioLog(null);
                              triggerToast('Recording track paused.');
                            } else {
                              setActiveAudioLog(item.id);
                              triggerToast(`Simulating playback dialogue recording for ${item.businessName}...`);
                            }
                          }}
                          className={`px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 font-extrabold text-[10px] uppercase rounded-lg shadow-2xs flex items-center gap-1.5 transition cursor-pointer select-none ${
                            activeAudioLog === item.id ? 'border-emerald-300 text-emerald-700 bg-emerald-50/20' : 'text-slate-600'
                          }`}
                        >
                          {activeAudioLog === item.id ? (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                              <span>Pause Recording</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-slate-500 hover:rotate-6 transition" />
                              <span>Play Record</span>
                            </>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Real Time Dial Interactive Simulator modal overlay */}
      {activeDialLead && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-fade-in font-sans">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 w-full max-w-md shadow-2xl flex flex-col space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs uppercase font-black tracking-wider text-rose-500">Live Voice Call Dial-out</span>
              </div>
              <button 
                onClick={() => { setActiveDialLead(null); if (dialIntervalId) clearInterval(dialIntervalId); }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Call Metadata */}
            <div className="bg-slate-50 p-4 rounded-xl text-center space-y-2 border border-slate-100">
              <span className="text-[10px] uppercase tracking-widest font-extrabold bg-[#ecfdf5] border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">Connected</span>
              <h4 className="text-sm font-black text-slate-800 leading-tight mt-1">{activeDialLead.businessName}</h4>
              <p className="text-xs text-slate-605 mt-0.5">{activeDialLead.contactPerson} • {activeDialLead.phone}</p>
              
              {/* Voice counter */}
              <div className="flex items-center justify-center gap-1.5 mt-3 text-slate-800">
                <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="font-mono font-extrabold text-sm tracking-widest">{formatTimer(dialDuration)}</span>
              </div>
            </div>

            {/* Logging Call Outcome Controls (Simulated form) */}
            <form onSubmit={(e) => { e.preventDefault(); stopAndSaveCall(); }} className="space-y-3.5 text-xs text-left">
              
              <div className="space-y-1">
                <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[10px]">Discussed Outcome</label>
                <select 
                  value={dialOutcome} 
                  onChange={(e) => setDialOutcome(e.target.value)}
                  className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                >
                  <option value="Interested">👍 Interested (Send business proposal)</option>
                  <option value="Follow-up Required">🕒 Hard Callback (Dial out later)</option>
                  <option value="Demo Scheduled">💻 Schedule online software demo</option>
                  <option value="Not Reachable">🚫 Busy/Not Reachable</option>
                  <option value="No Interest">❌ Closed (No target interest)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[10px]">Client Sentiment</label>
                  <select 
                    value={callSentiment} 
                    onChange={(e) => setCallSentiment(e.target.value)}
                    className="w-full border border-slate-200 outline-none rounded-lg px-2.5 py-1.5 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                  >
                    <option value="Very Positive">🤩 Very Enthusiastic</option>
                    <option value="Positive">💪 Positive / Inquiring</option>
                    <option value="Neutral">😐 Neutral / Passive</option>
                    <option value="Critical">⚠️ Hesitant / Budget Constraints</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[10px]">Assigned Agent</label>
                  <input 
                    type="text" 
                    value={activeDialLead.assignedTo || currentUser?.name || 'Sujan Karki'} 
                    disabled 
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-400 bg-slate-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[10px]">Agent Dialogue Notes / Remarks</label>
                <textarea 
                  value={dialNotes}
                  onChange={(e) => setDialNotes(e.target.value)}
                  placeholder="Paste details of the discussion here. E.g., Wants website redesigned with full invoice payment gateway integrated."
                  rows={2}
                  className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-semibold text-slate-700 bg-slate-50 focus:border-blue-400 placeholder:text-slate-400"
                ></textarea>
              </div>

              {/* Confirm submit row */}
              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setActiveDialLead(null); if (dialIntervalId) clearInterval(dialIntervalId); }}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2 rounded-lg transition text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/20 text-white font-extrabold py-2 rounded-lg transition text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                >
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  <span>Complete & Save Dial</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Real Time Create Record overlay */}
      {isAddModalOpen && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-fade-in font-sans text-slate-800">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg shadow-2xl flex flex-col space-y-4 max-h-[92vh] overflow-y-auto text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                <div>
                  <h3 className="text-sm font-black text-slate-800 leading-none">
                    {activeCallSubTab === 'today' ? "Add Today's Follow-up" :
                     activeCallSubTab === 'all' ? "Add General Follow-up" :
                     activeCallSubTab === 'history' ? "Add Follow-up History" :
                     "Add Call Log"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Create a new entry dynamically in active index collections.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3.5 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Business Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Annapurna Sweets"
                    value={newRecord.businessName} 
                    onChange={(e) => setNewRecord(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Contact Person *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Adhikari"
                    value={newRecord.contactPerson} 
                    onChange={(e) => setNewRecord(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Mobile Number *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9851100000"
                    value={newRecord.phone} 
                    onChange={(e) => setNewRecord(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Assigned Agent</label>
                  <select 
                    value={newRecord.assignedTo} 
                    onChange={(e) => setNewRecord(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Sujan Karki">Sujan Karki</option>
                    <option value="Anita Sharma">Anita Sharma</option>
                    <option value="Bikram Raut">Bikram Raut</option>
                    <option value="Ramesh Thapa">Ramesh Thapa</option>
                  </select>
                </div>
              </div>

              {/* Subtab specific fields */}
              {(activeCallSubTab === 'today' || activeCallSubTab === 'all') && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="client@nagarik.com"
                      value={newRecord.email} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Priority</label>
                    <select 
                      value={newRecord.leadPriority} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, leadPriority: e.target.value as any }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400 cursor-pointer"
                    >
                      <option value="Hot">🔥 Hot</option>
                      <option value="Warm">⚡ Warm</option>
                      <option value="Cold">❄️ Cold</option>
                    </select>
                  </div>
                </div>
              )}

              {activeCallSubTab === 'all' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Follow-up Status</label>
                    <select 
                      value={newRecord.followUpStatus} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, followUpStatus: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400 cursor-pointer"
                    >
                      <option value="Follow-up Required">Follow-up Required</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Interested">Interested</option>
                      <option value="Call Attempted">Call Attempted</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Next Follow-up Date</label>
                    <input 
                      type="date" 
                      value={newRecord.nextFollowUpDate} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, nextFollowUpDate: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                    />
                  </div>
                </div>
              )}

              {(activeCallSubTab === 'history' || activeCallSubTab === 'logs') && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Outcome / Action Status</label>
                    <select 
                      value={newRecord.outcome} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, outcome: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400 cursor-pointer"
                    >
                      <option value="Answered">Answered</option>
                      <option value="Interested">Interested</option>
                      <option value="Demo Completed">Demo Completed</option>
                      <option value="No Answer">No Answer</option>
                      <option value="Busy">Busy</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Client Sentiment</label>
                    <select 
                      value={newRecord.sentiment} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, sentiment: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400 cursor-pointer"
                    >
                      <option value="Very Positive">🤩 Very Enthusiastic</option>
                      <option value="Positive">💪 Positive</option>
                      <option value="Neutral">😐 Neutral</option>
                      <option value="Critical">⚠️ Hesitant</option>
                    </select>
                  </div>
                </div>
              )}

              {activeCallSubTab === 'history' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Contact Method</label>
                    <select 
                      value={newRecord.type} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-2.5 py-1.5 font-bold text-slate-800 bg-slate-50 focus:border-blue-400 cursor-pointer"
                    >
                      <option value="Outbound Call">📞 Outbound Call</option>
                      <option value="WhatsApp Msg">💬 WhatsApp Msg</option>
                      <option value="On-site Demo">💻 On-site Demo</option>
                      <option value="Email Sent">📨 Email Sent</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Logged Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 29 May 2026"
                      value={newRecord.date} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-2.5 py-1.5 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Logged Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 02:30 PM"
                      value={newRecord.time} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-2.5 py-1.5 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                    />
                  </div>
                </div>
              )}

              {activeCallSubTab === 'logs' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Call Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1m 45s"
                      value={newRecord.duration} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-extrabold text-slate-500 block uppercase tracking-wider text-[9px] text-left">Logged Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Today"
                      value={newRecord.date} 
                      onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-slate-200 outline-none rounded-lg px-3 py-2 font-bold text-slate-800 bg-slate-50 focus:border-blue-400"
                    />
                  </div>
                </div>
              )}

              {/* General details / notes */}
              <div className="space-y-1 text-left">
                <label className="font-extrabold text-slate-555 block uppercase tracking-wider text-[9px] text-left">Outcome Notes & Remarks *</label>
                <textarea 
                  rows={3}
                  placeholder="Summarize the discussion, feedback, budget updates or scheduling results..."
                  value={newRecord.notes} 
                  onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-slate-200 outline-none rounded-xl px-3 py-2 font-semibold text-slate-800 bg-slate-50 focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    if (!newRecord.businessName.trim() || !newRecord.contactPerson.trim() || !newRecord.phone.trim() || !newRecord.notes.trim()) {
                      triggerToast("Error: Please fill in all required starred(*) fields.");
                      return;
                    }
                    
                    if (activeCallSubTab === 'today') {
                      addLead({
                        businessName: newRecord.businessName,
                        contactPerson: newRecord.contactPerson,
                        phone: newRecord.phone,
                        email: newRecord.email || 'info@business.com.np',
                        assignedTo: newRecord.assignedTo || currentUser?.name || 'Sujan Karki',
                        leadSource: 'Follow-up Scheduler',
                        leadPriority: newRecord.leadPriority || 'Warm',
                        followUpStatus: 'Follow-up Required',
                        nextFollowUpDate: 'Today\'s Follow-up', // prefilled Today tag
                        category: newRecord.category || 'Hospitality',
                        remarks: newRecord.notes
                      });
                      triggerToast(`Saved! Today's Follow-up scheduled for ${newRecord.businessName}.`);
                    } else if (activeCallSubTab === 'all') {
                      addLead({
                        businessName: newRecord.businessName,
                        contactPerson: newRecord.contactPerson,
                        phone: newRecord.phone,
                        email: newRecord.email || 'info@business.com.np',
                        assignedTo: newRecord.assignedTo || currentUser?.name || 'Sujan Karki',
                        leadSource: 'Follow-up Registry',
                        leadPriority: newRecord.leadPriority || 'Warm',
                        followUpStatus: newRecord.followUpStatus || 'Follow-up Required',
                        nextFollowUpDate: newRecord.nextFollowUpDate || '2026-06-03',
                        category: newRecord.category || 'Trading',
                        remarks: newRecord.notes
                      });
                      triggerToast(`Saved! General Follow-up scheduled for ${newRecord.businessName}.`);
                    } else if (activeCallSubTab === 'history') {
                      const newLog = {
                        id: `H-${Date.now().toString().slice(-3)}`,
                        businessName: newRecord.businessName,
                        contactPerson: newRecord.contactPerson,
                        phone: newRecord.phone,
                        type: newRecord.type || 'Outbound Call',
                        date: newRecord.date || 'Today',
                        time: newRecord.time || '12:00 PM',
                        outcome: newRecord.outcome || 'Answered',
                        notes: newRecord.notes,
                        agent: newRecord.assignedTo || currentUser?.name || 'Sujan Karki',
                        duration: newRecord.type === 'Outbound Call' ? (newRecord.duration || '2m 30s') : '-',
                        sentiment: newRecord.sentiment || 'Positive'
                      };
                      saveHistoricalLogs([newLog, ...historicalLogs]);
                      triggerToast(`Saved! History log added for ${newRecord.businessName}.`);
                    } else if (activeCallSubTab === 'logs') {
                      const newLog = {
                        id: `H-${Date.now().toString().slice(-3)}`,
                        businessName: newRecord.businessName,
                        contactPerson: newRecord.contactPerson,
                        phone: newRecord.phone,
                        type: 'Outbound Call',
                        date: newRecord.date || 'Today',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        outcome: newRecord.outcome || 'Answered',
                        notes: newRecord.notes,
                        agent: newRecord.assignedTo || currentUser?.name || 'Sujan Karki',
                        duration: newRecord.duration || '2m 30s',
                        sentiment: newRecord.sentiment || 'Positive'
                      };
                      saveHistoricalLogs([newLog, ...historicalLogs]);
                      triggerToast(`Saved! Call recording log added for ${newRecord.businessName}.`);
                    }

                    // Reset form state to defaults
                    setNewRecord({
                      businessName: '',
                      contactPerson: '',
                      phone: '',
                      email: '',
                      assignedTo: 'Sujan Karki',
                      followUpStatus: 'Follow-up Required',
                      nextFollowUpDate: '2026-05-30',
                      leadPriority: 'Warm',
                      category: 'IT Services',
                      leadSource: 'Walk-in',
                      notes: '',
                      type: 'Outbound Call',
                      date: '2026-05-30',
                      time: '12:00 PM',
                      outcome: 'Answered',
                      duration: '2m 30s',
                      sentiment: 'Positive',
                    });

                    setIsAddModalOpen(false);
                  }}
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black leading-none transition rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  <span>Save Record Entry</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <MainAppContent />
    </CRMProvider>
  );
}
