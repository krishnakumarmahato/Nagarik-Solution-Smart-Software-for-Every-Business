import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Lead } from '../types';
import { mockUsers } from '../data';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  Share2, 
  MessageSquare, 
  Flame, 
  Sparkles, 
  Merge,
  ExternalLink,
  ChevronRight,
  BadgeAlert,
  X,
  Users,
  UserPlus,
  TrendingUp,
  RotateCcw,
  Download,
  LayoutGrid,
  Filter,
  Calendar,
  ChevronDown,
  Globe,
  Clock,
  Target,
  Smartphone,
  Plus
} from 'lucide-react';

interface LeadsViewProps {
  searchQuery: string;
  setSearchQuery?: (q: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ searchQuery, setSearchQuery }) => {
  const { 
    leads, 
    activeLeadSubTab, 
    addLead, 
    updateLead, 
    deleteLead,
    currentUser
  } = useCRM();

  // Selected lead for detail/editing Drawer
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formIdPrefix, setFormIdPrefix] = useState<string>('L');

  // Filter values
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [websiteStatusFilter, setWebsiteStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');

  // Call simulator overlay state
  const [callLead, setCallLead] = useState<Lead | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('Interested');

  // WhatsApp mockup state
  const [waLead, setWaLead] = useState<Lead | null>(null);
  const [waText, setWaText] = useState('');

  // Duplicates Merge states
  const [mergeLead, setMergeLead] = useState<Lead | null>(null);
  const [mergeSuggestions, setMergeSuggestions] = useState<Lead[]>([]);
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  // New Lead form state
  const [newLeadForm, setNewLeadForm] = useState<Omit<Lead, 'id'>>({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    websiteStatus: 'No Website',
    suggestedPitch: '',
    packageOffered: '',
    leadPriority: 'Warm',
    followUpStatus: 'Follow-up Required',
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    clientResponse: 'Interested',
    assignedTo: currentUser.name,
    remarks: '',
    category: 'Trading',
    leadSource: 'Website Form'
  });

  // Filter logic based on subtab
  const getFilteredLeads = () => {
    let list = [...leads];

    // Filter by Subtab
    if (activeLeadSubTab === 'website') {
      list = list.filter(l => l.id.startsWith('W-'));
    } else if (activeLeadSubTab === 'software') {
      list = list.filter(l => l.id.startsWith('S-'));
    } else if (activeLeadSubTab === 'social') {
      list = list.filter(l => l.id.startsWith('SM-') || l.platform);
    } else if (activeLeadSubTab === 'hot') {
      list = list.filter(l => l.leadPriority === 'Hot');
    } else if (activeLeadSubTab === 'due') {
      list = list.filter(l => l.followUpStatus === 'Follow-up Required' || l.leadPriority === 'Hot');
    } else if (activeLeadSubTab === 'duplicates') {
      // Mock some exact duplication indicators exactly like screenshot
      list = list.slice(0, 4).map((l, idx) => ({
        ...l,
        isDuplicate: true,
        matchScore: idx === 0 ? 98 : idx === 1 ? 92 : 85,
        matchReason: idx === 0 
          ? 'Phone Number match with S-001 (Kathmandu Mega Mart)' 
          : 'Alternative business domain spelling overlap'
      }));
    }

    // Global Search Matches
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(l => 
        l.businessName.toLowerCase().includes(q) || 
        l.contactPerson.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email && l.email.toLowerCase().includes(q))
      );
    }

    // Secondary Dropdown Filters
    if (categoryFilter) {
      list = list.filter(l => l.category === categoryFilter);
    }
    if (priorityFilter) {
      list = list.filter(l => l.leadPriority === priorityFilter);
    }
    if (ownerFilter) {
      list = list.filter(l => l.assignedTo === ownerFilter);
    }
    if (sourceFilter) {
      list = list.filter(l => l.leadSource === sourceFilter);
    }
    if (productFilter) {
      list = list.filter(l => l.productsInterestedText?.toLowerCase().includes(productFilter.toLowerCase()));
    }
    if (websiteStatusFilter) {
      list = list.filter(l => l.websiteStatus === websiteStatusFilter);
    }
    if (packageFilter) {
      list = list.filter(l => l.packageOffered?.toLowerCase().includes(packageFilter.toLowerCase()));
    }

    return list;
  };

  const filteredList = getFilteredLeads();

  // Suggest Pitch Generator based on Website Status (Using real intelligence rules!)
  const getAutoSuggestedPitch = (status: string) => {
    switch (status) {
      case 'No Website':
        return 'Wants immediate local online search visibility. Pitch SEO-optimized business starter landing page package.';
      case 'Old Website':
        return 'Redesign the layout onto a headless ultrafast page with instant loading and customized booking.';
      case 'Needs Redesign':
        return 'Focus pitch on responsive layout improvements, modern corporate brand colors, and SSL certificate setup.';
      case 'Business Website':
        return 'Pitch integration of School Software/CRM system to capture active inquiries instantly.';
      case 'Ecommerce Website':
        return 'Upgrade system onto our high conversion Advanced Multi-vendor modules with API payments.';
      default:
        return 'Pitch Nagarik Software tailored solutions to increase business operations conversion.';
    }
  };

  const exportToCSV = () => {
    if (filteredList.length === 0) {
      triggerToast("No filtered leads available to export.");
      return;
    }
    
    // Add columns relevant to active sub-tab
    let headers = ["ID", "Business Name", "Location", "Contact Person", "Phone", "Priority", "Follow-up Status", "Next Follow-up Date", "Client Response", "Assigned To", "Remarks"];
    if (activeLeadSubTab === 'website') {
      headers = ["ID", "Business Name", "Location", "Contact Person", "Phone", "Website Status", "Suggested Pitch", "Package Offered", "Priority", "Follow-up Status", "Next Follow-up Date", "Client Response", "Assigned To", "Remarks"];
    }

    const rows = filteredList.map(lead => {
      if (activeLeadSubTab === 'website') {
        return [
          lead.id,
          lead.businessName,
          lead.city || "",
          lead.contactPerson,
          lead.phone,
          lead.websiteStatus || "",
          lead.suggestedPitch || "",
          lead.packageOffered || "",
          lead.leadPriority,
          lead.followUpStatus,
          lead.nextFollowUpDate,
          lead.clientResponse || "",
          lead.assignedTo,
          lead.remarks || ""
        ];
      } else {
        return [
          lead.id,
          lead.businessName,
          lead.city || "",
          lead.contactPerson,
          lead.phone,
          lead.leadPriority,
          lead.followUpStatus,
          lead.nextFollowUpDate,
          lead.clientResponse || "",
          lead.assignedTo,
          lead.remarks || ""
        ];
      }
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeLeadSubTab}_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Success! Exported ${filteredList.length} leads as CSV.`);
  };

  // Handle Save edits
  const handleUpdateSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLead) {
      updateLead(selectedLead);
      setIsEditDrawerOpen(false);
      setSelectedLead(null);
    }
  };

  // Hanlde Add Lead
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      ...newLeadForm,
      idPrefix: formIdPrefix,
      suggestedPitch: getAutoSuggestedPitch(newLeadForm.websiteStatus || 'No Website')
    });
    setIsAddModalOpen(false);
    // Reset Form
    setNewLeadForm({
      businessName: '',
      contactPerson: '',
      phone: '',
      email: '',
      websiteStatus: 'No Website',
      suggestedPitch: '',
      packageOffered: '',
      leadPriority: 'Warm',
      followUpStatus: 'Follow-up Required',
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      clientResponse: 'Interested',
      assignedTo: currentUser.name,
      remarks: '',
      category: 'Trading',
      leadSource: 'Website Form'
    });
  };

  // Handle call logs completion
  const handleSaveCallStatus = () => {
    if (callLead) {
      const updated: Lead = {
        ...callLead,
        followUpStatus: 'Contacted',
        clientResponse: callOutcome as any,
        remarks: callNotes || callLead.remarks
      };
      updateLead(updated);
      setCallLead(null);
      setCallNotes('');
    }
  };

  // Quick Action: WhatsApp Trigger
  const openWhatsAppSimulate = (lead: Lead, text: string) => {
    setWaLead(lead);
    setWaText(text);
  };

  const handleWhatsAppSend = () => {
    if (!waLead) return;
    const formattedText = encodeURIComponent(waText);
    const windowUrl = `https://wa.me/${waLead.phone}?text=${formattedText}`;
    
    const updated: Lead = {
      ...waLead,
      lastActivity: `WhatsApp Contact Logged on ${new Date().toISOString().split('T')[0]}`,
      remarks: `${waLead.remarks || ''}\n[WhatsApp Outreach Log]: Sent: "${waText.slice(0, 60)}..."`
    };
    updateLead(updated);
    setWaLead(null);
    window.open(windowUrl, '_blank');
    triggerToast(`Outreach documented! Redirecting secure API for: ${waLead.phone}.`);
  };

  const handleConfirmMerge = () => {
    if (!mergeLead || !mergeTargetId) return;
    const targetLead = leads.find(l => l.id === mergeTargetId);
    if (!targetLead) return;

    const combinedLead: Lead = {
      ...targetLead,
      remarks: `${targetLead.remarks || ''}\n[Leads Deduplicated Log]: Combined files from sibling duplicate record ${mergeLead.businessName}. Additional comments copied: ${mergeLead.remarks || 'None'}`
    };

    deleteLead(mergeLead.id);
    updateLead(combinedLead);
    setMergeLead(null);
    triggerToast(`Successfully resolved duplicates! Merged ${mergeLead.businessName} safely into ${targetLead.businessName}.`);
  };

  const getKpiCards = () => {
    switch (activeLeadSubTab) {
      case 'website':
        return [
          {
            title: 'Total Website Leads',
            value: '1,248',
            change: '↑ 15.3%',
            changeSub: 'from last month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-blue-600 text-white shadow-md',
            icon: Globe,
          },
          {
            title: 'No Website',
            value: '320',
            change: '↑ 8.1%',
            changeSub: 'from last month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-slate-400 text-white shadow-md',
            icon: Globe,
          },
          {
            title: 'Needs Redesign',
            value: '412',
            change: '↑ 12.5%',
            changeSub: 'from last month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-amber-500 text-white shadow-md',
            icon: Edit3,
          },
          {
            title: 'Follow-ups Due',
            value: '186',
            change: 'View follow-ups →',
            changeSub: '',
            changeColor: 'text-blue-600 font-extrabold hover:underline cursor-pointer',
            iconBg: 'bg-violet-500 text-white shadow-md',
            icon: Clock,
          },
          {
            title: 'Hot Prospects',
            value: '187',
            change: 'View hot leads →',
            changeSub: '',
            changeColor: 'text-blue-600 font-extrabold hover:underline cursor-pointer',
            iconBg: 'bg-rose-500 text-white shadow-md',
            icon: Flame,
          },
          {
            title: 'Website Conversions',
            value: '96',
            change: '↑ 18.7%',
            changeSub: 'this month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-emerald-500 text-white shadow-md',
            icon: TrendingUp,
          }
        ];
      case 'software':
        return [
          {
            title: 'Total Software Leads',
            value: '856',
            change: '▲ 14.2%',
            changeSub: 'from last month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
            icon: Users,
          },
          {
            title: 'Active Subscriptions',
            value: '342',
            change: '▲ 10.5%',
            changeSub: 'this month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white',
            icon: CheckCircle2,
          },
          {
            title: 'Demos Completed',
            value: '118',
            change: 'this week',
            changeSub: '',
            changeColor: 'text-purple-600 font-extrabold',
            iconBg: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
            icon: Target,
          },
          {
            title: 'Proposals Pending',
            value: '24',
            change: 'Requires review',
            changeSub: '',
            changeColor: 'text-amber-500 font-extrabold',
            iconBg: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white',
            icon: Edit3,
          },
          {
            title: 'Expiring Licences',
            value: '12',
            change: 'Renew soon',
            changeSub: '',
            changeColor: 'text-rose-500 font-extrabold',
            iconBg: 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white',
            icon: AlertTriangle,
          },
          {
            title: 'Software Revenue',
            value: 'Rs. 1.84 Cr',
            change: '▲ 19.3%',
            changeSub: 'this month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white',
            icon: null,
          }
        ];
      case 'social':
        return [
          {
            title: 'Total Social Leads',
            value: '2,354',
            change: '▲ 21.3%',
            changeSub: 'from last month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
            icon: Users,
          },
          {
            title: 'Facebook Inquiries',
            value: '1,120',
            change: '▲ 18.7%',
            changeSub: 'this month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white',
            icon: Smartphone,
          },
          {
            title: 'Instagram Leads',
            value: '856',
            change: '▲ 24.1%',
            changeSub: 'this month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white',
            icon: Share2,
          },
          {
            title: 'WhatsApp Queries',
            value: '248',
            change: 'Active dialogs',
            changeSub: '',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white',
            icon: MessageSquare,
          },
          {
            title: 'Instant Responses',
            value: '186',
            change: 'Avg < 15 mins',
            changeSub: '',
            changeColor: 'text-[#10b981] font-black',
            iconBg: 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white',
            icon: CheckCircle2,
          },
          {
            title: 'Ad Campaign Leads',
            value: '118',
            change: 'This month',
            changeSub: '',
            changeColor: 'text-purple-600 font-extrabold',
            iconBg: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
            icon: Sparkles,
          }
        ];
      case 'hot':
        return [
          {
            title: 'Total Hot Leads',
            value: '2,156',
            change: '▲ 15.4%',
            changeSub: 'this month',
            changeColor: 'text-red-500 font-extrabold',
            iconBg: 'bg-red-50 text-red-600 hover:bg-red-650 hover:text-white',
            icon: Flame,
          },
          {
            title: 'High Score Leads',
            value: '1,468',
            change: '▲ 18.7%',
            changeSub: 'this month',
            changeColor: 'text-amber-500 font-extrabold',
            iconBg: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white',
            icon: Sparkles,
          },
          {
            title: 'Demos This Week',
            value: '24',
            change: '▲ 9.1%',
            changeSub: 'this week',
            changeColor: 'text-purple-500 font-extrabold',
            iconBg: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
            icon: Target,
          },
          {
            title: 'Proposals Sent',
            value: '18',
            change: '▲ 12.5%',
            changeSub: 'this week',
            changeColor: 'text-[#10b981] font-extrabold',
            iconBg: 'bg-[#ecfdf5] text-[#10b981] hover:bg-emerald-600 hover:text-white',
            icon: CheckCircle2,
          },
          {
            title: 'Expected Closures',
            value: '11',
            change: '▲ 10.0%',
            changeSub: 'this week',
            changeColor: 'text-blue-500 font-extrabold',
            iconBg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
            icon: TrendingUp,
          },
          {
            title: 'Estimated Revenue',
            value: 'Rs. 3.72 Cr',
            change: '▲ 22.8%',
            changeSub: 'this month',
            changeColor: 'text-[#10b981] font-extrabold',
            iconBg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white',
            icon: null,
          }
        ];
      case 'due':
        return [
          {
            title: 'Follow-ups Due Today',
            value: '18',
            change: '▲ 12%',
            changeSub: 'vs yesterday',
            changeColor: 'text-amber-500 font-extrabold',
            iconBg: 'bg-amber-50 text-amber-655 hover:bg-amber-600 hover:text-white',
            icon: Phone,
          },
          {
            title: 'Overdue Follow-ups',
            value: '7',
            change: 'View overdue →',
            changeSub: '',
            changeColor: 'text-red-600 font-extrabold hover:underline cursor-pointer',
            iconBg: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
            icon: Clock,
          },
          {
            title: 'Calls Pending',
            value: '12',
            change: 'Today',
            changeSub: '',
            changeColor: 'text-blue-500 font-extrabold',
            iconBg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
            icon: MessageSquare,
          },
          {
            title: 'Demos Pending',
            value: '6',
            change: 'This week',
            changeSub: '',
            changeColor: 'text-purple-500 font-extrabold',
            iconBg: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
            icon: Target,
          },
          {
            title: 'Proposals Pending',
            value: '8',
            change: 'This week',
            changeSub: '',
            changeColor: 'text-indigo-500 font-extrabold',
            iconBg: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white',
            icon: Edit3,
          },
          {
            title: 'Completed Today',
            value: '11',
            change: '▲ 15%',
            changeSub: 'vs yesterday',
            changeColor: 'text-[#10b981] font-black',
            iconBg: 'bg-teal-50 text-teal-605 hover:bg-teal-600 hover:text-white',
            icon: CheckCircle2,
          }
        ];
      case 'duplicates':
        return [
          {
            title: 'Suspected Duplicates',
            value: '248',
            change: '2.45% of total',
            changeSub: '',
            changeColor: 'text-red-500 font-extrabold',
            iconBg: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
            icon: Users,
          },
          {
            title: 'High Confidence Matches',
            value: '96',
            change: '38.7% of duplicates',
            changeSub: '',
            changeColor: 'text-amber-500 font-extrabold',
            iconBg: 'bg-amber-50 text-amber-600 hover:bg-amber-655 hover:text-white',
            icon: Sparkles,
          },
          {
            title: 'Merged Today',
            value: '18',
            change: '▲ 28.6%',
            changeSub: 'vs yesterday',
            changeColor: 'text-[#10b981] font-extrabold',
            iconBg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-605 hover:text-white',
            icon: Merge,
          },
          {
            title: 'Pending Review',
            value: '62',
            change: 'Requires attention',
            changeSub: '',
            changeColor: 'text-purple-500 font-extrabold',
            iconBg: 'bg-purple-50 text-purple-600 hover:bg-purple-655 hover:text-white',
            icon: Clock,
          },
          {
            title: 'Invalid Contacts',
            value: '31',
            change: 'Marked as invalid',
            changeSub: '',
            changeColor: 'text-orange-500 font-extrabold',
            iconBg: 'bg-orange-50 text-orange-600 hover:bg-orange-655 hover:text-white',
            icon: AlertTriangle,
          },
          {
            title: 'Clean Records',
            value: '300,245',
            change: '97.55% of total',
            changeSub: '',
            changeColor: 'text-[#10b981] font-extrabold',
            iconBg: 'bg-teal-50 text-teal-600 hover:bg-teal-655 hover:text-white',
            icon: CheckCircle2,
          }
        ];
      default:
        return [
          {
            title: 'Total Leads',
            value: '300,245',
            change: '▲ 12.5%',
            changeSub: 'from last month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
            icon: Users,
          },
          {
            title: 'New Leads',
            value: '8,752',
            change: '▲ 18.7%',
            changeSub: 'this month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-emerald-50 text-emerald-605 hover:bg-emerald-600 hover:text-white',
            icon: UserPlus,
          },
          {
            title: 'Follow-ups Due Today',
            value: '1,286',
            change: 'View follow-ups →',
            changeSub: '',
            changeColor: 'text-blue-500 font-extrabold hover:underline cursor-pointer',
            iconBg: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white',
            icon: Phone,
          },
          {
            title: 'Hot Leads',
            value: '2,156',
            change: 'View hot leads →',
            changeSub: '',
            changeColor: 'text-blue-500 font-extrabold hover:underline cursor-pointer',
            iconBg: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
            icon: Flame,
          },
          {
            title: 'Converted (This Month)',
            value: '215',
            change: '▲ 15.4%',
            changeSub: 'this month',
            changeColor: 'text-emerald-500 font-extrabold',
            iconBg: 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white',
            icon: CheckCircle2,
          },
          {
            title: 'Pipeline Value',
            value: 'Rs. 1.28 Cr',
            change: 'View pipeline →',
            changeSub: '',
            changeColor: 'text-blue-500 font-extrabold hover:underline cursor-pointer',
            iconBg: 'bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white',
            icon: null,
          }
        ];
    }
  };

  const kpiCards = getKpiCards();

  // Define All Sub-view custom renderers right here
  const renderSubTabContent = () => {
    switch (activeLeadSubTab) {
      case 'duplicates':
        return renderDuplicatesView();
      case 'due':
        return renderFollowUpDueView();
      case 'hot':
        return renderHotLeadsView();
      default:
        return renderStandardTableView();
    }
  };

  const renderDuplicatesView = () => {
    const duplicateData = [
      {
        id: 'dup-1',
        primary: {
          name: 'Fashion Hub',
          city: 'Kathmandu, Bagmati',
          phone: '9851123456',
          email: 'fashionhub@gmail.com',
          iconColor: 'bg-blue-100 text-blue-600'
        },
        duplicate: {
          name: 'Fashion Hub',
          city: 'Kathmandu, Bagmati',
          phone: '9851123456',
          email: 'info@fashionhub.com',
          iconColor: 'bg-purple-100 text-purple-600'
        },
        source: 'Website Form',
        date: '18 May 2025',
        reason: ['Same phone number', 'Similar business name', 'Similar email domain'],
        confidence: 98,
        confidenceText: 'Very High',
        confidenceColor: 'stroke-emerald-500 text-emerald-500'
      },
      {
        id: 'dup-2',
        primary: {
          name: 'ABC Law Associates',
          city: 'Kathmandu, Bagmati',
          phone: '9851345678',
          email: 'contact@abclaw.com',
          iconColor: 'bg-emerald-100 text-emerald-600'
        },
        duplicate: {
          name: 'ABC Law Associates',
          city: 'Kathmandu, Bagmati',
          phone: '9851345678',
          email: 'abclawassociates@gmail.com',
          iconColor: 'bg-orange-100 text-orange-600'
        },
        source: 'Google Ads',
        date: '20 May 2025',
        reason: ['Same phone number', 'Similar business name', 'Different email'],
        confidence: 85,
        confidenceText: 'High',
        confidenceColor: 'stroke-amber-500 text-amber-500'
      },
      {
        id: 'dup-3',
        primary: {
          name: 'Green Valley Hospital',
          city: 'Chitwan, Bagmati',
          phone: '9845012345',
          email: 'info@greenvalley.com',
          iconColor: 'bg-blue-100 text-blue-600'
        },
        duplicate: {
          name: 'Green Valley Hospital Pvt. Ltd.',
          city: 'Chitwan, Bagmati',
          phone: '9845012345',
          email: 'gvhospital@gmail.com',
          iconColor: 'bg-purple-100 text-purple-600'
        },
        source: 'Facebook Lead Ad',
        date: '19 May 2025',
        reason: ['Same phone number', 'Similar business name', 'Different email'],
        confidence: 78,
        confidenceText: 'High',
        confidenceColor: 'stroke-amber-500 text-amber-500'
      },
      {
        id: 'dup-4',
        primary: {
          name: 'City Mart',
          city: 'Lalitpur, Bagmati',
          phone: '9851234432',
          email: 'citymart@store.com',
          iconColor: 'bg-orange-100 text-orange-600'
        },
        duplicate: {
          name: 'City Mart',
          city: 'Lalitpur, Bagmati',
          phone: '9851234432',
          email: 'hello@citymart.com',
          iconColor: 'bg-rose-100 text-rose-600'
        },
        source: 'Referral',
        date: '22 May 2025',
        reason: ['Same phone number', 'Exact business name', 'Different email'],
        confidence: 65,
        confidenceText: 'Medium',
        confidenceColor: 'stroke-amber-500 text-amber-500'
      },
      {
        id: 'dup-5',
        primary: {
          name: 'Bright Future School',
          city: 'Bhaktapur, Bagmati',
          phone: '9843322110',
          email: 'info@brightfuture.edu.np',
          iconColor: 'bg-[#ccfbf1] text-teal-600'
        },
        duplicate: {
          name: 'Bright Future School',
          city: 'Bhaktapur, Bagmati',
          phone: '9843322110',
          email: 'contact@brightfuture.edu.np',
          iconColor: 'bg-blue-100 text-blue-600'
        },
        source: 'Website Chat',
        date: '21 May 2025',
        reason: ['Same phone number', 'Exact business name', 'Different email'],
        confidence: 55,
        confidenceText: 'Medium',
        confidenceColor: 'stroke-amber-400 text-amber-400'
      }
    ];

    return (
      <div className="space-y-4">
        <div className="flex border-b border-slate-200 shrink-0">
          <button className="px-5 py-2 border-b-2 border-blue-600 text-blue-600 text-xs font-black">All Duplicates</button>
          <button onClick={() => triggerToast("Filter by high confidence duplicates score.")} className="px-5 py-2 text-slate-500 hover:text-slate-705 text-xs font-semibold cursor-pointer select-none">High Confidence</button>
          <button onClick={() => triggerToast("Filter by duplicate records pending manual review.")} className="px-5 py-2 text-slate-500 hover:text-slate-705 text-xs font-semibold cursor-pointer select-none">Pending Review</button>
          <button onClick={() => triggerToast("Filter by Ignored duplicate alerts.")} className="px-5 py-2 text-slate-500 hover:text-slate-705 text-xs font-semibold cursor-pointer select-none">Ignored</button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-205 shadow-xs overflow-hidden min-w-[1240px]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/85 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <th className="py-3 px-4 w-8 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5" defaultChecked readOnly />
                </th>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-[28%]">Primary Record (Most Complete)</th>
                <th className="py-3 px-4 w-[28%]">Possible Duplicate (To Review)</th>
                <th className="py-3 px-4">Source & Date</th>
                <th className="py-3 px-4">Match Reason</th>
                <th className="py-3 px-4 text-center">Confidence Score</th>
                <th className="py-3 px-4 text-center">Recommended Action</th>
                <th className="py-3 px-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {duplicateData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/15 border-slate-150">
                  <td className="py-4 px-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer" />
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                  
                  {/* Primary */}
                  <td className="py-4 px-4">
                    <div className="flex gap-3">
                      <div className={`w-8.5 h-8.5 rounded-xl ${item.primary.iconColor} flex items-center justify-center font-bold shrink-0 shadow-2xs`}>
                        <Building2 className="w-4 h-4 shrink-0" />
                      </div>
                      <div>
                        <span className="font-black text-[13px] text-slate-900 block leading-tight">{item.primary.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">{item.primary.city}</span>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="text-[10px] font-mono font-bold text-slate-700 tracking-tight">{item.primary.phone}</span>
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm px-1.5 text-[8px] font-black uppercase tracking-wider scale-90">💬 DM</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{item.primary.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Duplicate */}
                  <td className="py-4 px-4">
                    <div className="flex gap-3">
                      <div className={`w-8.5 h-8.5 rounded-xl ${item.duplicate.iconColor} flex items-center justify-center font-bold shrink-0 shadow-2xs`}>
                        <Building2 className="w-4 h-4 shrink-0" />
                      </div>
                      <div>
                        <span className="font-black text-[13px] text-slate-900 block leading-tight">{item.duplicate.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">{item.duplicate.city}</span>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="text-[10px] font-mono font-bold text-slate-700 tracking-tight">{item.duplicate.phone}</span>
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm px-1.5 text-[8px] font-black uppercase tracking-wider scale-90">💬 DM</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{item.duplicate.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-700 text-xs">{item.source}</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1 tracking-tight">{item.date}</span>
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1.5 max-w-[200px]">
                      {item.reason.map((res, rid) => (
                        <span key={rid} className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100/50 rounded-lg px-2 py-0.5 text-[9px] font-bold text-rose-700/90 leading-tight">
                          ● {res}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Confidence Circle */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0 select-none">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="18" className="stroke-slate-100" strokeWidth="2.5" fill="transparent" />
                          <circle cx="24" cy="24" r="18" strokeWidth="2.5" fill="transparent"
                            strokeDasharray={2 * Math.PI * 18}
                            strokeDashoffset={2 * Math.PI * 18 * (1 - item.confidence / 100)} className={item.confidenceColor} />
                        </svg>
                        <span className="absolute text-[10px] font-black text-slate-850">{item.confidence}%</span>
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-400 mt-1 uppercase tracking-wider">{item.confidenceText}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col gap-2 items-center justify-center w-full max-w-[125px] mx-auto">
                      {item.confidence >= 80 ? (
                        <button 
                          onClick={() => triggerToast(`Successfully merged duplicate record: ${item.duplicate.name} into ${item.primary.name}.`)}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] rounded-lg shadow-sm cursor-pointer select-none transition uppercase tracking-wider"
                        >
                          Merge Records
                        </button>
                      ) : (
                        <button 
                          onClick={() => triggerToast(`Launching interactive side-by-side verification drawer.`)}
                          className="w-full py-1.5 border border-blue-500 hover:bg-blue-50 text-blue-600 font-extrabold text-[10px] rounded-lg cursor-pointer transition select-none uppercase tracking-wider"
                        >
                          Review Match
                        </button>
                      )}
                      
                      <div className="flex gap-2 text-[9px] font-bold text-slate-400">
                        <button onClick={() => triggerToast("Duplicate alerts dismissed permanently.")} className="hover:text-slate-600 cursor-pointer select-none">Ignore</button>
                        <span className="text-slate-200">|</span>
                        <button onClick={() => triggerToast("Flagged as separate entities.")} className="hover:text-slate-600 whitespace-nowrap cursor-pointer select-none">Keep Separate</button>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-2 text-center text-slate-400 font-bold cursor-pointer hover:text-slate-600 text-sm">
                    ⋮
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFollowUpDueView = () => {
    const hourlyQueue = [
      { id: 'q-1', time: '09:00 AM', name: 'Ramesh Shrestha', company: 'Fashion Hub', priority: 'High' },
      { id: 'q-2', time: '09:30 AM', name: 'Dipak Adhikari', company: 'New Shree Hardware', priority: 'High' },
      { id: 'q-3', time: '10:00 AM', name: 'Sandeep Maharjan', company: 'City Mart', priority: 'Medium' },
      { id: 'q-4', time: '10:30 AM', name: 'Sarita Shakya', company: 'Bright Future School', priority: 'High' },
      { id: 'q-5', time: '11:00 AM', name: 'Mahesh Acharya', company: 'Himalayan Traders', priority: 'Medium' },
      { id: 'q-6', time: '11:30 AM', name: 'Om Prasad Yadav', company: 'Om Steel Suppliers', priority: 'Low' },
      { id: 'q-7', time: '12:00 PM', name: 'Nabin K.C.', company: 'Creative Design Studio', priority: 'Medium' },
      { id: 'q-8', time: '01:00 PM', name: 'Anita Sharma', company: 'ABC Law Associates', priority: 'High' }
    ];

    const followupsList = [
      { idx: 1, name: 'Ramesh Shrestha', company: 'Fashion Hub', phone: '9851123456', interest: 'Clothing Store', lastResponse: 'Interested in pricing', lastDate: '17 May 2025', dueTime: '09:00 AM', type: 'Call', typeColor: 'bg-blue-50 text-blue-600 border-blue-200', priority: 'High', priorityColor: 'bg-red-50 text-red-655 border-red-200', user: 'Sujan Karki' },
      { idx: 2, name: 'Dipak Adhikari', company: 'New Shree Hardware', phone: '9845123456', interest: 'Hardware', lastResponse: 'Asked for demo', lastDate: '16 May 2025', dueTime: '09:30 AM', type: 'Demo', typeColor: 'bg-purple-50 text-purple-655 border-purple-200', priority: 'High', priorityColor: 'bg-red-50 text-red-655 border-red-200', user: 'Anita Sharma' },
      { idx: 3, name: 'Sandeep Maharjan', company: 'City Mart', phone: '9851234432', interest: 'Supermarket', lastResponse: 'Need more info', lastDate: '16 May 2025', dueTime: '10:00 AM', type: 'Call', typeColor: 'bg-blue-50 text-blue-600 border-blue-200', priority: 'Medium', priorityColor: 'bg-amber-50 text-amber-655 border-amber-200', user: 'Ramesh Thapa' },
      { idx: 4, name: 'Sarita Shakya', company: 'Bright Future School', phone: '9843322110', interest: 'School Mgmt', lastResponse: 'Waiting for proposal', lastDate: '17 May 2025', dueTime: '10:30 AM', type: 'Proposal', typeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200', priority: 'High', priorityColor: 'bg-red-50 text-red-655 border-red-200', user: 'Sujan Karki' },
      { idx: 5, name: 'Mahesh Acharya', company: 'Himalayan Traders', phone: '9801122334', interest: 'Traders', lastResponse: 'Budget discussion', lastDate: '15 May 2025', dueTime: '11:00 AM', type: 'Call', typeColor: 'bg-blue-50 text-blue-600 border-blue-200', priority: 'Medium', priorityColor: 'bg-amber-50 text-amber-655 border-amber-200', user: 'Bikram Raut' },
      { idx: 6, name: 'Om Prasad Yadav', company: 'Om Steel Suppliers', phone: '9811223344', interest: 'Steel Supplier', lastResponse: 'Requested catalog', lastDate: '15 May 2025', dueTime: '11:00 AM', type: 'WhatsApp', typeColor: 'bg-emerald-50 text-emerald-605 border-emerald-200', priority: 'Low', priorityColor: 'bg-slate-50 text-slate-600 border-slate-200', user: 'Pooja Mahat' },
      { idx: 7, name: 'Nabin K.C.', company: 'Creative Design Studio', phone: '9859876543', interest: 'Design Studio', lastResponse: 'Interested in features', lastDate: '12 May 2025', dueTime: '12:00 PM', type: 'Call', typeColor: 'bg-blue-50 text-blue-600 border-blue-200', priority: 'Medium', priorityColor: 'bg-amber-50 text-amber-655 border-amber-200', user: 'Ramesh Thapa' },
      { idx: 8, name: 'Anita Sharma', company: 'ABC Law Associates', phone: '9856543210', interest: 'Law Firm', lastResponse: 'Compared with others', lastDate: '16 May 2025', dueTime: '01:00 PM', type: 'Follow-up', typeColor: 'bg-slate-50 text-slate-600 border-slate-205', priority: 'High', priorityColor: 'bg-red-50 text-red-655 border-red-200', user: 'Anita Sharma' }
    ];

    return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 items-start">
        {/* Left Column queue list */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">Today's Queue</h4>
            <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg text-[9px] font-black">
              <Calendar className="w-3 h-3" />
              <span>18 MAY 2025</span>
            </div>
          </div>
          
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {hourlyQueue.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl transition flex justify-between items-center group">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 font-extrabold">{item.time}</span>
                  <div className="font-extrabold text-[#1a202c] text-xs leading-tight mt-0.5">{item.name}</div>
                  <span className="text-[9.5px] text-slate-400 font-bold block mt-0.5">{item.company}</span>
                </div>
                <div className="flex items-center gap-1.5 font-sans">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    item.priority === 'High' ? 'bg-red-50 text-red-650 border border-red-100' : item.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-550 border border-slate-200'
                  }`}>{item.priority}</span>
                  <button onClick={() => triggerToast(`Dialing client ${item.name} via secure VoIP.`)} className="p-1 rounded bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition cursor-pointer shrink-0">
                    <Phone className="w-3 h-3" />
                  </button>
                  <button onClick={() => triggerToast(`Opening WhatsApp outreach portal for ${item.name}.`)} className="p-1 rounded bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition cursor-pointer shrink-0 text-[10px]">
                    💬
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={() => triggerToast("Launching full Calendars event schedule manager.")} className="w-full text-center text-[9px] uppercase font-black tracking-widest text-blue-605 hover:underline pt-2 block border-t border-slate-100">
            View Full Schedule →
          </button>
        </div>

        {/* Right Column Table */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-w-[900px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/85 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                  <th className="py-3 px-4 w-8 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5" defaultChecked readOnly />
                  </th>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Lead Name & Business</th>
                  <th className="py-3 px-4 font-normal text-slate-400">Phone Number</th>
                  <th className="py-3 px-4">Product Interest</th>
                  <th className="py-3 px-4">Last Response Status</th>
                  <th className="py-3 px-4">Last Contact</th>
                  <th className="py-3 px-4 font-mono">Due Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-705">
                {followupsList.map((lead) => (
                  <tr key={lead.idx} className="hover:bg-slate-50/15 border-slate-150">
                    <td className="py-3.5 px-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer" />
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">{lead.idx}</td>
                    <td className="py-3.5 px-4 col-span-1">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[12.5px] text-slate-900 leading-tight">{lead.name}</span>
                        <span className="text-[10px] text-slate-404 font-bold block mt-1">{lead.company}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="font-mono text-slate-800 font-bold text-xs tracking-tight">{lead.phone}</span>
                        <span onClick={() => triggerToast(`Contacting WhatsApp api for ${lead.name}.`)} className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm px-1.5 font-black uppercase cursor-pointer">💬</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-500">{lead.interest}</td>
                    <td className="py-3.5 px-4 italic text-amber-600 font-bold text-[11px] max-w-[150px] truncate">{lead.lastResponse}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-bold">{lead.lastDate}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 tracking-tight text-[11.5px]">{lead.dueTime}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border inline-block ${lead.typeColor}`}>
                        {lead.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border inline-block ${lead.priorityColor}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-700">{lead.user}</span>
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-400 font-bold cursor-pointer hover:text-slate-600 text-sm">
                      ⋮
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Actions strip layout */}
          <div className="bg-slate-900 border border-slate-950 p-4.5 rounded-xl flex items-center justify-between text-white flex-wrap gap-4 shadow-lg shrink-0">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quick Actions:</span>
              <div className="flex gap-1.5 flex-wrap font-sans text-[10px]">
                <button onClick={() => triggerToast("Initiating bulk VoIP dialing process.")} className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-705 border border-slate-700 rounded-lg font-extrabold cursor-pointer transition uppercase tracking-wider">☎ Call Client</button>
                <button onClick={() => triggerToast("Preparing bulk secure WhatsApp broadcast messages.")} className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-705 border border-slate-700 rounded-lg font-extrabold cursor-pointer transition uppercase tracking-wider">💬 WhatsApp</button>
                <button onClick={() => triggerToast("Opening bulk scheduler reschedule dialogue.")} className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-705 border border-slate-700 rounded-lg font-extrabold cursor-pointer transition uppercase tracking-wider">📅 Reschedule</button>
                <button onClick={() => triggerToast("Setting selected follow-ups to Completed status.")} className="px-3.5 py-1.5 bg-emerald-500/25 border border-emerald-500/30 hover:bg-emerald-600/40 text-emerald-400 font-extrabold rounded-lg cursor-pointer transition uppercase tracking-wider">✓ Complete</button>
                <button onClick={() => triggerToast("Batch append comments log.")} className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-705 border border-slate-700 rounded-lg font-extrabold cursor-pointer transition uppercase tracking-wider">+ Add Note</button>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button onClick={() => triggerToast("Configure custom bulk operations workflow.")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-750 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer select-none">
                Bulk Actions ▾
              </button>
              <button 
                onClick={() => { setIsAddModalOpen(true); }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md transition cursor-pointer select-none"
              >
                + Add Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHotLeadsView = () => {
    const hotList = [
      { idx: 1, score: 98, name: 'ABC Law Associates', city: 'Kathmandu, Bagmati', product: 'Court Management System', time: '2h ago', stage: 'Proposal Sent', stageClass: 'border-blue-200 text-blue-600 bg-blue-50/20', deal: 'Rs. 45,00,000', nextAction: 'Review Proposal', date: 'Today', agent: 'Sujan Karki' },
      { idx: 2, score: 96, name: 'Bright Future School', city: 'Bhaktapur, Bagmati', product: 'School Management System', time: '4h ago', stage: 'Demo Completed', stageClass: 'border-indigo-200 text-indigo-600 bg-indigo-50/20', deal: 'Rs. 32,00,000', nextAction: 'Send Proposal', date: 'Tomorrow', agent: 'Anita Sharma' },
      { idx: 3, score: 94, name: 'Green Valley Hospital', city: 'Chitwan, Bagmati', product: 'eHMS webpage', time: '6h ago', stage: 'Demo Scheduled', stageClass: 'border-purple-200 text-purple-600 bg-purple-50/20', deal: 'Rs. 55,00,000', nextAction: 'Prepare Demo', date: 'In 2 days', agent: 'Bikram Raut' },
      { idx: 4, score: 93, name: 'Himalayan Traders', city: 'Butwal, Lumbini', product: 'Website Inventory System', time: '8h ago', stage: 'Negotiation', stageClass: 'border-amber-200 text-amber-600 bg-amber-50/20', deal: 'Rs. 28,50,000', nextAction: 'Commercial Offer', date: 'In 3 days', agent: 'Sujan Karki' },
      { idx: 5, score: 91, name: 'Creative Design Studio', city: 'Kathmandu, Bagmati', product: 'Design Studio Software', time: '1d ago', stage: 'Proposal Sent', stageClass: 'border-blue-200 text-blue-650 bg-blue-50/20', deal: 'Rs. 15,00,000', nextAction: 'Follow up', date: 'In 4 days', agent: 'Ramesh Thapa' },
      { idx: 6, score: 89, name: 'City Mart', city: 'Lalitpur, Bagmati', product: 'eCommerce Inventory', time: '1d ago', stage: 'Demo Completed', stageClass: 'border-indigo-200 text-indigo-650 bg-indigo-50/20', deal: 'Rs. 40,00,000', nextAction: 'Send Proposal', date: 'In 5 days', agent: 'Anita Sharma' },
      { idx: 7, score: 88, name: 'Om Steel Suppliers', city: 'Biratnagar, Koshi', product: 'Steel Supplier ERP', time: '2d ago', stage: 'Qualification', stageClass: 'border-slate-300 text-slate-550 bg-slate-50', deal: 'Rs. 18,75,000', nextAction: 'Needs Analysis', date: 'In 6 days', agent: 'Bikram Raut' },
      { idx: 8, score: 86, name: 'New Shree Hardware', city: 'Pokhara, Gandaki', product: 'Hardware CRM', time: '2d ago', stage: 'Demo Scheduled', stageClass: 'border-purple-200 text-purple-655 bg-purple-50/20', deal: 'Rs. 12,50,050', nextAction: 'Confirm Demo', date: 'In 8 days', agent: 'Pooja Mahat' }
    ];

    const opportunities = [
      { id: 1, name: 'ABC Law Associates', product: 'Court Management System', val: 'Rs. 45,00,000', progress: 90, color: 'stroke-emerald-500 text-emerald-500' },
      { id: 2, name: 'Green Valley Hospital', product: 'eHMS, Website', val: 'Rs. 55,00,000', progress: 78, color: 'stroke-amber-500 text-amber-500' },
      { id: 3, name: 'Bright Future School', product: 'School Management System', val: 'Rs. 32,00,000', progress: 85, color: 'stroke-emerald-500 text-emerald-500' },
      { id: 4, name: 'City Mart', product: 'eCommerce, Inventory', val: 'Rs. 40,00,000', progress: 68, color: 'stroke-amber-500 text-amber-550' },
      { id: 5, name: 'Himalayan Traders', product: 'Website, Inventory', val: 'Rs. 28,50,050', progress: 75, color: 'stroke-amber-500 text-amber-550' }
    ];

    return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 items-start">
        {/* Table Area */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-w-[900px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/85 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-205">
                  <th className="py-3 px-4 w-8 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5" defaultChecked readOnly />
                  </th>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 w-[28%]">Business / Company Clinic</th>
                  <th className="py-3 px-4">Product Interest</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 font-mono">Deal Value</th>
                  <th className="py-3 px-4 text-blue-600">Next Action</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  <th className="py-3 px-4">Agent</th>
                  <th className="py-3 px-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {hotList.map((lead) => (
                  <tr key={lead.idx} className="hover:bg-red-50/15 border-slate-150">
                    <td className="py-3.5 px-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer" />
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">{lead.idx}</td>
                    
                    {/* Score Indicator Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 px-2.5 py-0.5 rounded-full font-black select-none text-[11px] font-mono shrink-0">
                        <Flame className="w-3.5 h-3.5 shrink-0 fill-red-500 text-red-500 animate-pulse mt-0.5" />
                        <span>{lead.score}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 mt-0.5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[12.5px] text-slate-900 leading-tight">{lead.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">{lead.city}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-500">{lead.product}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-400">{lead.time}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-wider uppercase border inline-block whitespace-nowrap ${lead.stageClass}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-800 tracking-tight text-xs">{lead.deal}</td>
                    <td className="py-3.5 px-4 text-blue-605 font-extrabold">{lead.nextAction}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black text-[10px] uppercase ${lead.date === 'Today' ? 'text-red-500' : 'text-slate-400'}`}>
                        {lead.date}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{lead.agent}</td>
                    <td className="py-3.5 px-2 text-center text-slate-400 font-bold cursor-pointer hover:text-slate-600 text-sm">
                      ⋮
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Opportunities Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">Top Opportunities</h4>
            <span onClick={() => triggerToast("Loading Deal Pipelines View Board...")} className="text-[10px] font-black uppercase text-blue-600 hover:underline cursor-pointer select-none">
              View All →
            </span>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-3 bg-slate-50 hover:bg-slate-105 border border-slate-150 rounded-xl transition flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-extrabold text-[12px] text-[#1a202c] leading-tight">{opp.name}</div>
                  <span className="text-[9.5px] text-slate-400 font-bold block max-w-[150px] truncate mt-0.5">{opp.product}</span>
                  <span className="text-[11px] font-mono text-slate-800 font-extrabold block mt-2">{opp.val}</span>
                </div>
                {/* Circular success rate progress ring */}
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0 select-none">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="16" className="stroke-slate-100" strokeWidth="2.5" fill="transparent" />
                    <circle cx="20" cy="20" r="16" className={opp.color} strokeWidth="2.5" fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - opp.progress / 100)} />
                  </svg>
                  <span className="absolute text-[8.5px] font-black text-slate-850">{opp.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex gap-3.5 items-start mt-3 select-none">
            <span className="text-xl">🎯</span>
            <div className="space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <p className="font-bold">Focus on hot opportunities to boost your monthly closures.</p>
              <span onClick={() => triggerToast("Launching Deal Pipeline flow.")} className="text-[10px] font-black uppercase text-blue-600 hover:underline inline-block mt-1 cursor-pointer">
                View Pipeline →
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStandardTableView = () => {
    return (
      <>
        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white border border-slate-200/60 rounded-2xl shadow-2xs space-y-3.5 mt-5">
            <div className="w-16 h-16 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center text-rose-500 font-extrabold text-xl animate-bounce">☕</div>
            <p className="text-slate-500 font-black tracking-wide text-xs uppercase text-center">No Leads Matching Search Filters</p>
            <p className="text-slate-400 font-bold text-[10px] text-center">Adjust selectors or create a new custom record in seconds.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                  <th className="py-3 px-4 w-8 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5" defaultChecked readOnly />
                  </th>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-[28%]">Business / Firm / Client</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Phone Number</th>
                  {activeLeadSubTab === 'website' ? (
                    <>
                      <th className="py-3 px-4">Website Status</th>
                      <th className="py-3 px-4">Suggested Plan</th>
                      <th className="py-3 px-4">Package Offered</th>
                    </>
                  ) : activeLeadSubTab === 'social' ? (
                    <>
                      <th className="py-3 px-4">Platform API</th>
                      <th className="py-3 px-4">Message Inquiry</th>
                      <th className="py-3 px-4 font-normal text-slate-400">Interested Product</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Products Interested</th>
                      <th className="py-3 px-4">Lead Source</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  {(activeLeadSubTab === 'website' || activeLeadSubTab === 'social') && (
                    <th className="py-3 px-4 font-normal text-slate-400">Client Response</th>
                  )}
                  <th className="py-3 px-4">Assigned To</th>
                  {(activeLeadSubTab === 'website' || activeLeadSubTab === 'social') && (
                    <th className="py-3 px-4">Remarks</th>
                  )}
                  <th className="py-3 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105 text-xs text-slate-700">
                {filteredList.map((lead, idx) => (
                  <tr key={lead.id} className="hover:bg-slate-50/10 border-slate-150">
                    <td className="py-3.5 px-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer" />
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                    
                    {/* Business Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex gap-3">
                        <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold shrink-0 shadow-2xs select-none">
                          {lead.businessName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-[12.5px] text-[#1a202c] leading-tight">{lead.businessName}</span>
                            {lead.leadPriority === 'Hot' && (
                              <span className="inline-flex items-center text-[8px] font-black uppercase text-rose-500 bg-rose-50 px-1 rounded animate-pulse scale-90">🔥 HOT</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold block mt-1">{lead.city}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-700 leading-snug">{lead.contactPerson || 'Unknown'}</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5">{lead.contactRole || 'Owner'}</span>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap md:flex-nowrap">
                        <span className="font-mono text-slate-800 font-bold text-xs tracking-tight">{lead.phone}</span>
                        <span onClick={() => { triggerToast(`Connecting WhatsApp api for ${lead.contactPerson}.`); }} className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded px-1.5 font-black uppercase tracking-wider text-[8px] cursor-pointer hover:bg-emerald-600 hover:text-white transition scale-90 select-none">💬 WhatsApp</span>
                      </div>
                    </td>

                    {/* Dynamic Columns based on activeLeadSubTab */}
                    {activeLeadSubTab === 'website' ? (
                      <>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border inline-block whitespace-nowrap ${
                            lead.websiteStatus === 'No Website' ? 'bg-red-50 text-red-650 border-red-200' :
                            lead.websiteStatus === 'Old Website' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            lead.websiteStatus === 'Needs Redesign' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                            lead.websiteStatus === 'Business Website' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}>
                            {lead.websiteStatus || 'No Website'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-500 font-bold" title={lead.suggestedPitch}>
                          {lead.suggestedPitch || 'Pitch starter package.'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md text-[10px] font-black inline-block whitespace-nowrap">
                            {lead.packageOffered || '-'}
                          </span>
                        </td>
                      </>
                    ) : activeLeadSubTab === 'social' ? (
                      <>
                        <td className="py-3.5 px-4 mt-0.5">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border inline-block whitespace-nowrap ${
                            lead.platform === 'Facebook' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            lead.platform === 'Instagram' ? 'bg-pink-50 text-pink-650 border-pink-200' :
                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}>
                            {lead.platform || lead.leadSource || 'Social API'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs truncate text-[10px] text-slate-500 font-bold" title={lead.remarks}>
                          {lead.remarks || 'Inquired through direct channel.'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-black inline-block whitespace-nowrap">
                            {lead.productsInterestedText || 'POS / Billing System'}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4 col-span-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                            lead.category === 'Hospitality' ? 'bg-blue-50 text-blue-600 border-blue-150' :
                            lead.category === 'Trading' ? 'bg-indigo-50 text-indigo-600 border-indigo-150' :
                            lead.category === 'Education' ? 'bg-amber-50 text-amber-600 border-amber-150' :
                            lead.category === 'Agriculture' ? 'bg-emerald-50 text-emerald-600 border-emerald-150' :
                            lead.category === 'NGO' ? 'bg-purple-50 text-purple-650 border-purple-150' :
                            lead.category === 'Healthcare' ? 'bg-pink-50 text-pink-600 border-pink-150' :
                            lead.category === 'Retail' ? 'bg-teal-50 text-teal-600 border-teal-150' :
                            lead.category === 'Construction' ? 'bg-lime-50 text-lime-650 border-lime-150' :
                            lead.category === 'IT Services' ? 'bg-sky-50 text-sky-605 border-sky-150' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {lead.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-500">
                          {lead.productsInterestedText || 'POS / Billing Software'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[11px] inline-flex items-center gap-1.5 font-semibold text-slate-705">
                            {lead.leadSource === 'Website' && <span className="text-xs">🌐</span>}
                            {lead.leadSource === 'Facebook' && <span className="text-xs">📱</span>}
                            {lead.leadSource === 'Referral' && <span className="text-xs">🤝</span>}
                            {lead.leadSource === 'Google Maps' && <span className="text-xs">📍</span>}
                            {lead.leadSource === 'Instagram' && <span className="text-xs">📸</span>}
                            <span>{lead.leadSource}</span>
                          </span>
                        </td>
                      </>
                    )}

                    {/* Lead Priority */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase border inline-block ${
                        lead.leadPriority === 'Hot' ? 'bg-red-50 text-red-655 border-red-200 font-extrabold' :
                        lead.leadPriority === 'Warm' ? 'bg-amber-50 text-amber-600 border-amber-200 font-extrabold' :
                        'bg-slate-50 text-slate-505 border-slate-205 font-bold'
                      }`}>
                        {lead.leadPriority === 'Hot' ? '🔥 Hot' : lead.leadPriority === 'Warm' ? '⚡ Warm' : '❄️ Cold'}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-3.5 px-4 col-span-1">
                      <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-widest uppercase border inline-block whitespace-nowrap ${
                        lead.followUpStatus === 'Client Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        lead.followUpStatus === 'Follow-up Required' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        lead.followUpStatus === 'Demo Scheduled' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                        lead.followUpStatus === 'Proposal Sent' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        lead.followUpStatus === 'Call Attempted' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                        'bg-rose-50 text-rose-600 border-rose-250'
                      }`}>
                        {lead.followUpStatus}
                      </span>
                    </td>

                    {/* Next Follow-up Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-slate-800 tracking-tight font-extrabold text-[12px] leading-tight">
                          {lead.nextFollowUpDate || '-'}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-wider block mt-1 ${
                          lead.followUpDelayText === 'Today' ? 'text-red-500 animate-pulse' :
                          lead.followUpDelayText?.includes('Delay') ? 'text-rose-600 font-extrabold' :
                          'text-slate-400 font-bold'
                        }`}>
                          {lead.followUpDelayText || 'Flexible'}
                        </span>
                      </div>
                    </td>

                    {/* Client Response */}
                    {(activeLeadSubTab === 'website' || activeLeadSubTab === 'social') && (
                      <td className="py-3.5 px-4 font-bold text-[#b91c1c] max-w-[130px] truncate" title={lead.clientResponse || ''}>
                        {lead.clientResponse || '-'}
                      </td>
                    )}

                    {/* Assigned To */}
                    <td className="py-3.5 px-4 font-bold text-slate-655">
                      <span>{lead.assignedTo || 'Unassigned'}</span>
                    </td>

                    {/* Remarks */}
                    {(activeLeadSubTab === 'website' || activeLeadSubTab === 'social') && (
                      <td className="py-3.5 px-4 max-w-[160px] truncate text-slate-400 font-medium" title={lead.remarks || ''}>
                        {lead.remarks || '-'}
                      </td>
                    )}

                    {/* Row operations */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-sans">
                        <button 
                          onClick={() => { setCallLead(lead); setCallNotes(''); }}
                          className="p-1 px-2 border border-slate-200 hover:border-emerald-300 rounded-lg bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 font-black text-[10px] shadow-2xs transition cursor-pointer whitespace-nowrap select-none"
                          title="Simulate Outbound Business Call"
                        >
                          ☎ Dial
                        </button>

                        <button 
                          onClick={() => { setSelectedLead(lead); setIsEditDrawerOpen(true); }}
                          className="p-1 text-slate-400 hover:text-blue-655 rounded-lg hover:bg-slate-100 transition border border-slate-200 font-sans cursor-pointer select-none shrink-0"
                          title="Edit Lead Log"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          onClick={() => {
                            if(confirm(`Are you sure you want to delete lead ${lead.businessName}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          className="p-1 text-slate-405 hover:text-red-655 rounded-lg hover:bg-rose-50 transition border border-slate-200 font-sans cursor-pointer select-none shrink-0"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden select-none bg-slate-50 font-sans">
      
      {/* Counters layout (exactly matching the All Leads KPI summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-5 shrink-0 bg-slate-50 border-b border-slate-200/40">
        {kpiCards.map((card) => {
          const CardIcon = card.icon;
          return (
            <div key={card.title} className="bg-white p-4.5 rounded-2xl border border-slate-200/50 shadow-xs flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 w-12 h-12 bg-blue-500/5 rounded-full blur-lg" />
              <div className={`p-3 rounded-xl transition cursor-default ${card.iconBg}`}>
                {CardIcon ? <CardIcon className="w-5 h-5 shrink-0" /> : <span className="font-extrabold text-sm w-5 h-5 flex items-center justify-center font-sans">₹</span>}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block whitespace-nowrap">{card.title}</span>
                <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">{card.value}</h3>
                <span className={`text-[9px] block mt-0.5 whitespace-nowrap ${card.changeColor}`}>
                  {card.change} {card.changeSub && <span className="text-slate-400 font-medium font-sans">{card.changeSub}</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Action Buttons for All Leads Page as requested */}
      {(activeLeadSubTab === 'all' || activeLeadSubTab === 'website' || activeLeadSubTab === 'software' || activeLeadSubTab === 'social' || activeLeadSubTab === 'hot' || activeLeadSubTab === 'due' || activeLeadSubTab === 'duplicates') && (
        <div className="mx-5 mt-4 bg-white p-4.5 rounded-2xl border border-slate-200/50 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 select-none">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Quick Create Presets
              </h4>
              <p className="text-[10px] uppercase font-black text-slate-400 mt-1 select-none">Launch add-lead modals pre-filled with matching context parameters and prefixes</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={() => {
                  setFormIdPrefix('W');
                  setNewLeadForm({
                    businessName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    websiteStatus: 'No Website',
                    suggestedPitch: 'Wants immediate local online search visibility. Pitch SEO-optimized business starter landing page package.',
                    packageOffered: 'Starter Website\n(NPR 9,999)',
                    leadPriority: 'Warm',
                    followUpStatus: 'Follow-up Required',
                    nextFollowUpDate: new Date().toISOString().split('T')[0],
                    clientResponse: 'Interested',
                    assignedTo: currentUser.name,
                    remarks: 'Website lead generated from workspace action toolbar',
                    category: 'Hospitality',
                    leadSource: 'Website Form'
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white hover:bg-blue-50/55 hover:text-blue-700 hover:border-blue-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                <span>+ Website Lead</span>
              </button>

              <button 
                onClick={() => {
                  setFormIdPrefix('S');
                  setNewLeadForm({
                    businessName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    websiteStatus: 'Business Website',
                    suggestedPitch: 'Pitch Nagarik Software tailored solutions to increase business operations conversion.',
                    packageOffered: 'School Software',
                    leadPriority: 'Warm',
                    followUpStatus: 'Follow-up Required',
                    nextFollowUpDate: new Date().toISOString().split('T')[0],
                    clientResponse: 'Interested',
                    assignedTo: currentUser.name,
                    remarks: 'Software lead generated from workspace action toolbar',
                    category: 'Education',
                    leadSource: 'Walk-in'
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white hover:bg-purple-50/55 hover:text-purple-700 hover:border-purple-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Plus className="w-3.5 h-3.5 text-purple-600 stroke-[2.5]" />
                <span>+ Software Lead</span>
              </button>

              <button 
                onClick={() => {
                  setFormIdPrefix('SM');
                  setNewLeadForm({
                    businessName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    websiteStatus: 'No Website',
                    suggestedPitch: 'Manage modern multi-platform chat, auto reply, with integrations.',
                    packageOffered: 'Social Media Setup',
                    leadPriority: 'Warm',
                    followUpStatus: 'Follow-up Required',
                    nextFollowUpDate: new Date().toISOString().split('T')[0],
                    clientResponse: 'Interested',
                    assignedTo: currentUser.name,
                    remarks: 'Social media lead generated from workspace action toolbar',
                    category: 'Trading',
                    leadSource: 'Facebook',
                    platform: 'Facebook'
                  } as any);
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50/55 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>+ Social Media Lead</span>
              </button>

              <button 
                onClick={() => {
                  setFormIdPrefix('L');
                  setNewLeadForm({
                    businessName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    websiteStatus: 'No Website',
                    suggestedPitch: '',
                    packageOffered: '',
                    leadPriority: 'Hot',
                    followUpStatus: 'Follow-up Required',
                    nextFollowUpDate: new Date().toISOString().split('T')[0],
                    clientResponse: 'Interested',
                    assignedTo: currentUser.name,
                    remarks: 'Hot Lead generated from workspace action toolbar',
                    category: 'Trading',
                    leadSource: 'Referral'
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white hover:bg-orange-50/55 hover:text-orange-700 hover:border-orange-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Plus className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
                <span>+ Hot Lead</span>
              </button>

              <button 
                onClick={() => {
                  setFormIdPrefix('L');
                  setNewLeadForm({
                    businessName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    websiteStatus: 'No Website',
                    suggestedPitch: '',
                    packageOffered: '',
                    leadPriority: 'Warm',
                    followUpStatus: 'Follow-up Required',
                    nextFollowUpDate: new Date().toISOString().split('T')[0],
                    clientResponse: 'Interested',
                    assignedTo: currentUser.name,
                    remarks: 'Follow-up due lead generated from workspace action toolbar',
                    category: 'Hospitality',
                    leadSource: 'Google Maps'
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white hover:bg-indigo-50/55 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                <span>+ Follow-up Due</span>
              </button>

              <button 
                onClick={() => {
                  setFormIdPrefix('L');
                  setNewLeadForm({
                    businessName: 'Himalayan Coffee House',
                    contactPerson: 'Nirajan Shrestha',
                    phone: '9851122334',
                    email: 'nirajan@himalayancoffee.com',
                    websiteStatus: 'No Website',
                    suggestedPitch: '',
                    packageOffered: '',
                    leadPriority: 'Warm',
                    followUpStatus: 'Follow-up Required',
                    nextFollowUpDate: new Date().toISOString().split('T')[0],
                    clientResponse: 'Interested',
                    assignedTo: currentUser.name,
                    remarks: 'Duplicate details to simulate deduplication warnings and system merge mechanisms',
                    category: 'Hospitality',
                    leadSource: 'Website Form'
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white hover:bg-rose-50/55 hover:text-rose-700 hover:border-rose-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Plus className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                <span>+ Duplicate Lead</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Filter Controls Bar (Screenshot 1 top styling) */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Main search bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by business name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 rounded-lg outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Business Category Dropdown */}
          <div className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 shadow-2xs">
            <span>Category</span>
            <span className="text-slate-300 font-normal">|</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border-none bg-transparent font-extrabold text-slate-800 outline-none pr-1 text-xs cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Trading">Trading</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="NGO">NGO</option>
              <option value="IT Services">IT Services</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          {activeLeadSubTab === 'website' ? (
            <>
              {/* Website Status Dropdown */}
              <div className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 shadow-2xs">
                <span>Website Status</span>
                <span className="text-slate-300 font-normal">|</span>
                <select
                  value={websiteStatusFilter}
                  onChange={(e) => setWebsiteStatusFilter(e.target.value)}
                  className="border-none bg-transparent font-extrabold text-slate-800 outline-none pr-1 text-xs cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="No Website">No Website</option>
                  <option value="Old Website">Old Website</option>
                  <option value="Needs Redesign">Needs Redesign</option>
                  <option value="Business Website">Business Website</option>
                  <option value="Ecommerce Website">Ecommerce Website</option>
                </select>
              </div>

              {/* Package Offered Dropdown */}
              <div className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 shadow-2xs">
                <span>Package</span>
                <span className="text-slate-300 font-normal">|</span>
                <select
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                  className="border-none bg-transparent font-extrabold text-slate-800 outline-none pr-1 text-xs cursor-pointer"
                >
                  <option value="">All Packages</option>
                  <option value="Starter Website">Starter Website</option>
                  <option value="Business Website">Business Website</option>
                  <option value="Ecommerce Website">Ecommerce Website</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Product Filter Button */}
              <div className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 shadow-2xs">
                <span>Product</span>
                <span className="text-slate-300 font-normal">|</span>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="border-none bg-transparent font-extrabold text-slate-800 outline-none pr-1 text-xs cursor-pointer"
                >
                  <option value="">All Products</option>
                  <option value="POS">POS System</option>
                  <option value="Billing">Billing Software</option>
                  <option value="Inventory">Inventory Software</option>
                  <option value="School">School Software</option>
                  <option value="Donor">Donor Management</option>
                  <option value="Clinic">Clinic Management</option>
                </select>
              </div>
            </>
          )}

          {/* Lead priority filter */}
          <div className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 shadow-2xs">
            <span>Priority</span>
            <span className="text-slate-300 font-normal">|</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border-none bg-transparent font-extrabold text-slate-800 outline-none pr-1 text-xs cursor-pointer"
            >
              <option value="">All Priority</option>
              <option value="Hot">🔥 Hot</option>
              <option value="Warm">⚡ Warm</option>
              <option value="Cold">❄️ Cold</option>
            </select>
          </div>

          {/* Lead Source Filter Button */}
          <div className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 shadow-2xs">
            <span>Source</span>
            <span className="text-slate-300 font-normal">|</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="border-none bg-transparent font-extrabold text-slate-800 outline-none pr-1 text-xs cursor-pointer"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Google Maps">Google Maps</option>
              <option value="Facebook">Facebook</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>

          {/* Assigned To filter */}
          <div className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 shadow-2xs">
            <span>Assigned</span>
            <span className="text-slate-300 font-normal">|</span>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="border-none bg-transparent font-extrabold text-slate-800 outline-none pr-1 text-xs cursor-pointer"
            >
              <option value="">All Assigned</option>
              {mockUsers.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Next Follow-up Select Button */}
          <button className="flex items-center bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold text-slate-500 gap-1.5 hover:bg-slate-50 transition cursor-pointer select-none">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Select date</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Action icons row (Export, Columns, Filter badge, reset) */}
        <div className="flex items-center gap-2">
          {/* Dynamic Prominent Add Lead button for each subtab page */}
          <button 
            id="btn-dynamic-add-lead"
            onClick={() => {
              setFormIdPrefix(
                activeLeadSubTab === 'website' ? 'W' : 
                activeLeadSubTab === 'software' ? 'S' : 
                activeLeadSubTab === 'social' ? 'SM' : 
                'L'
              );
              setNewLeadForm({
                businessName: '',
                contactPerson: '',
                phone: '',
                email: '',
                websiteStatus: activeLeadSubTab === 'website' ? 'No Website' : 'Business Website',
                suggestedPitch: activeLeadSubTab === 'website' ? 'SEO-optimized landing page' : activeLeadSubTab === 'social' ? 'Social multi-channel chat' : '',
                packageOffered: activeLeadSubTab === 'website' ? 'Starter Website\n(NPR 9,999)' : '',
                leadPriority: (activeLeadSubTab === 'hot' || activeLeadSubTab === 'due') ? 'Hot' : 'Warm',
                followUpStatus: activeLeadSubTab === 'due' ? 'Follow-up Required' : 'Not Contacted',
                nextFollowUpDate: new Date().toISOString().split('T')[0],
                clientResponse: 'Interested',
                assignedTo: currentUser.name,
                remarks: `Created manually from ${activeLeadSubTab} tab.`,
                category: activeLeadSubTab === 'software' ? 'Education' : activeLeadSubTab === 'website' ? 'Hospitality' : 'Trading',
                leadSource: activeLeadSubTab === 'social' ? 'Facebook' : 'Website'
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-lg cursor-pointer transition shadow-2xs mr-1"
          >
            <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span>+ Add {
              activeLeadSubTab === 'all' ? 'Lead' : 
              activeLeadSubTab === 'website' ? 'Website Lead' : 
              activeLeadSubTab === 'software' ? 'Software Lead' : 
              activeLeadSubTab === 'social' ? 'Social Lead' : 
              activeLeadSubTab === 'hot' ? 'Hot Lead' : 
              activeLeadSubTab === 'due' ? 'Due Lead' : 
              'Duplicate Entry'
            }</span>
          </button>

          {/* Export utility */}
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Custom columns */}
          <button 
            onClick={() => triggerToast("Toggle table standard layout column presets.")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition lg:inline-flex hidden"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
            <span>Columns</span>
          </button>

          {/* Active Filter Indicators */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff6ff] border border-[#bfdbfe] text-blue-700 text-xs font-extrabold rounded-lg hover:bg-blue-100 transition select-none">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters</span>
            <span className="bg-blue-600 text-white rounded-full text-[9px] w-4.5 h-4.5 inline-flex items-center justify-center font-black animate-pulse">2</span>
          </button>

          {/* More Filters */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition lg:inline-flex hidden">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>More Filters</span>
          </button>

          {/* Reset Filters */}
          <button 
            onClick={() => {
              setCategoryFilter('');
              setPriorityFilter('');
              setOwnerFilter('');
              setSourceFilter('');
              setProductFilter('');
              setWebsiteStatusFilter('');
              setPackageFilter('');
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-extrabold rounded-lg cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Table view of current Sub-tab leads */}
      <div className="flex-1 overflow-auto p-5">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center h-full">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-md font-bold text-slate-700">No matching leads found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">Try widening your search queries, selecting another Persona, or removing active filter dropdowns.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden min-w-[1240px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/85 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-250/35">
                  <th className="py-3 px-4 w-8 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" defaultChecked readOnly />
                  </th>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Business Name & Address</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4 animate-fade-in">Phone Number</th>
                  {activeLeadSubTab === 'website' ? (
                    <>
                      <th className="py-3 px-4">Website Status</th>
                      <th className="py-3 px-4">Suggested Pitch</th>
                      <th className="py-3 px-4">Package Offered</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Products Interested</th>
                      <th className="py-3 px-4">Lead Source</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-center">Lead Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  {activeLeadSubTab === 'website' && (
                    <th className="py-3 px-4">Client Response</th>
                  )}
                  <th className="py-3 px-4">Assigned To</th>
                  {activeLeadSubTab === 'website' && (
                    <th className="py-3 px-4">Remarks</th>
                  )}
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredList.map((lead, index) => (
                  <tr 
                    key={lead.id} 
                    className={`hover:bg-blue-50/15 transition border-slate-150 ${
                      lead.leadPriority === 'Hot' ? 'bg-rose-50/10' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer" />
                    </td>

                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                      {index + 1}
                    </td>

                    {/* Business Name & Address */}
                    <td className="py-3.5 px-4 col-span-1">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => { setSelectedLead(lead); setIsEditDrawerOpen(true); }}
                          className="font-black text-[13px] text-slate-900 hover:text-blue-600 transition cursor-pointer leading-tight"
                        >
                          {lead.businessName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">
                          {lead.city || 'Kathmandu, Bagmati'}
                        </span>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-4 text-slate-800">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[#1a202c] text-xs">{lead.contactPerson}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                          {lead.contactRole || 'Manager'}
                        </span>
                      </div>
                    </td>

                    {/* Phone Number with WhatsApp Outbound trigger */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 font-extrabold text-xs tracking-tight">{lead.phone}</span>
                        <button 
                          onClick={() => {
                            const outreachText = `Namaste ${lead.contactPerson}, this is ${currentUser.name} from Nagarik Solution regarding your system inquiry. We can configure a quick online demo walkthrough. Let us know your convenient slot.`;
                            openWhatsAppSimulate(lead, outreachText);
                          }}
                          className="w-5.5 h-5.5 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center cursor-pointer hover:bg-emerald-500 hover:text-white hover:border-emerald-500 select-none transition"
                          title="Contact via WhatsApp Gateway"
                        >
                          <span className="text-[11px] font-sans">💬</span>
                        </button>
                      </div>
                    </td>

                    {/* Dynamic Columns based on activeLeadSubTab */}
                    {activeLeadSubTab === 'website' ? (
                      <>
                        {/* Website Status */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border inline-block whitespace-nowrap ${
                            lead.websiteStatus === 'No Website' ? 'bg-red-50 text-red-600 border-red-200 text-red-600' :
                            lead.websiteStatus === 'Old Website' ? 'bg-amber-50 text-amber-600 border-amber-200 text-amber-600' :
                            lead.websiteStatus === 'Needs Redesign' ? 'bg-orange-50 text-orange-600 border-orange-200 text-orange-600' :
                            lead.websiteStatus === 'Business Website' ? 'bg-blue-50 text-blue-600 border-blue-200 text-blue-600' :
                            'bg-emerald-50 text-emerald-600 border-emerald-200 text-emerald-600'
                          }`}>
                            {lead.websiteStatus || 'No Website'}
                          </span>
                        </td>

                        {/* Suggested Pitch */}
                        <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-500 font-bold" title={lead.suggestedPitch}>
                          {lead.suggestedPitch || 'Pitch starter package.'}
                        </td>

                        {/* Package Offered */}
                        <td className="py-3.5 px-4">
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md text-[10px] font-black inline-block whitespace-nowrap">
                            {lead.packageOffered || '-'}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Category Pill */}
                        <td className="py-3.5 px-4 col-span-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                            lead.category === 'Hospitality' ? 'bg-blue-50 text-blue-605 border-blue-250/20 text-blue-600' :
                            lead.category === 'Trading' ? 'bg-indigo-50 text-indigo-605 border-indigo-250/20 text-indigo-600' :
                            lead.category === 'Education' ? 'bg-amber-50 text-amber-655 border-amber-250/20 text-amber-600' :
                            lead.category === 'Agriculture' ? 'bg-emerald-50 text-emerald-600 border-emerald-250/20' :
                            lead.category === 'NGO' ? 'bg-purple-50 text-purple-655 border-purple-250/20 text-purple-600' :
                            lead.category === 'Healthcare' ? 'bg-pink-50 text-pink-655 border-pink-250/20 text-pink-600' :
                            lead.category === 'Retail' ? 'bg-teal-50 text-teal-655 border-teal-250/20 text-teal-600' :
                            lead.category === 'Construction' ? 'bg-lime-50 text-lime-705 border-lime-250/20 text-lime-605' :
                            lead.category === 'IT Services' ? 'bg-sky-50 text-sky-655 border-sky-250/20 text-sky-600' :
                            'bg-slate-50 text-slate-505 border-slate-200 text-slate-500'
                          }`}>
                            {lead.category}
                          </span>
                        </td>

                        {/* Products Interested */}
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-black inline-block whitespace-nowrap">
                            {lead.productsInterestedText || 'POS, Billing Software'}
                          </span>
                        </td>

                        {/* Lead Source */}
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">
                          <span className="text-[11px] inline-flex items-center gap-1">
                            {lead.leadSource === 'Website' && <span className="text-xs">🌐</span>}
                            {lead.leadSource === 'Facebook' && <span className="text-xs">📱</span>}
                            {lead.leadSource === 'Referral' && <span className="text-xs">🤝</span>}
                            {lead.leadSource === 'Google Maps' && <span className="text-xs">📍</span>}
                            {lead.leadSource === 'Instagram' && <span className="text-xs">📸</span>}
                            <span>{lead.leadSource}</span>
                          </span>
                        </td>
                      </>
                    )}

                    {/* Lead Priority with flame */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 border ${
                        lead.leadPriority === 'Hot' ? 'bg-red-50 text-red-655 border-red-200 text-red-650' :
                        lead.leadPriority === 'Warm' ? 'bg-amber-50 text-amber-655 border-amber-200 text-amber-650' :
                        'bg-slate-105 text-slate-505 border-slate-200 text-slate-500 bg-slate-50'
                      }`}>
                        {lead.leadPriority === 'Hot' && <Flame className="w-2.5 h-2.5 shrink-0 fill-red-500 text-red-500 animate-pulse" />}
                        <span>{lead.leadPriority}</span>
                      </span>
                    </td>

                    {/* Follow up status (exactly matching status pill options) */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black tracking-wide border inline-block whitespace-nowrap ${
                        lead.followUpStatus === 'Interested' ? 'bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]' :
                        lead.followUpStatus === 'Demo Scheduled' ? 'bg-purple-100/70 text-purple-700 border-purple-200' :
                        lead.followUpStatus === 'Negotiation' ? 'bg-rose-100/60 text-pink-700 border-rose-250/40 text-pink-650' :
                        lead.followUpStatus === 'Proposal Sent' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        lead.followUpStatus === 'Follow-up Required' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                        lead.followUpStatus === 'Call Attempted' ? 'bg-indigo-50 text-indigo-700 border-indigo-250/50' :
                        lead.followUpStatus === 'Not Interested' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {lead.followUpStatus}
                      </span>
                    </td>

                    {/* Next Follow-up Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-slate-800 font-extrabold text-[11px] tracking-tight leading-none">{lead.nextFollowUpDate}</span>
                        {lead.followUpDelayText && (
                          <span className={`text-[10px] font-black mt-1.5 ${
                            lead.followUpDelayText === 'Today' || lead.followUpDelayText === 'Tomorrow' ? 'text-red-500' : 'text-slate-400 font-extrabold'
                          }`}>{lead.followUpDelayText}</span>
                        )}
                      </div>
                    </td>

                    {/* Client Response */}
                    {activeLeadSubTab === 'website' && (
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wide border inline-block whitespace-nowrap ${
                          lead.clientResponse === 'Very Interested' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' :
                          lead.clientResponse === 'Interested' ? 'bg-emerald-50 text-emerald-750 border-emerald-200 text-emerald-700' :
                          lead.clientResponse === 'Under Review' ? 'bg-purple-50 text-purple-750 border-purple-200 text-purple-705' :
                          lead.clientResponse === 'Call Back Later' ? 'bg-amber-50 text-amber-750 border-amber-200 text-amber-705' :
                          lead.clientResponse === 'No Response' ? 'bg-rose-50 text-red-655 border-red-200' :
                          lead.clientResponse === 'Not Yet Contacted' ? 'bg-indigo-50 text-indigo-705 border-indigo-200 text-indigo-600 font-extrabold' :
                          'bg-slate-100 text-slate-500 border-slate-200 bg-slate-50'
                        }`}>
                          {lead.clientResponse || 'Not Contacted'}
                        </span>
                      </td>
                    )}

                    {/* Agent Assigned */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5.5 h-5.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[9px] uppercase border border-blue-200 shadow-xs shrink-0 overflow-hidden">
                          {mockUsers.find(u => u.name === lead.assignedTo)?.avatar ? (
                            <img src={mockUsers.find(u => u.name === lead.assignedTo)?.avatar} alt={lead.assignedTo} className="w-full h-full object-cover" />
                          ) : (
                            lead.assignedTo.slice(0, 2)
                          )}
                        </div>
                        <span className="font-extrabold text-slate-700 text-xs whitespace-nowrap">{lead.assignedTo}</span>
                      </div>
                    </td>

                    {/* Remarks */}
                    {activeLeadSubTab === 'website' && (
                      <td className="py-3.5 px-4 max-w-[180px] truncate text-[11px] text-slate-500 font-semibold" title={lead.remarks}>
                        {lead.remarks || '-'}
                      </td>
                    )}

                    {/* Row operations button/icons */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Dial log simulator */}
                        <button 
                          onClick={() => { setCallLead(lead); setCallNotes(''); }}
                          className="p-1 px-2 border border-slate-200 hover:border-emerald-300 rounded-lg bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 font-bold text-[10px] font-sans shadow-2xs transition cursor-pointer whitespace-nowrap select-none"
                          title="Simulate Call"
                        >
                          ☎ Dial
                        </button>

                        <button 
                          onClick={() => { setSelectedLead(lead); setIsEditDrawerOpen(true); }}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition border border-slate-200/40 cursor-pointer select-none"
                          title="Edit Detailed Logs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          onClick={() => {
                            if(confirm(`Are you sure you want to delete lead ${lead.businessName}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-rose-50 transition border border-slate-200/40 cursor-pointer select-none"
                          title="Delete Lead Permanent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Edit Details Drawer panel */}
      {isEditDrawerOpen && selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-[500px] h-full bg-white shadow-2xl flex flex-col animate-slide-left p-6 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">{selectedLead.id}</span>
                <h3 className="text-md font-extrabold text-slate-800 mt-1">Lead Details Edit Screen</h3>
              </div>
              <button 
                onClick={() => { setIsEditDrawerOpen(false); setSelectedLead(null); }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold font-mono hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSave} className="space-y-4 flex-1">
              {/* Business details */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Company / Business Name</label>
                <input 
                  type="text" 
                  value={selectedLead.businessName}
                  onChange={(e) => setSelectedLead({ ...selectedLead, businessName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Primary Contact Person</label>
                <input 
                  type="text" 
                  value={selectedLead.contactPerson}
                  onChange={(e) => setSelectedLead({ ...selectedLead, contactPerson: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* Contact numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={selectedLead.phone}
                    onChange={(e) => setSelectedLead({ ...selectedLead, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 font-mono focus:bg-white focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Email Domain</label>
                  <input 
                    type="email" 
                    value={selectedLead.email || ''}
                    onChange={(e) => setSelectedLead({ ...selectedLead, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Priorities & assigned agents */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Priority Metric</label>
                  <select 
                    value={selectedLead.leadPriority}
                    onChange={(e) => setSelectedLead({ ...selectedLead, leadPriority: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
                  >
                    <option value="Hot">🔥 Hot</option>
                    <option value="Warm">⚡ Warm</option>
                    <option value="Cold">❄️ Cold</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Owner Assigned</label>
                  <select 
                    value={selectedLead.assignedTo}
                    onChange={(e) => setSelectedLead({ ...selectedLead, assignedTo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
                  >
                    {mockUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional parameters based on Leads Source type */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-4">
                <span className="text-[10px] font-black text-slate-400 block tracking-widest uppercase mb-1">Source Specific Parameters</span>
                
                {selectedLead.id.startsWith('W-') ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Website Status Analysis</label>
                        <select 
                          value={selectedLead.websiteStatus || 'No Website'}
                          onChange={(e) => {
                            const pitch = getAutoSuggestedPitch(e.target.value);
                            setSelectedLead({ 
                              ...selectedLead, 
                              websiteStatus: e.target.value as any,
                              suggestedPitch: pitch 
                            });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs"
                        >
                          <option value="No Website">No Website</option>
                          <option value="Old Website">Old Website</option>
                          <option value="Needs Redesign">Needs Redesign</option>
                          <option value="Business Website">Business Website</option>
                          <option value="Ecommerce Website">Ecommerce Website</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Package Offered</label>
                        <select 
                          value={selectedLead.packageOffered || '-'}
                          onChange={(e) => setSelectedLead({ ...selectedLead, packageOffered: e.target.value })}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs"
                        >
                          <option value="-">- Not Selected -</option>
                          <option value="Bronze Package (Rs. 15,000)">Bronze Package (Rs. 15,000)</option>
                          <option value="Silver Package (Rs. 25,000)">Silver Package (Rs. 25,000)</option>
                          <option value="Gold Package (Rs. 40,000)">Gold Package (Rs. 40,000)</option>
                          <option value="Custom Portal (Rs. 60,000+)">Custom Portal (Rs. 60,000+)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Client Response Status</label>
                      <select 
                        value={selectedLead.clientResponse || 'Not Yet Contacted'}
                        onChange={(e) => setSelectedLead({ ...selectedLead, clientResponse: e.target.value as any })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs"
                      >
                        <option value="Not Yet Contacted">Not Yet Contacted</option>
                        <option value="Very Interested">Very Interested</option>
                        <option value="Interested">Interested</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Call Back Later">Call Back Later</option>
                        <option value="No Response">No Response</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Auto Pitch Suggested (AI Powered)</label>
                      <textarea 
                        value={selectedLead.suggestedPitch || ''}
                        disabled
                        className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold h-20 outline-none select-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Interested Software Product</label>
                        <input 
                          type="text" 
                          value={selectedLead.productInterest || ''}
                          onChange={(e) => setSelectedLead({ ...selectedLead, productInterest: e.target.value })}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Deal Value (Rs.)</label>
                        <input 
                          type="number" 
                          value={selectedLead.dealValue || 0}
                          onChange={(e) => setSelectedLead({ ...selectedLead, dealValue: Number(e.target.value) })}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Status and dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Next Follow-up Date</label>
                  <input 
                    type="date" 
                    value={selectedLead.nextFollowUpDate}
                    onChange={(e) => setSelectedLead({ ...selectedLead, nextFollowUpDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 tracking-wide outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Follow-up Action</label>
                  <select 
                    value={selectedLead.followUpStatus}
                    onChange={(e) => setSelectedLead({ ...selectedLead, followUpStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                  >
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Interested">Interested</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Remarks logs */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Remarks & Call History logs</label>
                <textarea 
                  value={selectedLead.remarks || ''}
                  onChange={(e) => setSelectedLead({ ...selectedLead, remarks: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium h-24 outline-none"
                  placeholder="Record call discussions..."
                />
              </div>

              {/* Bottom save button */}
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Save Lead Record Settings
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsEditDrawerOpen(false); setSelectedLead(null); }}
                  className="py-3 px-6 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl transition"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Lead Dialog Screen */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-[550px] max-h-[90vh] bg-white rounded-2xl shadow-2xl p-6 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-md font-extrabold text-slate-800">Add New Lead to CRM Workspace</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Collection Target</label>
                  <select 
                    value={activeLeadSubTab === 'website' ? 'W' : activeLeadSubTab === 'software' ? 'S' : 'SM'}
                    disabled
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                  >
                    <option value="W">Website Lead Core</option>
                    <option value="S">Software Lead Core</option>
                    <option value="SM">Social Media Lead Channel</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company Stage Category</label>
                  <select 
                    value={newLeadForm.category}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="Trading">Trading</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="NGO">NGO Sector</option>
                    <option value="IT Services">IT & Digital Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Business Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nepal Standard Traders"
                  value={newLeadForm.businessName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, businessName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Person Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Giri"
                    value={newLeadForm.contactPerson}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Inquiry Source</label>
                  <select 
                    value={newLeadForm.leadSource}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, leadSource: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Website Form">Website Form Lead Capture</option>
                    <option value="Google Maps">Google Maps Discovery</option>
                    <option value="Facebook">Facebook Ads Campaign</option>
                    <option value="Instagram">Instagram Direct Messenger</option>
                    <option value="WhatsApp">WhatsApp Inbound Outreach</option>
                    <option value="Referral">Local Business Referral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9851122334"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. contact@domain.com"
                    value={newLeadForm.email || ''}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Website Status Analysis</label>
                  <select 
                    value={newLeadForm.websiteStatus}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, websiteStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="No Website">No Website</option>
                    <option value="Old Website">Old Website</option>
                    <option value="Needs Redesign">Needs Redesign</option>
                    <option value="Business Website">Business Website</option>
                    <option value="Ecommerce Website">Ecommerce Website</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Interested Package / Cost</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Business Web (NPR 19,999)"
                    value={newLeadForm.packageOffered}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, packageOffered: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Follow-up Stat</label>
                  <select 
                    value={newLeadForm.followUpStatus}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, followUpStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Contacted">Not Contacted</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority Metric</label>
                  <select 
                    value={newLeadForm.leadPriority}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, leadPriority: e.target.value as any })}
                    className="w-full p-[#10px] bg-slate-50 border border-[#b2c3df] rounded-xl text-xs font-bold"
                  >
                    <option value="Hot">🔥 Hot</option>
                    <option value="Warm">⚡ Warm</option>
                    <option value="Cold">❄️ Cold</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assigned Agent</label>
                  <select 
                    value={newLeadForm.assignedTo}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, assignedTo: e.target.value })}
                    className="w-full p-[#10px] bg-slate-50 border border-[#b2c3df] rounded-xl text-xs font-bold text-slate-800"
                  >
                    {mockUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Requirements Remarks</label>
                <textarea 
                  placeholder="Record customer specific features or requirements discussion logs..."
                  value={newLeadForm.remarks}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, remarks: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs h-18 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95"
                >
                  Create Lead Entry
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-3 px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Call Dial Overlay */}
      {callLead && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="w-[420px] bg-[#0d162d] border border-[#1e346c] rounded-2xl shadow-2xl p-6 flex flex-col text-slate-200 text-center animate-bounce-short">
            <span className="text-[9px] font-extrabold uppercase bg-red-500 text-white px-2.5 py-0.5 rounded-full select-none tracking-widest block w-max mx-auto mb-4 animate-pulse">
              LINE ANSWERED - RECORDING ACTIVE
            </span>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black mb-3 mx-auto shadow-lg animate-ping-slow">
              ☏
            </div>
            <h4 className="text-md font-extrabold text-white leading-tight">{callLead.businessName}</h4>
            <span className="text-xs text-slate-400 mt-1">{callLead.contactPerson} - {callLead.phone}</span>

            {/* Simulated Timer */}
            <p className="text-2xl font-mono text-cyan-400 font-bold tracking-widest mt-4">00 : 42 : 18</p>

            <div className="mt-5 text-left space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Call Outcome Feedback</label>
                <select 
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full p-2.5 bg-[#142247] border border-[#1e3a6c] rounded-xl text-xs font-bold text-white outline-none"
                >
                  <option value="Very Interested">Very Interested</option>
                  <option value="Interested">Interested / Follow-up Scheduled</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="No Answer">No Answer / Left Voicemail</option>
                  <option value="Wrong Number">Wrong/Incomplete Phone Number</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Conversation Discussion Notes</label>
                <textarea 
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#142247] border border-[#1e3a6c] rounded-xl text-xs font-semibold text-slate-200 outline-none h-20 placeholder:text-slate-500"
                  placeholder="e.g. Requested pricing details for online school calendars..."
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button 
                onClick={handleSaveCallStatus}
                className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition select-none tracking-wide"
              >
                Log Call Outcomes
              </button>
              <button 
                onClick={() => setCallLead(null)}
                className="py-3 bg-red-600/30 border border-red-500/20 hover:bg-red-600 text-red-200 font-bold text-xs rounded-xl transition"
              >
                Terminate Dial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock WhatsApp Chat dialog overlay */}
      {waLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] select-none text-slate-800 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
            
            {/* WhatsApp App Green header */}
            <div className="bg-[#075e54] text-white p-4 flex justify-between items-center select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100/20 text-emerald-100 font-extrabold flex items-center justify-center text-sm capitalize">
                  {waLead.contactPerson.slice(0,2)}
                </div>
                <div>
                  <h4 className="text-xs font-black truncate max-w-[170px]">{waLead.contactPerson}</h4>
                  <span className="text-[9px] text-emerald-200 block font-medium">WhatsApp Dispatch helper • Online</span>
                </div>
              </div>
              <button onClick={() => setWaLead(null)} className="text-white hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-[#efeae2] p-4 space-y-3 min-h-[160px] overflow-y-auto">
              <p className="text-[9px] text-slate-500 bg-white/70 border border-slate-250/50 rounded px-2 py-0.5 text-center font-bold tracking-wide uppercase max-w-[200px] mx-auto select-none">
                MESSAGES DEALT COMPLIANTLY
              </p>
              
              <div className="bg-[#dcf8c6] p-3 rounded-2xl shadow-xs text-xs font-semibold self-end ml-10 text-slate-800 leading-relaxed border border-[#c1e8a6]/40">
                <p className="text-[8px] font-bold text-emerald-700 uppercase tracking-widest mb-1 select-none">Draft Outreach message</p>
                <textarea 
                  rows={4}
                  value={waText}
                  onChange={(e) => setWaText(e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs text-slate-800 font-medium resize-none leading-relaxed"
                />
                <span className="text-[8px] text-slate-400 font-mono font-bold block text-right mt-1 select-none font-sans">Now • Nagarik API</span>
              </div>
            </div>

            {/* Chat Footer send trigger */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button 
                onClick={() => setWaLead(null)}
                className="w-1/3 py-2 bg-slate-200 hover:bg-slate-300 rounded-[#10px] text-xs font-bold transition text-slate-700 cursor-pointer"
              >
                Discard
              </button>
              <button 
                onClick={handleWhatsAppSend}
                className="w-2/3 py-2 bg-[#25d366] hover:bg-[#128c7e] text-white rounded-[#10px] text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Dispatch Outbound</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Duplicate Merging Wizard Modal */}
      {mergeLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] select-none text-slate-800 animate-fade-in text-left font-sans">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 border border-slate-100 shadow-2xl flex flex-col gap-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-700 font-sans">
                <Merge className="w-5 h-5 shrink-0" />
                <h3 className="text-sm font-extrabold font-sans">Clean Duplicate Indices</h3>
              </div>
              <button onClick={() => setMergeLead(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600 leading-relaxed font-sans">
              <p className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-[10px] text-amber-850 font-bold leading-relaxed font-sans text-amber-700">
                ⚠ De-duping combines notes logs from both accounts and clears the secondary duplicate record permanently.
              </p>

              <div>
                <span className="text-[10px] font-black text-slate-400 block tracking-widest uppercase mb-1">Duplicate Client Profile (Clearing)</span>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl mt-1 text-left">
                  <h4 className="font-extrabold text-[#0f172a] text-xs leading-none">{mergeLead.businessName}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono font-bold">Inquiry ID: {mergeLead.id} • Phone: {mergeLead.phone}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 block tracking-widest uppercase mb-1">Target Core Profile (Dominant Account)</span>
                <select 
                  value={mergeTargetId}
                  onChange={(e) => setMergeTargetId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl outline-none text-xs font-bold text-slate-800"
                >
                  <option value="">-- Choose Master Ledger Record --</option>
                  {mergeSuggestions.map(m => (
                    <option key={m.id} value={m.id}>{m.businessName} ({m.phone})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2 text-xs">
                <button 
                  onClick={() => setMergeLead(null)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmMerge}
                  disabled={!mergeTargetId}
                  className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition shadow disabled:opacity-50 cursor-pointer"
                >
                  Confirm Merge & Clear Duplicate
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Local view toast notification elements */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-850/60 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-[99999] text-xs font-bold animate-slide-left select-none max-w-sm text-left">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping-slow shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
