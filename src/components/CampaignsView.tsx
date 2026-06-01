import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { Campaign } from '../types';
import { 
  Mail, 
  Send, 
  Eye, 
  ChevronDown, 
  Calendar, 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  Copy, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Share2, 
  Download, 
  LayoutGrid, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Image, 
  Inbox, 
  Layers, 
  Settings, 
  Play, 
  CheckCircle, 
  MessageSquare, 
  Phone, 
  ArrowUpRight, 
  BarChart3,
  User,
  Zap,
  MousePointerClick,
  Clock,
  HelpCircle,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  MailWarning,
  Flame,
  Layout,
  BookOpen
} from 'lucide-react';
import { mockUsers } from '../data';

// Definition of exact row items matching screenshot 
interface ExtendedCampaign extends Campaign {
  audienceCount: string;
  openCount: number;
  clickCount: number;
  openRateFormatted: string;
  clickRateFormatted: string;
  createdOn: string;
  createdBy: string;
  thumbnailUrl?: string;
  deliveryChannelIcon?: any;
}

export const CampaignsView: React.FC = () => {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCRM();

  // Active Main SubTab matching given screenshot items
  const [activeTab, setActiveTab] = useState<'All Campaigns' | 'Email Campaigns' | 'WhatsApp Campaigns' | 'SMS Campaigns' | 'Social Media Campaigns' | 'Drip Campaigns' | 'Templates' | 'Campaign Calendar' | 'Audience Segments' | 'Reports'>('Email Campaigns');

  // Interactive drawer details & dynamic selected row
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('CP-01');

  // Selection checkbox logic
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Horizontal scroll states & drag-to-scroll refs
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const isDragActive = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftStart = React.useRef(0);
  const dragDistance = React.useRef(0);

  const updateScrollArrows = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 6);
      setShowRightArrow(scrollWidth - scrollLeft - clientWidth > 6);
    }
  };

  useEffect(() => {
    updateScrollArrows();
    const handleResize = () => updateScrollArrows();
    window.addEventListener('resize', handleResize);
    // Observe DOM changes inside tab container to refresh state
    let observer: MutationObserver | null = null;
    if (tabsRef.current) {
      observer = new MutationObserver(updateScrollArrows);
      observer.observe(tabsRef.current, { childList: true, subtree: true });
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleScrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Drag to scroll listeners
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    isDragActive.current = true;
    startX.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeftStart.current = tabsRef.current.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragActive.current || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const distanceTraveled = Math.abs(x - startX.current);
    dragDistance.current = distanceTraveled;
    const walk = (x - startX.current) * 1.5;
    tabsRef.current.scrollLeft = scrollLeftStart.current - walk;
    updateScrollArrows();
  };

  const handleMouseUpOrLeave = () => {
    isDragActive.current = false;
  };

  // Filtering states compliant with visual dropdown filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [listFilter, setListFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add Campaign form trigger
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Form input template state
  const [newCampaignForm, setNewCampaignForm] = useState({
    campaignName: '',
    subject: '',
    preheader: '',
    type: 'Promotional' as any,
    channel: 'Email' as any,
    targetAudience: 'Website Leads',
    targetContacts: 10000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
    status: 'Scheduled' as any
  });

  // Database of campaigns initialized to perfectly match the 8 row items from screenshot
  const [localCampaigns, setLocalCampaigns] = useState<ExtendedCampaign[]>(() => {
    const saved = localStorage.getItem('nagarik_enhanced_campaigns');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Restore failed:", e); }
    }
    return [
      {
        id: 'CP-01',
        campaignName: 'Summer Offer 2025',
        subject: '🔥 Summer Sale is Here! Get 50% OFF',
        preheader: "Don't miss out on our biggest sale of the year",
        type: 'Promotional',
        channel: 'Email',
        targetAudience: 'Website Leads',
        audienceCount: '12,543 Contacts',
        sent: 12456,
        openRate: 32.5,
        openCount: 4045,
        openRateFormatted: '32.5% (4,045)',
        clickRate: 12.4,
        clickCount: 1542,
        clickRateFormatted: '12.4% (1,542)',
        status: 'Completed',
        startDate: '16 May 2025, 10:30 AM',
        endDate: '16 May 2025, 11:45 AM',
        createdOn: '10 May 2025, 09:15 AM',
        createdBy: 'Sujan Karki',
        responses: 1542,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'CP-02',
        campaignName: 'New Feature Announcement',
        subject: 'Meet the New Nagarik Dashboard',
        preheader: 'Discover visual reporting capabilities available inside your tenant.',
        type: 'Informational',
        channel: 'Email',
        targetAudience: 'Existing Clients',
        audienceCount: '8,932 Contacts',
        sent: 8932,
        openRate: 28.6,
        openCount: 2555,
        openRateFormatted: '28.6% (2,555)',
        clickRate: 8.4,
        clickCount: 750,
        clickRateFormatted: '8.4% (750)',
        status: 'Completed',
        startDate: '10 May 2025, 11:00 AM',
        endDate: '10 May 2025, 12:30 PM',
        createdOn: '08 May 2025, 10:00 AM',
        createdBy: 'Sujan Karki',
        responses: 750,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'CP-03',
        campaignName: 'Webinar Invitation - May',
        subject: 'Live Product Demonstration: Nagarik CRM v3.0 Webinar',
        preheader: 'Reserve your seat to get early discount tokens on custom plans.',
        type: 'Event',
        channel: 'Email',
        targetAudience: 'All Leads',
        audienceCount: '15,230 Contacts',
        sent: 15230,
        openRate: 34.2,
        openCount: 5210,
        openRateFormatted: '34.2% (5,210)',
        clickRate: 15.8,
        clickCount: 2408,
        clickRateFormatted: '15.8% (2,408)',
        status: 'Completed',
        startDate: '05 May 2025, 02:00 PM',
        endDate: '05 May 2025, 03:30 PM',
        createdOn: '01 May 2025, 11:15 AM',
        createdBy: 'Sujan Karki',
        responses: 2408,
        thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'CP-04',
        campaignName: 'Re-engagement Campaign',
        subject: 'We miss you! Here is what\'s new at Nagarik.',
        preheader: 'Grab your customized upgrade token before it expires next Friday.',
        type: 'Re-engagement',
        channel: 'Email',
        targetAudience: 'Inactive Leads',
        audienceCount: '10,245 Contacts',
        sent: 10245,
        openRate: 20.1,
        openCount: 2060,
        openRateFormatted: '20.1% (2,060)',
        clickRate: 6.3,
        clickCount: 645,
        clickRateFormatted: '6.3% (645)',
        status: 'Completed',
        startDate: '28 Apr 2025, 09:30 AM',
        endDate: '28 Apr 2025, 11:00 AM',
        createdOn: '25 Apr 2025, 04:00 PM',
        createdBy: 'Anita Sharma',
        responses: 645,
        thumbnailUrl: 'https://images.unsplash.com/photo-1552581230-c013b1841196?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'CP-05',
        campaignName: 'Product Update - v2.5',
        subject: 'Version 2.5 Release Notes: Faster syncing pipelines',
        preheader: 'Major updates in background ledgers processing and invoice routing.',
        type: 'Informational',
        channel: 'Email',
        targetAudience: 'Product Users',
        audienceCount: '7,845 Contacts',
        sent: 7845,
        openRate: 31.7,
        openCount: 2487,
        openRateFormatted: '31.7% (2,487)',
        clickRate: 10.2,
        clickCount: 800,
        clickRateFormatted: '10.2% (800)',
        status: 'Active',
        startDate: '20 Jun 2025, 01:00 PM',
        endDate: '20 Jun 2025, 03:00 PM',
        createdOn: '18 Jun 2025, 09:00 AM',
        createdBy: 'Anita Sharma',
        responses: 800,
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'CP-06',
        campaignName: 'Flash Sale - 48 Hours',
        subject: '⚡ Flash Sale: 48 Hours ONLY. Get 35% Discount',
        preheader: 'Complete system setup with full conversion modules for limited duration.',
        type: 'Promotional',
        channel: 'Email',
        targetAudience: 'All Contacts',
        audienceCount: '22,430 Contacts',
        sent: 22430,
        openRate: 29.3,
        openCount: 6570,
        openRateFormatted: '29.3% (6,570)',
        clickRate: 14.6,
        clickCount: 3275,
        clickRateFormatted: '14.6% (3,275)',
        status: 'Scheduled',
        startDate: '21 Jun 2025, 10:00 AM',
        endDate: '21 Jun 2025, 11:30 AM',
        createdOn: '20 Jun 2025, 03:30 PM',
        createdBy: 'Sujan Karki',
        responses: 3275,
        thumbnailUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'CP-07',
        campaignName: 'Customer Satisfaction Survey',
        subject: 'How are we doing? Help us improve Nagarik Solutions.',
        preheader: 'Share your feedback and receive a free visual credit upgrade pack.',
        type: 'Survey',
        channel: 'Email',
        targetAudience: 'All Clients',
        audienceCount: '9,856 Contacts',
        sent: 0,
        openRate: 0,
        openCount: 0,
        openRateFormatted: '-',
        clickRate: 0,
        clickCount: 0,
        clickRateFormatted: '-',
        status: 'Draft',
        startDate: '-',
        endDate: '-',
        createdOn: '28 May 2025, 01:20 PM',
        createdBy: 'Bikram Raut',
        responses: 0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'CP-08',
        campaignName: 'Welcome Email Series',
        subject: 'Welcome to Nagarik Solution. Let\'s get configured!',
        preheader: 'Get started with simple interactive configurations in under three minutes.',
        type: 'Transactional',
        channel: 'Email',
        targetAudience: 'New Signups',
        audienceCount: '5,632 Contacts',
        sent: 0,
        openRate: 0,
        openCount: 0,
        openRateFormatted: '-',
        clickRate: 0,
        clickCount: 0,
        clickRateFormatted: '-',
        status: 'Draft',
        startDate: '-',
        endDate: '-',
        createdOn: '30 May 2025, 11:35 AM',
        createdBy: 'Sujan Karki',
        responses: 0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600'
      }
    ];
  });

  // Keep synced in localStorage
  useEffect(() => {
    localStorage.setItem('nagarik_enhanced_campaigns', JSON.stringify(localCampaigns));
  }, [localCampaigns]);

  // Handle addition of campaigns
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignForm.campaignName.trim()) return;

    const newId = `CP-${String(localCampaigns.length + 1).padStart(2, '0')}`;
    const entry: ExtendedCampaign = {
      id: newId,
      campaignName: newCampaignForm.campaignName,
      subject: newCampaignForm.subject || "🎉 Exciting News From Nagarik Solution!",
      preheader: newCampaignForm.preheader || "Checkout our customized modules built to scale.",
      type: newCampaignForm.type,
      channel: newCampaignForm.channel,
      targetAudience: newCampaignForm.targetAudience,
      audienceCount: `${newCampaignForm.targetContacts.toLocaleString()} Contacts`,
      sent: newCampaignForm.status === 'Completed' || newCampaignForm.status === 'Active' ? newCampaignForm.targetContacts : 0,
      openRate: newCampaignForm.status === 'Completed' ? 25.8 : 0,
      openCount: newCampaignForm.status === 'Completed' ? Math.round(newCampaignForm.targetContacts * 0.258) : 0,
      openRateFormatted: newCampaignForm.status === 'Completed' ? `25.8% (${Math.round(newCampaignForm.targetContacts * 0.258)})` : '-',
      clickRate: newCampaignForm.status === 'Completed' ? 8.2 : 0,
      clickCount: newCampaignForm.status === 'Completed' ? Math.round(newCampaignForm.targetContacts * 0.082) : 0,
      clickRateFormatted: newCampaignForm.status === 'Completed' ? `8.2% (${Math.round(newCampaignForm.targetContacts * 0.082)})` : '-',
      status: newCampaignForm.status,
      startDate: newCampaignForm.startDate + ', 10:00 AM',
      endDate: newCampaignForm.endDate + ', 11:30 AM',
      createdOn: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdBy: 'Sujan Karki',
      responses: newCampaignForm.status === 'Completed' ? Math.round(newCampaignForm.targetContacts * 0.082) : 0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
    };

    setLocalCampaigns([entry, ...localCampaigns]);
    setSelectedCampaignId(entry.id);
    setIsAddOpen(false);

    // Sync back to general context
    addCampaign({
      campaignName: entry.campaignName,
      type: entry.type,
      channel: entry.channel,
      targetAudience: entry.targetAudience,
      sent: entry.sent,
      responses: entry.responses,
      openRate: entry.openRate,
      clickRate: entry.clickRate,
      status: entry.status,
      startDate: entry.startDate,
      endDate: entry.endDate,
      subject: entry.subject,
      preheader: entry.preheader
    });
  };

  // Duplicate active selected campaign 
  const handleDuplicateCampaign = (id: string) => {
    const target = localCampaigns.find(c => c.id === id);
    if (!target) return;
    
    const cloneId = `CP-CL-${Date.now().toString().slice(-3)}`;
    const clone: ExtendedCampaign = {
      ...target,
      id: cloneId,
      campaignName: `${target.campaignName} (Copy)`,
      createdOn: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Draft',
      sent: 0,
      openCount: 0,
      clickCount: 0,
      openRate: 0,
      clickRate: 0,
      openRateFormatted: '-',
      clickRateFormatted: '-',
      responses: 0
    };

    setLocalCampaigns([clone, ...localCampaigns]);
    setSelectedCampaignId(cloneId);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Perform permanent campaign deletion
  const handleDeleteCampaign = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      const remaining = localCampaigns.filter(c => c.id !== id);
      setLocalCampaigns(remaining);
      deleteCampaign(id);
      if (selectedCampaignId === id && remaining.length > 0) {
        setSelectedCampaignId(remaining[0].id);
      }
    }
  };

  // Filter localCampaigns lists based on search & selectors
  const filteredCampaigns = localCampaigns.filter(camp => {
    // Tab filters
    if (activeTab === 'Email Campaigns' && camp.channel !== 'Email') return false;
    if (activeTab === 'WhatsApp Campaigns' && camp.channel !== 'WhatsApp') return false;
    if (activeTab === 'SMS Campaigns' && camp.channel !== 'SMS') return false;
    if (activeTab === 'Social Media Campaigns' && camp.channel !== 'Social Media') return false;

    // Search query matches
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      camp.campaignName.toLowerCase().includes(term) ||
      (camp.subject && camp.subject.toLowerCase().includes(term)) ||
      camp.targetAudience.toLowerCase().includes(term) ||
      camp.type.toLowerCase().includes(term);
    if (!matchesSearch) return false;

    // Dropdown filters
    if (statusFilter && camp.status !== statusFilter) return false;
    if (typeFilter && camp.type !== typeFilter) return false;
    if (listFilter && camp.targetAudience !== listFilter) return false;

    return true;
  });

  const selectedCampaign = localCampaigns.find(c => c.id === selectedCampaignId) || localCampaigns[0] || {} as any;

  // Format type badges custom colors
  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'Promotional':
        return <span className="bg-[#eff6ff] text-blue-600 border border-blue-105/30 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Promotional</span>;
      case 'Informational':
        return <span className="bg-[#ecfeff] text-cyan-600 border border-cyan-105/30 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Informational</span>;
      case 'Event':
        return <span className="bg-[#faf5ff] text-[#8b5cf6] border border-[#8b5cf6]/10 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Event</span>;
      case 'Re-engagement':
        return <span className="bg-[#fff7ed] text-[#ea580c] border border-orange-200/50 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Re-engagement</span>;
      case 'Survey':
        return <span className="bg-[#fdf2f8] text-pink-600 border border-pink-200/50 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Survey</span>;
      case 'Transactional':
        return <span className="bg-[#f0fdf4] text-emerald-600 border border-emerald-200/50 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Transactional</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[11px] font-bold">{type}</span>;
    }
  };

  // Format campaign status representation
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed':
        return <span className="bg-emerald-500/10 text-[#10b981] px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-[#10b981]/25 flex items-center justify-center gap-1 w-24">Completed</span>;
      case 'Active':
        return <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-emerald-600 flex items-center justify-center gap-1 w-24 animate-pulse">Active</span>;
      case 'Scheduled':
        return <span className="bg-blue-500/10 text-blue-600 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-blue-500/25 flex items-center justify-center gap-1 w-24">Scheduled</span>;
      case 'Draft':
        return <span className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-slate-200 flex items-center justify-center gap-1 w-24">Draft</span>;
      default:
        return <span className="bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-slate-200">{status}</span>;
    }
  };

  // CSV Simulation downloader
  const handleExportCSV = () => {
    const csvHeaders = "Campaign ID,Campaign Name,Type,Audience,Sent,Open Rate,Click Rate,Status,Start Date\n";
    const csvRows = localCampaigns.map(c => 
      `"${c.id}","${c.campaignName}","${c.type}","${c.targetAudience}",${c.sent},"${c.openRate}%","${c.clickRate}%","${c.status}","${c.startDate}"`
    ).join("\n");
    const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Nagarik_Outbound_Campaigns.csv');
    a.click();
  };

  // Toggle rows selection logic
  const toggleRowSelected = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredCampaigns.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredCampaigns.map(c => c.id));
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 font-sans text-left relative h-full scrollbar-thin">
      
      {/* SUCCESS FLASH POPUP */}
      {copiedSuccess && (
        <div className="absolute top-5 right-5 z-[99999] bg-[#0f172a] text-white p-3 px-5 rounded-2xl border border-slate-700/60 shadow-2xl flex items-center gap-2.5 animate-bounce-in text-xs font-bold leading-none">
          <Sparkles className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          <span>Campaign cloned successfully! Added to Drafts.</span>
        </div>
      )}

      {/* HEADER SECTION MATCHING IMAGE */}
      <header className="p-5 px-6 bg-white border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 select-none">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">Campaigns</h2>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-400 font-bold font-sans">
            <span className="hover:text-blue-600 transition cursor-pointer">Dashboard</span>
            <span>&rsaquo;</span>
            <span className="hover:text-blue-600 transition cursor-pointer">Campaigns</span>
            <span>&rsaquo;</span>
            <span className="font-extrabold text-slate-700">{activeTab}</span>
          </div>
        </div>

        {/* Header Right Actions Widgets */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto select-none">
          {/* May-Jun date selector */}
          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl px-3 py-2 flex items-center gap-2 font-bold text-xs text-slate-600 shadow-2xs hover:bg-slate-100/50 cursor-pointer transition">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>18 May - 18 Jun 2025</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Create blue button */}
          <button 
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4.5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Create Campaign</span>
          </button>

          {/* Notification icon */}
          <div className="relative p-2 bg-[#f8fafc] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition shadow-2xs">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-black flex items-center justify-center p-0.5 border border-white">
              72
            </span>
          </div>

          <span className="w-px h-8 bg-slate-200 inline-block" />

          {/* User badge */}
          <div className="flex items-center gap-2.5 pl-1">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256" 
              alt="Sujan Karki" 
              className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div className="leading-none hidden sm:block text-left select-none">
              <span className="text-[12px] font-black text-slate-850 block">Sujan Karki</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase mt-1 block">Marketing Executive</span>
            </div>
          </div>
        </div>
      </header>

      {/* METRIC ROW DISPLAYING EXACTLY THE 6 CARDS STYLED FROM SCENE */}
      <section className="p-6 bg-[#f8fafc] grid grid-cols-2 lg:grid-cols-6 gap-4 shrink-0 border-b border-slate-200 select-none">
        
        {/* Metric 1 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4 transition hover:shadow-xs hover:border-slate-300">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Total Email Campaigns</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">26</h3>
            <span className="text-[10px] text-emerald-500 font-black mt-1 block flex items-center gap-0.5">
              <span>↑ 16.3%</span> <span className="text-slate-400 font-medium font-sans">from last month</span>
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4 transition hover:shadow-xs hover:border-slate-300">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <Send className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Sent</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">128,456</h3>
            <span className="text-[10px] text-emerald-500 font-black mt-1 block flex items-center gap-0.5">
              <span>↑ 21.6%</span> <span className="text-slate-400 font-medium font-sans">from last month</span>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4 transition hover:shadow-xs hover:border-slate-300">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Opened</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">18,732</h3>
            <span className="text-[10px] text-emerald-500 font-black mt-1 block flex items-center gap-0.5">
              <span>↑ 19.4%</span> <span className="text-slate-400 font-medium font-sans">from last month</span>
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4 transition hover:shadow-xs hover:border-slate-300">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0">
            <MousePointerClick className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Clicked</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">7,652</h3>
            <span className="text-[10px] text-emerald-500 font-black mt-1 block flex items-center gap-0.5">
              <span>↑ 15.8%</span> <span className="text-slate-400 font-medium font-sans">from last month</span>
            </span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4 transition hover:shadow-xs hover:border-slate-300">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl shrink-0">
            <RotateCcw className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Bounced</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">2,143</h3>
            <span className="text-[10px] text-rose-500 font-black mt-1 block flex items-center gap-0.5">
              <span>↓ 6.2%</span> <span className="text-slate-400 font-medium font-sans">from last month</span>
            </span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4 transition hover:shadow-xs hover:border-slate-300">
          <div className="p-3 bg-blue-50 text-blue-400 rounded-2xl shrink-0">
            <User className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Unsubscribed</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">1,256</h3>
            <span className="text-[10px] text-emerald-500 font-black mt-1 block flex items-center gap-0.5">
              <span>↓ 4.8%</span> <span className="text-slate-400 font-medium font-sans">from last month</span>
            </span>
          </div>
        </div>

      </section>

      {/* CORE WORKSPACE CONTAINING HORIZONTAL NAVIGATION LIST TABS */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Left Side Content Area (Spreadsheet table/Builders panels) */}
        <div className="flex-grow flex flex-col min-w-0">
          
          {/* Horizontal Tabs Bar Container with absolute navigation buttons and fade overlays */}
          <div className="relative bg-white border-b border-slate-200 flex items-center select-none shrink-0 w-full">
            
            {/* Left fade and indicator button */}
            {showLeftArrow && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/90 to-transparent z-10 flex items-center pl-2 pointer-events-none">
                <button
                  type="button"
                  onClick={handleScrollLeft}
                  className="w-7 h-7 bg-white/95 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-blue-600 transition pointer-events-auto active:scale-95"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600 stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* Scrollable Tabs Wrapper */}
            <div 
              ref={tabsRef}
              onScroll={updateScrollArrows}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="w-full px-6 flex items-center gap-1.5 overflow-x-auto select-none scrollbar-none scroll-smooth cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none' }}
            >
              {[
                'All Campaigns', 'Email Campaigns', 'WhatsApp Campaigns', 'SMS Campaigns', 
                'Social Media Campaigns', 'Drip Campaigns', 'Templates', 
                'Campaign Calendar', 'Audience Segments', 'Reports'
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    if (dragDistance.current > 8) return;
                    setActiveTab(tab as any);
                    setSearchQuery('');
                    setStatusFilter('');
                    setTypeFilter('');
                  }}
                  className={`py-3.5 px-3 border-b-2 text-xs font-black shrink-0 transition relative ${
                    activeTab === tab 
                      ? 'border-blue-600 text-blue-600 font-black' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                  }`}
                >
                  {tab}
                  {tab === 'Drip Campaigns' && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  )}
                </button>
              ))}
            </div>

            {/* Right fade and indicator button */}
            {showRightArrow && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent z-10 flex items-center justify-end pr-2 pointer-events-none">
                <button
                  type="button"
                  onClick={handleScrollRight}
                  className="w-7 h-7 bg-white/95 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-blue-600 transition pointer-events-auto active:scale-95"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600 stroke-[2.5]" />
                </button>
              </div>
            )}

          </div>

          {/* MAIN CONDITIONAL RENDERER PER ACTIVE TAB */}
          <div className="p-4 sm:p-6 space-y-6">

            {/* TAB VIEW 1 & 2 & 3 & 4 & 5: CAMPAIGNS SPREADSHEETS (EMAIL, WHATSAPP, SMS, SOCIAL, ALL) */}
            {(activeTab === 'All Campaigns' || activeTab === 'Email Campaigns' || activeTab === 'WhatsApp Campaigns' || activeTab === 'SMS Campaigns' || activeTab === 'Social Media Campaigns') && (
              <div className="space-y-4">
                
                {/* FILTER WIDGET CONTROLS LINE (EXACTLY MATCHING IMAGE DROPDOWNS) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs font-bold shrink-0">
                  
                  {/* Search filter input */}
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder={`Search ${activeTab.toLowerCase().replace(' campaigns', '')} campaign by name...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-400 rounded-xl outline-none font-semibold text-slate-700 transition"
                    />
                  </div>

                  {/* Status checklist dropdown selector */}
                  <div className="px-3.5 py-2 border border-slate-20s border-slate-200 bg-slate-50/50 rounded-xl text-slate-600 flex items-center font-bold gap-1 cursor-pointer">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-none bg-transparent outline-none pr-1 text-xs cursor-pointer text-slate-700 font-extrabold"
                    >
                      <option value="">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  {/* Type Category selection */}
                  <div className="px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-600 flex items-center font-bold gap-1 cursor-pointer">
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="border-none bg-transparent outline-none pr-1 text-xs cursor-pointer text-slate-700 font-extrabold"
                    >
                      <option value="">All Types</option>
                      <option value="Promotional">Promotional</option>
                      <option value="Informational">Informational</option>
                      <option value="Event">Event</option>
                      <option value="Re-engagement">Re-engagement</option>
                      <option value="Survey">Survey</option>
                      <option value="Transactional">Transactional</option>
                    </select>
                  </div>

                  {/* Audience Lists filter selector */}
                  <div className="px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-600 flex items-center font-bold gap-1.5 cursor-pointer">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <select 
                      value={listFilter}
                      onChange={(e) => setListFilter(e.target.value)}
                      className="border-none bg-transparent outline-none pr-1 text-xs cursor-pointer text-slate-700 font-extrabold"
                    >
                      <option value="">All Lists</option>
                      <option value="Website Leads">Website Leads</option>
                      <option value="Existing Clients">Existing Clients</option>
                      <option value="All Leads">All Leads</option>
                      <option value="Inactive Leads">Inactive Leads</option>
                      <option value="Product Users">Product Users</option>
                      <option value="All Contacts">All Contacts</option>
                      <option value="All Clients">All Clients</option>
                      <option value="New Signups">New Signups</option>
                    </select>
                  </div>

                  {/* Start Date picker */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 font-black text-[10px] uppercase">Start Date</span>
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border-none bg-transparent outline-none text-slate-600 text-xs font-bold leading-none"
                    />
                  </div>

                  <span className="text-slate-400 font-bold self-center">To</span>

                  {/* End Date picker */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 font-black text-[10px] uppercase">End Date</span>
                    <input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border-none bg-transparent outline-none text-slate-600 text-xs font-bold leading-none"
                    />
                  </div>

                  {/* Reset Filters */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                      setTypeFilter('');
                      setListFilter('');
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition font-black text-slate-500"
                    title="Reset Filter Form"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Left elements gap */}
                  <div className="flex-1" />

                  {/* CSV Export Button */}
                  <button 
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export</span>
                  </button>
                </div>

                {/* SPREADSHEETS ROW TABLE EXECUTIONS */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden select-none">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse text-left text-xs font-semibold text-slate-700">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider select-none h-11">
                          <th className="py-2.5 px-4 w-10 text-center">
                            <input 
                              type="checkbox"
                              checked={selectedRows.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                              onChange={toggleAllRows}
                              className="w-3.5 h-3.5 accent-blue-600 cursor-pointer rounded"
                            />
                          </th>
                          <th className="py-2.5 px-4 w-12 text-center">ID</th>
                          <th className="py-2.5 px-4">Campaign Name</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4">Audience / List</th>
                          <th className="py-2.5 px-4">Sent</th>
                          <th className="py-2.5 px-4 font-black">Open Rate</th>
                          <th className="py-2.5 px-4 font-black">Click Rate</th>
                          <th className="py-2.5 px-4">Status</th>
                          <th className="py-2.5 px-4">Start Date</th>
                          <th className="py-2.5 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCampaigns.map((camp, idx) => {
                          const isSelected = selectedCampaignId === camp.id;
                          const isChecked = selectedRows.includes(camp.id);
                          
                          return (
                            <tr
                              key={camp.id}
                              onClick={() => setSelectedCampaignId(camp.id)}
                              className={`transition-colors h-14 hover:bg-slate-50/50 cursor-pointer ${
                                isSelected ? 'bg-slate-50' : ''
                              }`}
                            >
                              {/* Checkbox columns selection */}
                              <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => toggleRowSelected(camp.id, e)}
                                  className="w-3.5 h-3.5 accent-[#2563eb] cursor-pointer rounded"
                                />
                              </td>

                              {/* Row numbering indexing aligned dynamically */}
                              <td className="py-3 px-4 text-center text-slate-400 font-bold font-mono">
                                {idx + 1}
                              </td>

                              {/* Target name header with subtitles */}
                              <td className="py-3 px-4">
                                <span className="font-extrabold text-slate-800 block text-[13px]">{camp.campaignName}</span>
                                <span className="text-[10px] text-slate-450 text-slate-400 block font-normal leading-none max-w-xs truncate mt-1">
                                  {camp.subject}
                                </span>
                              </td>

                              {/* Promotional Event Survey Tag badge */}
                              <td className="py-3 px-4">
                                {getTypeBadge(camp.type)}
                              </td>

                              {/* Contact Leads targets list group count */}
                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-700 block text-[12px]">{camp.targetAudience}</span>
                                <span className="text-[10px] text-slate-400 block font-bold mt-1 tracking-wide">{camp.audienceCount}</span>
                              </td>

                              {/* Total count of targets broadcast dispatched */}
                              <td className="py-3 px-4 font-bold text-slate-700 leading-none">
                                {camp.sent > 0 ? camp.sent.toLocaleString() : '-'}
                              </td>

                              {/* Total opens and percentages */}
                              <td className="py-3 px-4 font-bold">
                                {camp.status === 'Completed' || camp.status === 'Active' ? (
                                  <div>
                                    <span className="text-emerald-600 block text-[12px] font-extrabold">{camp.openRate}%</span>
                                    <span className="text-[10px] text-emerald-450 text-[#10b981] font-bold mt-1 block">({camp.openCount.toLocaleString()})</span>
                                  </div>
                                ) : <span className="text-slate-400 font-bold">-</span>}
                              </td>

                              {/* Dispatched response link clicks rate percentage */}
                              <td className="py-3 px-4 font-bold">
                                {camp.status === 'Completed' || camp.status === 'Active' ? (
                                  <div>
                                    <span className="text-[#3b82f6] block text-[12px] font-extrabold">{camp.clickRate}%</span>
                                    <span className="text-[10px] text-[#3b82f6] font-bold mt-1 block">({camp.clickCount.toLocaleString()})</span>
                                  </div>
                                ) : <span className="text-slate-400 font-bold">-</span>}
                              </td>

                              {/* Scheduled draft complete active state */}
                              <td className="py-3 px-4">
                                {getStatusBadge(camp.status)}
                              </td>

                              {/* Precise scheduling launch timestamp */}
                              <td className="py-3 px-4">
                                <span className="text-slate-600 block text-xs font-bold whitespace-nowrap">{camp.startDate.split(',')[0]}</span>
                                <span className="text-[10px] text-slate-400 block font-bold leading-none mt-1">{camp.startDate.split(',')[1] || ''}</span>
                              </td>

                              {/* Table rows Actions triggers */}
                              <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center gap-1.5">
                                  <button 
                                    onClick={() => handleDuplicateCampaign(camp.id)}
                                    className="p-1 px-1.5 hover:bg-slate-100 text-slate-450 hover:text-slate-700 border border-transparent hover:border-slate-200 transition rounded-lg"
                                    title="Clone Campaign"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCampaign(camp.id)}
                                    className="p-1 px-1.5 hover:bg-rose-50 text-slate-450 hover:text-rose-600 border border-transparent hover:border-rose-100 transition rounded-lg"
                                    title="Delete Campaign"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Standard spreadsheet table footer pagination */}
                  <div className="p-4 bg-white border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-400">
                    <span className="text-[11px] font-bold">Showing 1 to {filteredCampaigns.length} of {localCampaigns.length + 18} entries</span>
                    
                    <div className="flex items-center gap-1.5">
                      <button className="px-2.5 py-1.5 border border-slate-200 text-slate-400 rounded-lg shrink-0 hover:bg-slate-50 cursor-pointer">‹</button>
                      <button className="px-3.5 py-1.5 rounded-lg text-white bg-[#2563eb] shadow-sm font-black shrink-0">1</button>
                      <button className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500 cursor-pointer">2</button>
                      <button className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500 cursor-pointer">3</button>
                      <button className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500 cursor-pointer">4</button>
                      <button className="px-2.5 py-1.5 border border-slate-200 text-slate-400 rounded-lg shrink-0 hover:bg-slate-50 cursor-pointer">›</button>
                    </div>

                    <div className="inline-flex items-center text-slate-400 gap-1.5 px-2 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg font-bold">
                      <select className="border-none bg-transparent text-slate-700 outline-none cursor-pointer">
                        <option value="10">10 / page</option>
                        <option value="20">20 / page</option>
                        <option value="50">50 / page</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB VIEW 6: DRIP AUTOMATION WORKFLOWS VISUAL NODE BUILDER */}
            {activeTab === 'Drip Campaigns' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 select-none font-sans">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Drip Automation Sequences Designer</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Configure automated conditional workflow chains for onboarding triggers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3.5 py-1.5 bg-[#2563eb] text-white flex items-center gap-1.5 text-xs font-extrabold rounded-lg hover:bg-blue-700 transition">
                      <Zap className="w-3.5 h-3.5" /> Save Workflow
                    </button>
                  </div>
                </div>

                {/* Simulated visual node chain */}
                <div className="relative bg-slate-900 rounded-2xl p-10 min-h-[460px] overflow-hidden flex flex-col items-center justify-center space-y-8 border border-slate-800">
                  
                  {/* Background grid dots decoration */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                  {/* Node 1: Trigger */}
                  <div className="relative bg-[#1e293b] border border-blue-500/50 p-4 rounded-2xl w-72 text-left shadow-xl z-10 transition hover:border-blue-400">
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-2">
                      <div className="p-1 px-1.5 bg-blue-500/10 text-blue-400 rounded-md"><Zap className="w-4 h-4" /></div>
                      <span className="text-xs font-black uppercase text-blue-400 tracking-wider">Trigger Source</span>
                    </div>
                    <span className="text-xs font-bold text-slate-100 block">User Registration Form</span>
                    <p className="text-[10px] text-slate-400 mt-1">Dispatches when visitor registers at nagarik.com/trial landing page.</p>
                  </div>

                  {/* Flow arrow 1 */}
                  <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-amber-500 relative flex items-center justify-center">
                    <span className="absolute -bottom-1 border-t-4 border-t-amber-500 border-x-4 border-x-transparent w-0 h-0" />
                  </div>

                  {/* Node 2: Onshore Delay Action */}
                  <div className="relative bg-[#1e293b] border border-amber-500/50 p-4 rounded-2xl w-72 text-left shadow-xl z-10 transition hover:border-amber-400">
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-2">
                      <div className="p-1 px-1.5 bg-amber-500/10 text-amber-400 rounded-md"><Clock className="w-4 h-4" /></div>
                      <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Delay Timer</span>
                    </div>
                    <span className="text-xs font-bold text-slate-100 block">Wait 2 Hours</span>
                    <p className="text-[10px] text-slate-400 mt-1">Saves from overlapping notifications during user setups.</p>
                  </div>

                  {/* Flow arrow 2 */}
                  <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500 to-[#10b981] relative flex items-center justify-center">
                    <span className="absolute -bottom-1 border-t-4 border-t-[#10b981] border-x-4 border-x-transparent w-0 h-0" />
                  </div>

                  {/* Node 3: Onboarding dispatch */}
                  <div className="relative bg-[#1e293b] border border-[#10b981]/50 p-4 rounded-2xl w-72 text-left shadow-xl z-10 transition hover:border-[#10b981]">
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-2">
                      <div className="p-1 px-1.5 bg-[#10b981]/10 text-[#10b981] rounded-md"><Mail className="w-4 h-4" /></div>
                      <span className="text-xs font-black uppercase text-[#10b981] tracking-wider">Email Broadcast</span>
                    </div>
                    <span className="text-xs font-bold text-slate-100 block">Welcome Email Sequence #1</span>
                    <p className="text-[10px] text-slate-400 mt-1">Delivers credentials keys and quick configuration setup guides.</p>
                  </div>

                  {/* floating active info tracker panel */}
                  <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-[10px] font-mono text-slate-500 text-left space-y-1 select-none leading-none">
                    <span>Workflow: Trial Onboarding Drive</span>
                    <br />
                    <span>Active users: 11,462 profiles</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 7: TEMPLATES GALLERY MODULE */}
            {activeTab === 'Templates' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 font-sans">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Email & Message Newsletter Templates</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Design and select pre-approved content formats for high impact outbound campaigns</p>
                  </div>
                  <button className="px-3.5 py-1.5 border border-slate-200 text-xs font-bold rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-slate-400" /> Create Template
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "Summer Sale Theme", desc: "Eye-catching banner with promotional discount triggers", tag: "Email", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300" },
                    { title: "Dashboard Update Notes", desc: "Structured logs with tabular changes and visual highlights", tag: "Email", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300" },
                    { title: "WhatsApp Welcome Ping", desc: "Short, direct WhatsApp greeting with custom fields mapping", tag: "WhatsApp", img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=300" },
                    { title: "Payment Overdue Alert SMS", desc: "Strict urgency template mapped with dynamic PDF invoice URLs", tag: "SMS", img: "https://images.unsplash.com/photo-1552581230-c013b1841196?auto=format&fit=crop&q=80&w=300" }
                  ].map((temp, i) => (
                    <div key={i} className="bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xs transition">
                      <div className="relative h-32 w-full bg-slate-200">
                        <img src={temp.img} alt={temp.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md leading-none border border-white/10">
                          {temp.tag}
                        </span>
                      </div>
                      <div className="p-4 text-left space-y-1.5 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-[13px]">{temp.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{temp.desc}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-200/50 mt-3 flex justify-between items-center text-[10px] font-bold">
                          <button className="text-blue-600 hover:underline">Preview Layout</button>
                          <button className="text-slate-500 hover:text-slate-700">Clone</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB VIEW 8: INTERACTIVE MONTHLY CALENDAR planner GRID */}
            {activeTab === 'Campaign Calendar' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 select-none font-sans">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Campaign Planner Calendar</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Review scheduled outbound broadcasts allocations on an interactive calendar index</p>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="bg-slate-50 p-2 text-center text-xs font-black text-slate-500 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, idx) => {
                    const dayNum = idx - 3; // Offset May starts on Thursday
                    const isValidDay = dayNum > 0 && dayNum <= 31;
                    const paddedDay = isValidDay ? `2025-05-${dayNum.toString().padStart(2, '0')}` : null;
                    const dayEvents = paddedDay ? localCampaigns.filter(c => c.startDate.includes('May 2025') && parseInt(c.startDate.split(' ')[0]) === dayNum) : [];

                    return (
                      <div key={idx} className="bg-white min-h-[90px] p-2 transition flex flex-col justify-between hover:bg-slate-50/50">
                        <span className={`text-[11px] font-extrabold ${isValidDay ? 'text-slate-600' : 'text-slate-200'}`}>
                          {isValidDay ? dayNum : ''}
                        </span>
                        <div className="space-y-1 mt-1 flex-grow overflow-y-auto">
                          {dayEvents.map(ev => (
                            <div 
                              key={ev.id} 
                              onClick={() => setSelectedCampaignId(ev.id)}
                              className={`text-[9px] p-1 rounded-md border cursor-pointer font-bold leading-tight select-none transition ${
                                ev.status === 'Completed' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                  : ev.status === 'Active'
                                  ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse'
                                  : ev.status === 'Scheduled'
                                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                                  : 'bg-slate-50 text-slate-600 border-slate-100'
                              }`}
                            >
                              <div className="truncate font-black">{ev.campaignName}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB VIEW 9: AUDIENCE SEGMENTS & RECALCULATING CONCENTRATE CONTROLS */}
            {activeTab === 'Audience Segments' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 font-sans">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Target Audience Segments Index</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Review contact counts, criteria filters, and pipeline engagement stats per list</p>
                  </div>
                  <button className="px-3.5 py-1.5 border border-slate-200 text-xs font-bold rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-slate-400" /> New segment
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Website Leads", count: 12543, engagement: "High (82%)", lastActive: "1 day ago" },
                    { title: "Existing Clients", count: 8932, engagement: "Very High (94%)", lastActive: "Today" },
                    { title: "All Leads", count: 15230, engagement: "Medium (58%)", lastActive: "3 days ago" },
                    { title: "Inactive Leads", count: 10245, engagement: "Low (12%)", lastActive: "30+ days ago" }
                  ].map((seg, i) => (
                    <div key={i} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex justify-between items-center hover:shadow-xs transition">
                      <div className="text-left space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Lead Category Group</span>
                        <h4 className="font-extrabold text-slate-800 text-sm">{seg.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold font-sans pt-1">
                          <span>Engagement Index: <strong className="text-slate-700">{seg.engagement}</strong></span>
                          <span>•</span>
                          <span>Last Activity: <strong className="text-slate-700">{seg.lastActive}</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h3 className="text-xl font-black text-blue-600 font-mono leading-none">{seg.count.toLocaleString()}</h3>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">Profiles tracked</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB VIEW 10: DEEP ANALYTICAL SVG OVERVIEW GRAPH REPORT PANEL */}
            {activeTab === 'Reports' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 font-sans">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Outbound Broadcasting Delivery Analytics Reports</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Holistic funnel tracking indexes covering opens, link clicks, deliveries and bounce ratios</p>
                  </div>
                  <button className="px-3.5 py-1.5 bg-blue-600 font-extrabold hover:bg-blue-500 text-white flex items-center gap-1.5 text-xs rounded-lg transition shadow-2xs shadow-blue-500/10">
                    <Download className="w-3.5 h-3.5" /> Full PDF Report Summary
                  </button>
                </div>

                {/* SVG Visual graph charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card Chart 1: Funnel delivery ratios */}
                  <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-2xl space-y-4 text-left">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">Broadcast Delivery Funnel</h4>
                      <p className="text-[10px] text-slate-400 leading-none mt-1">Delivery rates tracking from targets collection dispatch</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {[
                        { title: "Target Audience", count: "128,456 Profiles", width: "w-full", color: "bg-blue-600" },
                        { title: "Successfully Delivered", count: "118,924 Deliveries (92.5%)", width: "w-[92.5%]", color: "bg-emerald-500" },
                        { title: "Opened Broadcast", count: "18,732 Opens (14.5%)", width: "w-[14.5%]", color: "bg-purple-500" },
                        { title: "Clicked Callout Link", count: "7,652 Clicks (5.9%)", width: "w-[5.9%]", color: "bg-amber-500" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1 select-none">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-600 font-extrabold">{item.title}</span>
                            <span className="text-slate-900 font-extrabold">{item.count}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full ${item.width} transition-all duration-500`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Chart 2: Deliverability Rates by Domain */}
                  <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-2xl space-y-4 text-left">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">Inbox Placements Delivery Rates</h4>
                      <p className="text-[10px] text-slate-400 leading-none mt-1">Breakdown rates registered across email domains</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3.5 pt-2 text-center select-none">
                      {[
                        { domain: "gmail.com", percent: "98.2%", label: "Optimal", color: "text-emerald-500 border-emerald-500/20 bg-emerald-50/10" },
                        { domain: "outlook.com", percent: "94.6%", label: "Optimal", color: "text-blue-500 border-blue-500/20 bg-blue-50/10" },
                        { domain: "yahoo.com", percent: "81.4%", label: "Review Required", color: "text-amber-500 border-amber-500/20 bg-amber-50/10" }
                      ].map((item, i) => (
                        <div key={i} className={`p-4 border rounded-2xl ${item.color} leading-none flex flex-col justify-between`}>
                          <span className="text-slate-400 font-extrabold text-[10px] uppercase block">{item.domain}</span>
                          <h3 className="text-lg sm:text-xl font-black mt-2">{item.percent}</h3>
                          <span className="text-[9px] font-bold mt-2.5 inline-block">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT SIDEBAR PANEL: GRAPHICAL INTUITION MATCHING THE EXACT SCREENSHOT (Width: 380px, scrollable) */}
        {selectedCampaign && (
          <>
            {/* Backdrop overlay for focus on mobile/tablet */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[80] lg:hidden transition-opacity duration-200"
              onClick={() => setSelectedCampaignId('')}
            />
            {/* Double-responsive sliding / sticky panel */}
            <aside className="fixed lg:sticky top-0 lg:top-0 right-0 bottom-0 z-[90] lg:z-10 w-full max-w-[380px] sm:w-[380px] bg-white border-l border-slate-200 flex flex-col h-full lg:h-[calc(100vh-64px)] overflow-y-auto shrink-0 select-none font-sans text-left shadow-2xl lg:shadow-none animate-slide-left">
              
              {/* Header Desk */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider">Campaign Details</span>
              <button 
                type="button"
                className="p-1 hover:bg-slate-250/40 text-slate-400 hover:text-slate-600 rounded-lg transition"
                onClick={() => setSelectedCampaignId('')}
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5 divide-y divide-slate-100">
              
              {/* Image banner thumb exact matching */}
              <div className="space-y-4 pt-1">
                
                {/* Hero card banner thumbnail preview */}
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-2xs h-36 bg-slate-100 shrink-0">
                  <img 
                    src={selectedCampaign.thumbnailUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400'} 
                    alt={selectedCampaign.campaignName} 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Status overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 p-4 flex flex-col justify-between text-left">
                    <div className="flex justify-between items-start">
                      <span className="bg-black/60 text-white font-extrabold text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-md leading-none border border-white/5 shadow-xs">
                        {selectedCampaign.id}
                      </span>
                      {selectedCampaign.status === 'Completed' ? (
                        <span className="bg-emerald-500 text-white border border-emerald-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-md leading-none shadow-sm">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md leading-none shadow-sm animate-pulse">
                          {selectedCampaign.status}
                        </span>
                      )}
                    </div>

                    <div className="leading-tight">
                      <h4 className="text-white text-sm font-black truncate">{selectedCampaign.campaignName}</h4>
                      <span className="text-[10px] text-slate-300 font-semibold block mt-1">Outbound Email Strategy</span>
                    </div>
                  </div>
                </div>

                {/* Grid key stats data blocks lists */}
                <div className="bg-slate-50/65 border border-slate-200 rounded-2xl p-4.5 text-xs space-y-3.5 font-semibold leading-none">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Type</span>
                    <span className="text-slate-800 font-extrabold">{selectedCampaign.type}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Audience / List</span>
                    <span className="text-slate-800 font-extrabold">{selectedCampaign.targetAudience} ({selectedCampaign.audienceCount ? selectedCampaign.audienceCount.split(' ')[0] : '12,543'})</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 font-bold block">Subject</span>
                    <p className="text-[11px] leading-relaxed p-2.5 bg-white border border-slate-200 text-slate-800 font-semibold rounded-xl leading-relaxed">
                      💬 {selectedCampaign.subject}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 font-bold block">Preheader</span>
                    <p className="text-[10px] leading-relaxed p-2.5 bg-white border border-slate-200 text-slate-500 font-medium italic rounded-xl leading-relaxed">
                      💡 {selectedCampaign.preheader}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Start Date</span>
                    <span className="text-slate-800 font-extrabold">{selectedCampaign.startDate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">End Date</span>
                    <span className="text-slate-800 font-extrabold">{selectedCampaign.endDate}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/50 pt-3">
                    <span className="text-slate-400 font-bold">Created By</span>
                    <div className="flex items-center gap-1.5">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256" 
                        alt="Sujan Karki" 
                        className="w-5.5 h-5.5 rounded-full object-cover" 
                      />
                      <span className="text-slate-800 font-extrabold text-[11px]">{selectedCampaign.createdBy || 'Sujan Karki'}</span>
                    </div>
                  </div>

                </div>

                {/* Drawer bottom execution click triggers buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1 select-none">
                  <button 
                    type="button"
                    className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-blue-600 font-extrabold rounded-xl transition text-[11px] uppercase tracking-wider"
                  >
                    View Full Report
                  </button>
                  <button 
                    type="button"
                    className="py-2.5 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold rounded-xl transition text-[11px] uppercase tracking-wider shadow-xs"
                  >
                    Edit Campaign
                  </button>
                </div>

              </div>

              {/* PERFORMANCE OVERVIEW DONUT CHART BLOCK ALIGNED */}
              <div className="pt-5 space-y-4">
                <div>
                  <h4 className="text-[11px] font-black uppercase text-slate-850 tracking-wider">Performance Overview</h4>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">Response metrics breakdowns relative to dispatched target lists</p>
                </div>

                {selectedCampaign.status === 'Completed' || selectedCampaign.status === 'Active' ? (
                  <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4.5 flex flex-col justify-between text-left">
                    <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                      
                      {/* Interactive Conic Donut Ring Container */}
                      <div className="relative w-24 h-24 shrink-0 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                          
                          {/* Segment 1: Opened (32.5%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="32.5 67.5" strokeDashoffset="100" />
                          
                          {/* Segment 2: Clicked (12.4%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" strokeDasharray="12.4 87.6" strokeDashoffset="67.5" />
                          
                          {/* Segment 3: Bounced (2.1%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3.2" strokeDasharray="2.1 97.9" strokeDashoffset="55.1" />
                          
                          {/* Segment 4: Unsubscribed (1.5%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="3.2" strokeDasharray="1.5 98.5" strokeDashoffset="53" />
                        </svg>

                        {/* Centered sum text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-2xs leading-none">
                          <span className="text-[11px] font-black text-slate-800">{selectedCampaign.sent ? selectedCampaign.sent.toLocaleString() : '12,456'}</span>
                          <span className="text-[8px] text-slate-400 font-extrabold uppercase mt-1">Sent</span>
                        </div>
                      </div>

                      {/* Legend details checklists */}
                      <div className="flex-grow space-y-1.5 font-bold text-[10px] text-slate-500 leading-none">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#3b82f6] rounded-full inline-block" /> Opened</span>
                          <span className="text-slate-800 font-black">{selectedCampaign.openCount ? selectedCampaign.openCount.toLocaleString() : '4,045'} ({selectedCampaign.openRate}%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#10b981] rounded-full inline-block" /> Clicked</span>
                          <span className="text-slate-800 font-black">{selectedCampaign.clickCount ? selectedCampaign.clickCount.toLocaleString() : '1,542'} ({selectedCampaign.clickRate}%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-500 rounded-full inline-block" /> Bounced</span>
                          <span className="text-slate-800 font-black">256 (2.1%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-pink-500 rounded-full inline-block" /> Unsubscribed</span>
                          <span className="text-slate-800 font-black">189 (1.5%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-slate-450 bg-slate-350 bg-slate-300 rounded-full inline-block" /> Not Opened</span>
                          <span className="text-slate-800 font-black">6,424 (51.5%)</span>
                        </div>
                      </div>

                    </div>

                    <a href="#reports" onClick={(e)=>{e.preventDefault(); setActiveTab('Reports')}} className="text-blue-600 hover:text-blue-700 font-black text-[10px] mt-4 block text-center flex items-center justify-center gap-1">
                      <span>View Detailed Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-slate-400 font-bold bg-slate-50/50 border border-slate-200 rounded-2xl flex flex-col justify-center items-center">
                    <MailWarning className="w-10 h-10 text-slate-300 mb-2" />
                    <span>No delivery metrics recorded for this Draft template yet.</span>
                  </div>
                )}
              </div>

              {/* QUICK ACTIONS WIDGETS COLUMN (EXACTLY MATCHING BOTTOM CORNER OF IMAGE) */}
              <div className="pt-5 space-y-4">
                <div>
                  <h4 className="text-[11px] font-black uppercase text-slate-850 tracking-wider">Quick Actions</h4>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">Execute micro-broadcast protocols immediately</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-bold text-[10px] text-slate-600 select-none">
                  
                  {/* duplicate click trigger */}
                  <button 
                    type="button" 
                    onClick={() => handleDuplicateCampaign(selectedCampaign.id)}
                    className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl hover:bg-slate-100/50 hover:border-slate-300 transition text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer leading-none"
                  >
                    <Copy className="w-4 h-4 text-blue-500" />
                    <span>Duplicate Campaign</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setActiveTab('Templates')}
                    className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl hover:bg-slate-100/50 hover:border-slate-300 transition text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer leading-none"
                  >
                    <Layout className="w-4 h-4 text-emerald-500" />
                    <span>Create Template</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => alert(`Simulating test email dispatch for "${selectedCampaign.campaignName}" to Sujan Karki (sujan.karki@nagariksolutions.com)...`)}
                    className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl hover:bg-slate-100/50 hover:border-slate-300 transition text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer leading-none block"
                  >
                    <Send className="w-4 h-4 text-purple-500" />
                    <span>Send Test Email</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => alert(`Simulated sharing link generated for Campaign: ${selectedCampaign.campaignName}`)}
                    className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl hover:bg-slate-100/50 hover:border-slate-300 transition text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer leading-none"
                  >
                    <Share2 className="w-4 h-4 text-indigo-500" />
                    <span>Share Campaign</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleExportCSV}
                    className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl hover:bg-slate-100/50 hover:border-slate-300 transition text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer leading-none"
                  >
                    <Download className="w-4 h-4 text-amber-500" />
                    <span>Export Report</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                    className="p-3 bg-red-50 hover:bg-red-100/70 border border-slate-200 hover:border-red-300 rounded-xl transition text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer leading-none text-rose-600 block"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>Delete Campaign</span>
                  </button>

                </div>
              </div>

            </div>
          </aside>
        </>
      )}

      </div>

      {/* CREATE NEW ADD_CAMPAIGNS WEYWARD MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none text-left">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg shadow-2xl flex flex-col animate-scale-in max-h-[90vh] overflow-hidden">
            {/* Modal Header - Sticky at Top */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center select-none leading-none shrink-0">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="font-black text-xs uppercase tracking-wider text-slate-800">Launch New Broadcast Drive</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddOpen(false)} 
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateCampaign} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
              
              {/* Feature 1: Load Template Quick Preset Selection */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-700 tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                    <span>Quick Load Marketing Template</span>
                  </div>
                  <span className="text-[9px] bg-blue-100/80 text-blue-700 font-extrabold px-1.5 py-0.5 rounded uppercase">PRESETS</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCampaignForm({
                        ...newCampaignForm,
                        campaignName: "☀️ Summer Launch Bonanza",
                        subject: "🔥 HOT DEALS: Save Flat 50% on School Suite, CRM systems!",
                        preheader: "Offer valid till end of fiscal year. Upgrade your workspace today.",
                        channel: "Email",
                        type: "Promotional",
                        targetContacts: 12500,
                        targetAudience: "All Leads",
                      });
                    }}
                    className="p-2 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 text-slate-700 hover:text-blue-700 rounded-lg transition text-left leading-tight shadow-3xs"
                  >
                    ☀️ Summer Sale Flat 50%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCampaignForm({
                        ...newCampaignForm,
                        campaignName: "📢 Nagarik Core Update v4.1",
                        subject: "Important Service Update - New features on your Dashboard",
                        preheader: "Meet the new timeline triggers, bulk upload nodes, and offline syncing.",
                        channel: "Email",
                        type: "Informational",
                        targetContacts: 8500,
                        targetAudience: "Existing Clients",
                      });
                    }}
                    className="p-2 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 text-slate-700 hover:text-blue-700 rounded-lg transition text-left leading-tight shadow-3xs"
                  >
                    📢 Product Node Updates
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCampaignForm({
                        ...newCampaignForm,
                        campaignName: "💬 Instant WhatsApp Onboard Hook",
                        subject: "Hi! Direct query support desk is active here.",
                        preheader: "Get 3 months premium onboarding assistant absolutely free.",
                        channel: "WhatsApp",
                        type: "Promotional",
                        targetContacts: 3200,
                        targetAudience: "Website Leads",
                      });
                    }}
                    className="p-2 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 text-slate-700 hover:text-blue-700 rounded-lg transition text-left leading-tight shadow-3xs"
                  >
                    💬 WhatsApp Welcome Ping
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCampaignForm({
                        ...newCampaignForm,
                        campaignName: "🔔 Final Renewal Overdue Notice",
                        subject: "[URGENT] Your subscription license expires in 48 hours",
                        preheader: "Pay directly via integrated payment gateways to bypass downtime loops.",
                        channel: "SMS",
                        type: "Transactional",
                        targetContacts: 1200,
                        targetAudience: "Inactive Leads",
                      });
                    }}
                    className="p-2 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 text-slate-700 hover:text-blue-700 rounded-lg transition text-left leading-tight shadow-3xs"
                  >
                    🔔 Overdue Invoice SMS
                  </button>
                </div>
              </div>

              {/* Campaign Name */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Campaign Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Winter Sale 2025" 
                  value={newCampaignForm.campaignName}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, campaignName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              {/* Channels & Strategic Type */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Drives Channel</label>
                  <select 
                    value={newCampaignForm.channel} 
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, channel: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="Email">📧 Email</option>
                    <option value="WhatsApp">💬 WhatsApp</option>
                    <option value="SMS">📱 SMS</option>
                    <option value="Social Media">🌐 Social Media Campaigns</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Strategic Type</label>
                  <select 
                    value={newCampaignForm.type} 
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, type: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="Promotional">Promotional</option>
                    <option value="Informational">Informational</option>
                    <option value="Event">Event</option>
                    <option value="Re-engagement">Re-engagement</option>
                    <option value="Survey">Survey</option>
                    <option value="Transactional">Transactional</option>
                  </select>
                </div>
              </div>

              {/* Feature 2: Subject Line with Optimized Magic Auto-suggestion button */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Subject Headline Message</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="🔥 Special Offer details!" 
                    value={newCampaignForm.subject}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, subject: e.target.value })}
                    className="flex-grow p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const suggestions = [
                        "🚀 Double your retail database conversion rates with custom APIs!",
                        "🔥 Final call: Claim 20% cashback on our enterprise software module.",
                        "💡 sujan, check out the new timeline scheduler built to scale.",
                        "⚡ Quick Reminder: Billed invoice outstanding. Verify to bypass downtime.",
                        "📢 Major release: Integrated WhatsApp messaging is now live!"
                      ];
                      const randomIndex = Math.floor(Math.random() * suggestions.length);
                      setNewCampaignForm({ ...newCampaignForm, subject: suggestions[randomIndex] });
                    }}
                    className="px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 shrink-0 transition"
                    title="Optimize using Magic rewriter templates"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                    <span>AI Subject</span>
                  </button>
                </div>
              </div>

              {/* Preheader Preview */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Preheader Preview Intro</label>
                <input 
                  type="text" 
                  placeholder="See the tailored pack rules before they expire soon." 
                  value={newCampaignForm.preheader}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, preheader: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold font-mono"
                />
              </div>

              {/* Audience list & volume */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Target Account Audience List</label>
                  <select
                    value={newCampaignForm.targetAudience}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, targetAudience: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="Website Leads">Website Leads</option>
                    <option value="Existing Clients">Existing Clients</option>
                    <option value="All Leads">All Leads</option>
                    <option value="Inactive Leads">Inactive Leads</option>
                    <option value="Product Users">Product Users</option>
                    <option value="All Contacts">All Contacts</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Target Leads Volumes Count</label>
                  <input 
                    type="number" 
                    value={newCampaignForm.targetContacts}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, targetContacts: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Start Date & Status */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={newCampaignForm.startDate}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, startDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-slate-650 text-xs font-semibold bg-white cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Status</label>
                  <select 
                    value={newCampaignForm.status}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, status: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs font-semibold text-slate-750 bg-white"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Feature 3: Interactive Reach Estimates Simulation Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Interactive Audience Reach Simulator</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 border border-slate-150 rounded-lg">
                    <span className="text-[8px] font-bold text-slate-400 block tracking-wider uppercase">Deliverability</span>
                    <span className="text-[11px] font-extrabold text-emerald-600 font-mono">99.8% (Fast)</span>
                  </div>
                  <div className="bg-white p-2 border border-slate-150 rounded-lg">
                    <span className="text-[8px] font-bold text-slate-400 block tracking-wider uppercase">Conversion Est.</span>
                    <span className="text-[11px] font-extrabold text-blue-600 font-mono">
                      {newCampaignForm.channel === 'Email' ? "~ 8.5%" :
                       newCampaignForm.channel === 'WhatsApp' ? "~ 14.2%" :
                       newCampaignForm.channel === 'SMS' ? "~ 4.3%" : "~ 5.1%"}
                    </span>
                  </div>
                  <div className="bg-white p-2 border border-slate-150 rounded-lg">
                    <span className="text-[8px] font-bold text-slate-400 block tracking-wider uppercase">Network Cost</span>
                    <span className="text-[11px] font-black text-emerald-600 uppercase font-sans">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-1 leading-none">
                  <span>Priority Node Route: <span className="text-emerald-500 font-black">Connected</span></span>
                  <span>Quota Limit: <span className="text-slate-600">Enterprise Free Direct</span></span>
                </div>
              </div>

              {/* Modal Actions Footer - Within Form to Scroll inside Modal easily */}
              <div className="pt-4 border-t border-slate-100 flex gap-3 text-xs shrink-0">
                <button 
                  type="submit" 
                  className="flex-grow py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer text-center"
                >
                  Create Outbound Campaign
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)} 
                  className="py-3 px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition cursor-pointer"
                >
                  Discard
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
