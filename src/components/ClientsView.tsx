import React, { useState, useMemo, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { Client } from '../types';
import { 
  Briefcase, MapPin, Phone, Mail, FileText, CheckCircle2, UserCheck, Plus, Sparkles, 
  Trash2, Search, Eye, Edit, Edit2, Edit3, MoreVertical, Download, 
  Filter, Check, X, LayoutGrid, Printer, HardDrive,
  Copy, PlusSquare, SlidersHorizontal, Bell, ChevronDown, ChevronRight, Globe, Laptop,
  CalendarRange, History, Paperclip, RefreshCw, AlertCircle, PhoneCall, CheckCircle, 
  Share2, Award, Calendar, DollarSign, ExternalLink, ShieldCheck, Star, Sparkle,
  PhoneCall as PhoneIcon, MessageCircle as WhatsAppIcon, User, Layers, ArrowRight, TrendingUp, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pre-configured list of contacts to match screenshot exactly: 12 entries
interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  altPhone: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  isPrimary: boolean;
  department: string;
  reportsTo: string;
  address: string;
  projects: number;
  invoices: number;
  payments: number;
  due: number;
}

const INITIAL_CONTACTS_MOCK: Contact[] = [
  {
    id: 'ct-1',
    name: 'Ramesh Shrestha',
    role: 'Managing Director',
    email: 'ramesh@softtech.com',
    phone: '9811234567',
    altPhone: '9851234567',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    isPrimary: true,
    department: 'Management',
    reportsTo: '—',
    address: 'Dillibazar, Kathmandu, Bagmati, Nepal',
    projects: 3,
    invoices: 6,
    payments: 850000,
    due: 125000,
  },
  {
    id: 'ct-2',
    name: 'Anita K.C.',
    role: 'Project Manager',
    email: 'anita@softtech.com',
    phone: '9851122334',
    altPhone: '9812233445',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
    isPrimary: false,
    department: 'Delivery',
    reportsTo: 'Ramesh Shrestha',
    address: 'Kalimati, Kathmandu, Nepal',
    projects: 2,
    invoices: 4,
    payments: 400000,
    due: 50000,
  },
  {
    id: 'ct-3',
    name: 'Dipesh Lama',
    role: 'Technical Lead',
    email: 'dipesh@softtech.com',
    phone: '9841123456',
    altPhone: '9801123456',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    isPrimary: false,
    department: 'Engineering',
    reportsTo: 'Ramesh Shrestha',
    address: 'Baneshwor, Kathmandu, Nepal',
    projects: 1,
    invoices: 2,
    payments: 250000,
    due: 0,
  },
  {
    id: 'ct-4',
    name: 'Sabina Maharjan',
    role: 'Business Analyst',
    email: 'sabina@softtech.com',
    phone: '9813344556',
    altPhone: '9851344556',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    isPrimary: false,
    department: 'Product',
    reportsTo: 'Anita K.C.',
    address: 'Lalitpur, Nepal',
    projects: 1,
    invoices: 1,
    payments: 100000,
    due: 15000,
  },
  {
    id: 'ct-5',
    name: 'Nabin Thapa',
    role: 'UI/UX Designer',
    email: 'nabin@softtech.com',
    phone: '9856677889',
    altPhone: '9816677889',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150',
    isPrimary: false,
    department: 'Design',
    reportsTo: 'Anita K.C.',
    address: 'Bhaktapur, Nepal',
    projects: 1,
    invoices: 1,
    payments: 80000,
    due: 0,
  },
  {
    id: 'ct-6',
    name: 'Sushma Karki',
    role: 'HR Manager',
    email: 'sushma@softtech.com',
    phone: '9845566778',
    altPhone: '9805566778',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    isPrimary: false,
    department: 'Human Resources',
    reportsTo: 'Ramesh Shrestha',
    address: 'Koteshwor, Kathmandu, Nepal',
    projects: 0,
    invoices: 0,
    payments: 0,
    due: 0,
  },
  {
    id: 'ct-7',
    name: 'Prabin Joshi',
    role: 'QA Engineer',
    email: 'prabin@softtech.com',
    phone: '9815566777',
    altPhone: '9845566777',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150',
    isPrimary: false,
    department: 'Quality Assurance',
    reportsTo: 'Anita K.C.',
    address: 'Swayambhu, Kathmandu, Nepal',
    projects: 1,
    invoices: 1,
    payments: 95000,
    due: 10000,
  },
  {
    id: 'ct-8',
    name: 'Rekha Shrestha',
    role: 'Accounts Officer',
    email: 'rekha@softtech.com',
    phone: '9801122233',
    altPhone: '9851122233',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150',
    isPrimary: false,
    department: 'Finance',
    reportsTo: 'Ramesh Shrestha',
    address: 'Sanepa, Lalitpur, Nepal',
    projects: 0,
    invoices: 3,
    payments: 120000,
    due: 35000,
  },
  {
    id: 'ct-9',
    name: 'Sujan Poudel',
    role: 'Support Engineer',
    email: 'sujan.poudel@softtech.com',
    phone: '9812233445',
    altPhone: '9842233445',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150',
    isPrimary: false,
    department: 'Support & Success',
    reportsTo: 'Anita K.C.',
    address: 'Gongabu, Kathmandu, Nepal',
    projects: 1,
    invoices: 1,
    payments: 50000,
    due: 0,
  },
  {
    id: 'ct-10',
    name: 'Laxmi Adhikari',
    role: 'Sales Executive',
    email: 'laxmi@softtech.com',
    phone: '9859988776',
    altPhone: '9819988776',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150',
    isPrimary: false,
    department: 'Sales & Growth',
    reportsTo: 'Ramesh Shrestha',
    address: 'Lagankhel, Lalitpur, Nepal',
    projects: 1,
    invoices: 2,
    payments: 180000,
    due: 15000,
  },
  {
    id: 'ct-11',
    name: 'Anil Gurung',
    role: 'System Administrator',
    email: 'anil@softtech.com',
    phone: '9816655443',
    altPhone: '9851765432',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=150',
    isPrimary: false,
    department: 'Infrastructure',
    reportsTo: 'Ramesh Shrestha',
    address: 'Thamel, Kathmandu, Nepal',
    projects: 1,
    invoices: 1,
    payments: 100000,
    due: 10000,
  },
  {
    id: 'ct-12',
    name: 'Priyanka Sen',
    role: 'Executive Assistant',
    email: 'priyanka@softtech.com',
    phone: '9841122390',
    altPhone: '9801122390',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150',
    isPrimary: false,
    department: 'Management',
    reportsTo: 'Ramesh Shrestha',
    address: 'Kapan, Kathmandu, Nepal',
    projects: 0,
    invoices: 0,
    payments: 10000,
    due: 0,
  }
];

export const ClientsView: React.FC = () => {
  const { clients, addClient, updateClient, activeClientSubTab, setActiveClientSubTab } = useCRM();

  // Active Client defaults to SoftTech Solutions (C-001) if available
  const defaultClient = clients.find(c => c.clientName.includes('SoftTech')) || clients[0];
  const [selectedClient, setSelectedClient] = useState<Client | null>(defaultClient || null);

  // Sync state if selectedClient becomes null or clients collection changes
  useEffect(() => {
    if (!selectedClient && clients.length > 0) {
      const defaultOne = clients.find(c => c.clientName.includes('SoftTech')) || clients[0];
      setSelectedClient(defaultOne);
    }
  }, [clients, selectedClient]);

  // Track contacts in localStorage to survive restarts/edits
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('crm_client_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS_MOCK;
  });

  useEffect(() => {
    localStorage.setItem('crm_client_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Selected contact in the detail sidebar (defaults to Ramesh Shrestha)
  const defaultContact = contacts.find(c => c.isPrimary) || contacts[0];
  const [selectedContact, setSelectedContact] = useState<Contact | null>(defaultContact || null);

  // Client tabs: Overview, Contacts, Projects, Activity, Invoices, Documents, Notes
  const [activeNestedTab, setActiveNestedTab] = useState<string>('contacts');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [designationFilter, setDesignationFilter] = useState('All Designations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Modals / Toast Notification Alerts
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Contacts Form state for Add/Edit
  const [contactForm, setContactForm] = useState<Omit<Contact, 'id'>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    altPhone: '',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
    isPrimary: false,
    department: 'Software Team',
    reportsTo: 'Ramesh Shrestha',
    address: 'Kathmandu, Nepal',
    projects: 1,
    invoices: 1,
    payments: 100000,
    due: 0
  });

  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const handleCreateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      ...contactForm,
      id: `ct-${Date.now()}`
    };

    // If new contact is primary, clear previous primary flags
    let updatedContacts = [...contacts];
    if (newContact.isPrimary) {
      updatedContacts = updatedContacts.map(c => ({ ...c, isPrimary: false }));
    }

    updatedContacts = [newContact, ...updatedContacts];
    setContacts(updatedContacts);
    setSelectedContact(newContact);
    setIsAddOpen(false);
    triggerToast(`Successfully onboarded contact: ${newContact.name}`);

    // Reset Form
    setContactForm({
      name: '',
      role: '',
      email: '',
      phone: '',
      altPhone: '',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
      isPrimary: false,
      department: 'Software Team',
      reportsTo: 'Ramesh Shrestha',
      address: 'Kathmandu, Nepal',
      projects: 1,
      invoices: 1,
      payments: 100000,
      due: 0
    });
  };

  const handleEditContactClick = (contact: Contact) => {
    setEditingContactId(contact.id);
    setContactForm({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      altPhone: contact.altPhone,
      status: contact.status,
      avatar: contact.avatar,
      isPrimary: contact.isPrimary,
      department: contact.department,
      reportsTo: contact.reportsTo,
      address: contact.address,
      projects: contact.projects,
      invoices: contact.invoices,
      payments: contact.payments,
      due: contact.due
    });
    setIsEditOpen(true);
  };

  const handleUpdateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContactId) return;

    let updatedContacts = contacts.map(c => {
      if (c.id === editingContactId) {
        return { ...c, ...contactForm };
      }
      return c;
    });

    if (contactForm.isPrimary) {
      updatedContacts = updatedContacts.map(c => {
        if (c.id !== editingContactId) {
          return { ...c, isPrimary: false };
        }
        return c;
      });
    }

    setContacts(updatedContacts);
    const updatedObj = updatedContacts.find(c => c.id === editingContactId);
    if (updatedObj) {
      setSelectedContact(updatedObj);
    }
    setIsEditOpen(false);
    setEditingContactId(null);
    triggerToast(`Successfully updated contact: ${contactForm.name}`);
  };

  const handleDeleteContact = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove contact '${name}'?`)) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      setSelectedContact(updated[0] || null);
      triggerToast(`Removed contact '${name}' successfully.`);
    }
  };

  // Group designations for filtration
  const designationsList = useMemo(() => {
    const list = new Set(contacts.map(c => c.role));
    return ['All Designations', ...Array.from(list)];
  }, [contacts]);

  // Bulk Checkboxes triggers
  const toggleSelectAll = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds(selectedContactIds.filter(cid => cid !== id));
    } else {
      setSelectedContactIds([...selectedContactIds, id]);
    }
  };

  // Filter contacts based on Search Query, Designation, Status
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.phone.includes(searchQuery);
      
      const matchesDesignation = designationFilter === 'All Designations' || contact.role === designationFilter;
      const matchesStatus = statusFilter === 'All Status' || contact.status === statusFilter;

      return matchesSearch && matchesDesignation && matchesStatus;
    });
  }, [contacts, searchQuery, designationFilter, statusFilter]);

  // Pagination logic
  const totalEntries = filteredContacts.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPagedContacts = useMemo(() => {
    return filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredContacts, indexOfFirstItem, indexOfLastItem]);

  // Trigger paginated page updates
  const setPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Export Contacts to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Designation', 'Department', 'Email', 'Phone', 'Alt Phone', 'Status', 'Is Primary', 'Reports To', 'Address'];
    const rows = filteredContacts.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.role}"`,
      `"${c.department}"`,
      c.email,
      c.phone,
      c.altPhone,
      c.status,
      c.isPrimary ? 'Yes' : 'No',
      `"${c.reportsTo}"`,
      `"${c.address}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nagarik_contacts_export_${selectedClient?.clientName.replace(/\s+/g, '_') || 'client'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Initiated secure CSV Export successfully.");
  };

  // State for onboarding client
  const [newClientForm, setNewClientForm] = useState<Omit<Client, 'id'>>({
    clientName: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: 'Kathmandu, Bagmati, Nepal',
    clientGroup: 'IT & Software',
    status: 'Active',
    joinedOn: new Date().toISOString().split('T')[0],
    panNumber: '',
    notes: 'Onboarded via secure gateway portal',
    totalProjects: 1,
    totalInvoices: 1,
    totalPaid: 0,
    totalOutstanding: 0
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(newClientForm);
    setIsAddClientOpen(false);
    triggerToast(`Successfully onboarded new client: ${newClientForm.clientName}`);
    // Clear
    setNewClientForm({
      clientName: '',
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: 'Kathmandu, Bagmati, Nepal',
      clientGroup: 'IT & Software',
      status: 'Active',
      joinedOn: new Date().toISOString().split('T')[0],
      panNumber: '',
      notes: 'Onboarded via secure gateway portal',
      totalProjects: 1,
      totalInvoices: 1,
      totalPaid: 0,
      totalOutstanding: 0
    });
  };

  // Activity logs inside subtab
  const clientActivities = [
    { id: '1', date: '12 Jun 2025 10:15 AM', user: 'Sujan Karki', type: 'Call Logged', desc: 'Discussed CRM Cloud Suite license expansion with Managing Director Ramesh Shrestha.' },
    { id: '2', date: '08 Jun 2025 04:30 PM', user: 'Sujan Karki', type: 'Email Sent', desc: 'Dispatched custom proposal for enterprise Nagarik software modules.' },
    { id: '3', date: '05 Jun 2025 02:00 PM', user: 'Ramesh Shrestha', type: 'WhatsApp Alert', desc: 'Customer asked for Nepal VAT tax documentation verification.' },
    { id: '4', date: '28 May 2025 11:00 AM', user: 'Anita K.C.', type: 'Meeting Held', desc: 'Weekly milestone review sync regarding the commercial web portals. Feedback categorized.' },
    { id: '5', date: '10 May 2025 09:00 AM', user: 'System Auto', type: 'Invoice Created', desc: 'Standard support contract fee invoice standard-INV-2025-098 published.' }
  ];

  // Documents mock list
  const clientDocuments = [
    { name: 'Master_Services_Contract_SoftTech_2025.pdf', size: '2.4 MB', updatedOn: '10 May 2025', category: 'Agreement', fileType: 'pdf' },
    { name: 'Nepal_VAT_Registration_Certificate.pdf', size: '1.1 MB', updatedOn: '12 May 2025', category: 'Tax Documents', fileType: 'pdf' },
    { name: 'Custom_Nagarik_Database_Architecture.pdf', size: '4.8 MB', updatedOn: '19 May 2025', category: 'Blueprints', fileType: 'pdf' },
    { name: 'Software_License_SLA_SoftTech_v2.docx', size: '840 KB', updatedOn: '24 May 2025', category: 'Terms', fileType: 'docx' },
  ];

  // Projects list mock
  const clientProjects = [
    { name: 'Commercial Portal Customization', teamLead: 'Anita K.C.', value: 450000, paid: 350000, due: 100000, status: 'In Progress', timeline: '15 May - 30 Jul 2025', progress: 65 },
    { name: 'HIMS Database Integration Module', teamLead: 'Dipesh Lama', value: 350000, paid: 350000, due: 0, status: 'Completed', timeline: '01 Mar - 30 Apr 2025', progress: 100 },
    { name: 'eCommerce Retail Gateway Portal', teamLead: 'Sabina Maharjan', value: 400000, paid: 400000, due: 0, status: 'Completed', timeline: '10 Jan - 28 Feb 2025', progress: 100 },
    { name: 'SaaS Multi-Tenant CRM Hub Sync', teamLead: 'Nabin Thapa', value: 150000, paid: 100000, due: 50000, status: 'In Progress', timeline: '01 Jun - 15 Aug 2025', progress: 20 },
    { name: 'Secure Gateway Identity Router', teamLead: 'Prabin Joshi', value: 100000, paid: 50000, due: 50000, status: 'Scheduled', timeline: '10 Jul - 30 Sep 2025', progress: 0 }
  ];

  // Invoices list mock
  const clientInvoices = [
    { invoiceNo: 'INV-2025-001', amount: 350000, status: 'Paid', date: '10 May 2025', dueDate: '25 May 2025' },
    { invoiceNo: 'INV-2025-002', amount: 400000, status: 'Paid', date: '28 Feb 2025', dueDate: '15 Mar 2025' },
    { invoiceNo: 'INV-2025-003', amount: 250000, status: 'Paid', date: '30 Apr 2025', dueDate: '15 May 2025' },
    { invoiceNo: 'INV-2025-004', amount: 100000, status: 'Partial', date: '01 Jun 2025', dueDate: '15 Jun 2025' },
    { invoiceNo: 'INV-2025-005', amount: 125000, status: 'Overdue', date: '18 May 2025', dueDate: '02 Jun 2025' },
    { invoiceNo: 'INV-2025-006', amount: 50000, status: 'Paid', date: '10 Jan 2025', dueDate: '25 Jan 2025' },
    { invoiceNo: 'INV-2025-007', amount: 80000, status: 'Paid', date: '15 Mar 2025', dueDate: '30 Mar 2025' },
    { invoiceNo: 'INV-2025-008', amount: 95000, status: 'Paid', date: '12 May 2025', dueDate: '27 May 2025' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden select-none font-sans" id="clients-viewport">
      {/* Dynamic Action Toasts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-[100] flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-bold border border-slate-700"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* 1. TOP HEADER SECTION (Breadcrumbs, Date Picker, Add Buttons, Avatar)   */}
      {/* ======================================================================= */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight" id="header-clients-title">Clients</h1>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5" id="header-breadcrumbs">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span>Clients</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-650 truncate max-w-[150px]">{selectedClient?.clientName}</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-blue-600 font-semibold uppercase tracking-wider">
              {activeClientSubTab === 'contacts' ? 'Contacts' : activeClientSubTab === 'all_clients' ? 'Verified Directory' : activeClientSubTab === 'groups' ? 'Sector Analysis' : 'Interactions'}
            </span>
          </div>
        </div>

        {/* Header Right hand actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Calendar Range Selector Widget */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 transition rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <CalendarRange className="w-3.5 h-3.5 text-slate-500" />
            <span>18 May - 18 Jun 2025</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </div>

          {/* Quick Onboard Client Shortcut button */}
          <button 
            type="button"
            onClick={() => setIsAddClientOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 text-[11.5px] font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <PlusSquare className="w-3.5 h-3.5" />
            <span>Onboard Client</span>
          </button>

          {/* "+ Add Contact" main button */}
          <button 
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition cursor-pointer select-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>

          {/* Separation line */}
          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          {/* Alert Bell badge */}
          <div className="relative p-2 text-slate-500 hover:text-slate-700 bg-slate-150 rounded-xl hover:bg-slate-200 cursor-pointer transition hidden sm:block">
            <Bell className="w-4 h-4 shrink-0" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white hover:bg-rose-600 font-extrabold text-[8px] rounded-full flex items-center justify-center border border-white">12</span>
          </div>

          {/* Marketing Executive Account Persona tag */}
          <div className="flex items-center gap-2 pl-1 select-none">
            <img 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-50"
              src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=150"
              alt="Marketing Officer Avatar" 
              referrerPolicy="no-referrer"
            />
            <div className="text-left hidden lg:block">
              <span className="text-[11.5px] font-black text-slate-800 block leading-tight">Sujan Karki</span>
              <span className="text-[9.5px] font-bold text-slate-400 block tracking-wide uppercase">Marketing Executive</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* 2. TAB TRANSITION SWITCHES (Directory vs Sector vs Selected Contacts)  */}
      {/* ======================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ======================================================================= */}
        {/* VIEW A: Verified Client Directory ('all_clients')                      */}
        {/* ======================================================================= */}
        {activeClientSubTab === 'all_clients' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <h2 className="text-md font-extrabold text-slate-800">Corporate Member Directory</h2>
                <p className="text-xs text-slate-400 mt-0.5">Click any legal entity block below to explore active POCs, ongoing projects ledger, and invoices.</p>
              </div>
              <button 
                onClick={() => setIsAddClientOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer select-none"
              >
                + Register New Corporate Client
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => {
                const isActive = selectedClient?.id === client.id;
                return (
                  <div 
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setActiveClientSubTab('contacts');
                      triggerToast(`Active scope shifted to: ${client.clientName}`);
                    }}
                    className={`bg-white rounded-2xl border-2 p-5 shadow-2xs hover:shadow cursor-pointer transition flex flex-col justify-between h-[210px] ${
                      isActive ? 'border-blue-500 bg-blue-50/5' : 'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border uppercase ${
                          client.clientGroup === 'IT & Software' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          client.clientGroup === 'Healthcare' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          client.clientGroup === 'Trading' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-purple-50 text-purple-700 border-purple-100'
                        }`}>
                          {client.clientGroup}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          client.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {client.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-800 mt-3.5 leading-snug">{client.clientName}</h3>
                      <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{client.address}</span>
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3.5 flex justify-between items-end">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block tracking-widest uppercase">Contract Volume</span>
                        <span className="text-sm font-extrabold text-slate-800 font-mono">Rs. {client.totalPaid.toLocaleString()}</span>
                      </div>
                      <div className="text-right text-[10px] text-slate-400 font-semibold">
                        <p>PAN ID: {client.panNumber}</p>
                        <p className="text-blue-600 font-bold mt-1 inline-flex items-center gap-0.5">Explore Contacts <ArrowRight className="w-3 h-3" /></p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW B: Sector Analysis & Client Groups ('groups')                     */}
        {/* ======================================================================= */}
        {activeClientSubTab === 'groups' && (
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-md font-extrabold text-slate-800">Corporate Sector Categories</h2>
              <p className="text-xs text-slate-400 mt-1">Nagarik Solution Client CRM classification distribution engine analysis models.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {[
                  { title: 'IT & Software Systems', count: 1, revenue: 'Rs. 14,50,000', color: 'border-blue-500 bg-blue-50/10' },
                  { title: 'Healthcare Clinics', count: 1, revenue: 'Rs. 8,00,000', color: 'border-emerald-500 bg-emerald-50/10' },
                  { title: 'Trading Distributors', count: 1, revenue: 'Rs. 4,50,000', color: 'border-amber-500 bg-amber-50/10' },
                  { title: 'Education Centers', count: 0, revenue: 'Rs. 00', color: 'border-purple-500 bg-purple-50/10' }
                ].map((sec, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border-2 ${sec.color}`}>
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Group Bucket</span>
                    <h3 className="text-sm font-extrabold text-slate-800 mt-1">{sec.title}</h3>
                    
                    <div className="flex justify-between items-center mt-5">
                      <div>
                        <span className="text-[9px] font-semibold text-slate-400 block">Total Revenue</span>
                        <p className="text-xs font-bold text-slate-850 font-mono">{sec.revenue}</p>
                      </div>
                      <span className="bg-slate-900 text-white font-extrabold rounded-lg w-7 h-7 flex items-center justify-center text-xs">{sec.count}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 mt-6 max-w-xl">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-blue-500" /> Sector Allocation Summary</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                  Our system shows the client demographic index is heavily dominated by <strong>IT and Customized Digital Infrastructure modules</strong> segment, delivering 60.5% share of total paid corporate contract ledger lines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW C: Client Activity Logs ('activity')                              */}
        {/* ======================================================================= */}
        {activeClientSubTab === 'activity' && (
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs max-w-3xl">
              <h2 className="text-md font-extrabold text-slate-800">System-wide Client Activity Logs</h2>
              <p className="text-xs text-slate-400 mt-1">Archived interaction timeline list compiled from secure cache logs.</p>

              <div className="mt-6 space-y-6 relative border-l-2 border-slate-250 pl-5 ml-4">
                {clientActivities.map((act) => (
                  <div key={act.id} className="relative">
                    {/* Circle timeline dot */}
                    <div className="absolute -left-[27.5px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-100" />

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">{act.date}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold text-[9px] uppercase">{act.type}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-1.5 leading-relaxed">{act.desc}</h4>
                      <div className="text-[10px] text-slate-400 font-semibold mt-2.5 text-right">Logged By: <span className="text-slate-700">{act.user}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW D: Selected Client Contacts & Tabs Workspace ('contacts')         */}
        {/* ======================================================================= */}
        {activeClientSubTab === 'contacts' && selectedClient && (
          <div className="flex-1 flex overflow-hidden h-full">
            {/* Contacts Table Panel (Takes 70% width) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden p-6 gap-6">
              
              {/* =================================================================== */}
              {/* SELECTED CLIENT CARD HERO HEADER (Left aligned, with Stats Cards)   */}
              {/* =================================================================== */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5 shrink-0 select-none">
                {/* Profile module */}
                <div className="flex items-center gap-4 text-left shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#0b1b3d] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0 select-none">
                    {selectedClient.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-extrabold text-[#0f172a] tracking-tight">{selectedClient.clientName}</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[9.5px] font-bold px-2 py-0.5 rounded-full select-none">Active</span>
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium tracking-wide mt-0.5">{selectedClient.clientGroup}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Kathmandu, Bagmati</span>
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                      <span>Client Since: 10 May 2024</span>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Widgets block */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xl:gap-4 flex-grow max-w-3xl text-left select-none">
                  {/* KPI 1 */}
                  <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl hover:bg-slate-100/50 transition cursor-pointer" onClick={() => setActiveNestedTab('contacts')}>
                    <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">Total Contacts</span>
                    <span className="text-lg font-black text-slate-800 block mt-0.5">12</span>
                    <span className="text-[9.5px] text-slate-400 font-bold hover:text-blue-600 block mt-1">View all contacts →</span>
                  </div>
                  {/* KPI 2 */}
                  <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl hover:bg-slate-100/50 transition cursor-pointer" onClick={() => setActiveNestedTab('contacts')}>
                    <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">Active Contacts</span>
                    <span className="text-lg font-black text-slate-800 block mt-0.5">10</span>
                    <span className="text-[9.5px] text-slate-400 font-bold hover:text-blue-600 block mt-1">View active contacts →</span>
                  </div>
                  {/* KPI 3 */}
                  <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl hover:bg-slate-100/50 transition cursor-pointer" onClick={() => setActiveNestedTab('projects')}>
                    <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">Projects</span>
                    <span className="text-lg font-black text-slate-850 block mt-0.5">5</span>
                    <span className="text-[9.5px] text-slate-400 font-bold hover:text-blue-600 block mt-1">View projects →</span>
                  </div>
                  {/* KPI 4 */}
                  <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl hover:bg-slate-100/50 transition cursor-pointer" onClick={() => setActiveNestedTab('invoices')}>
                    <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">Total Revenue</span>
                    <span className="text-sm font-black text-slate-850 block mt-1.5 font-mono">Rs. 14,50,000</span>
                    <span className="text-[9.5px] text-slate-400 font-bold hover:text-blue-600 block mt-1">View financials →</span>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* NESTED NAVIGATION TAB CONTROLS (Overview, Contacts, Projects...)     */}
              {/* =================================================================== */}
              <div className="border-b border-slate-200 flex flex-wrap gap-1 shrink-0 select-none">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'contacts', label: `Contacts (${contacts.length})` },
                  { key: 'projects', label: 'Projects (5)' },
                  { key: 'activity', label: 'Activity' },
                  { key: 'invoices', label: 'Invoices (12)' },
                  { key: 'documents', label: 'Documents' },
                  { key: 'notes', label: 'Notes' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveNestedTab(item.key);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 text-xs font-black tracking-wide border-b-2 transition relative ${
                      activeNestedTab === item.key 
                        ? 'border-blue-600 text-blue-600 font-extrabold' 
                        : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* =================================================================== */}
              {/* DYNAMIC RENDERED PANEL SPACE                                       */}
              {/* =================================================================== */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                
                {/* 1. OVERVIEW SCREEN SUBPANEL */}
                {activeNestedTab === 'overview' && (
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span>Corporate Profile Details</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Legal entity indexing records for VAT tax and billing registries.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs space-y-3 font-semibold text-slate-650">
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Official Legal Name</strong> {selectedClient.clientName}</p>
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Business Industry Category</strong> {selectedClient.clientGroup}</p>
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Government Tax Registration (PAN ID)</strong> {selectedClient.panNumber}</p>
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Corporate HQ Coordinates</strong> Dillibazar, Kathmandu, Nepal</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs space-y-3 font-semibold text-slate-650">
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Primary POC Phone Link</strong> {selectedClient.phone}</p>
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Verified Corporate Email</strong> {selectedClient.email}</p>
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Corporate Registry Timestamp</strong> {selectedClient.joinedOn}</p>
                        <p><strong className="text-slate-400 uppercase text-[9.5px] block font-black">Account Executive Officer</strong> Sujan Karki (Marketing)</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 max-w-2xl text-xs text-amber-900 leading-relaxed font-medium">
                      <strong>Client Profile Assessment Notes:</strong> Let's coordinate all module releases with Ramesh. This corporate partner is an integral advocate of Nagarik Solutions Suite framework across Nepal's financial automation networks.
                    </div>
                  </div>
                )}

                {/* 2. ACTIVITY SCREEN SUBPANEL */}
                {activeNestedTab === 'activity' && (
                  <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <History className="w-4 h-4 text-blue-500" />
                        <span>Corporate Activity Stream</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Interaction and system log streams from remote account representative Sujan.</p>
                    </div>

                    <div className="space-y-4 max-w-2xl">
                      {clientActivities.map((act) => (
                        <div key={act.id} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-left flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-150 text-blue-700 font-extrabold text-[10px] flex items-center justify-center shrink-0">S</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11.5px] font-extrabold text-slate-800">{act.user}</span>
                              <span className="w-1.5 h-1.5 bg-slate-350 rounded-full" />
                              <span className="text-[10px] font-bold text-slate-400">{act.date}</span>
                            </div>
                            <p className="text-xs text-slate-650 mt-1">{act.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PROJECTS SCREEN SUBPANEL */}
                {activeNestedTab === 'projects' && (
                  <div className="flex-grow overflow-y-auto p-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Laptop className="w-4 h-4 text-blue-500" />
                        <span>Client Projects (5)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Track timelines and progress metrics for projects contracted with SoftTech.</p>
                    </div>

                    <div className="space-y-4">
                      {clientProjects.map((p, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-black text-slate-800">{p.name}</h5>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                p.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-slate-200 text-slate-700'
                              }`}>{p.status}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">Lead Architect: {p.teamLead} | Timeline: {p.timeline}</p>
                          </div>

                          <div className="w-full md:w-36 text-xs text-right font-medium">
                            <span className="text-[10.5px] text-slate-400 font-bold block mb-1">Contract value</span>
                            <span className="font-mono text-slate-800 block">Rs. {p.value.toLocaleString()}</span>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. INVOICES SCREEN SUBPANEL */}
                {activeNestedTab === 'invoices' && (
                  <div className="flex-grow overflow-y-auto p-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <span>Aggregated Invoices & Payments (12)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Detailed invoices generated for contracted software products.</p>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 font-black text-slate-400 select-none uppercase tracking-wider h-10 border-b border-slate-200">
                          <tr>
                            <th className="px-4">Invoice #</th>
                            <th className="px-4">Amount</th>
                            <th className="px-4">Status</th>
                            <th className="px-4">Date Issued</th>
                            <th className="px-4">Due Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-650 font-mono">
                          {clientInvoices.map((inv, idx) => (
                            <tr key={idx} className="h-10 hover:bg-slate-50 transition">
                              <td className="px-4 text-blue-700 font-bold">{inv.invoiceNo}</td>
                              <td className="px-4">Rs. {inv.amount.toLocaleString()}</td>
                              <td className="px-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                  inv.status === 'Partial' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                                  'bg-rose-50 text-rose-800 border border-rose-100'
                                }`}>{inv.status}</span>
                              </td>
                              <td className="px-4 font-sans text-slate-400">{inv.date}</td>
                              <td className="px-4 font-sans text-slate-400">{inv.dueDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. DOCUMENTS SCREEN SUBPANEL */}
                {activeNestedTab === 'documents' && (
                  <div className="flex-grow overflow-y-auto p-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-blue-500" />
                        <span>Corporate Documents Cloud Repo</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Secure local archive of signed client agreements and legal papers.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clientDocuments.map((doc, idx) => (
                        <div key={idx} className="bg-slate-50 hover:bg-slate-100 border border-slate-200/60 p-4 rounded-xl flex items-center justify-between transition cursor-pointer select-none text-left">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-xs uppercase shrink-0">
                              {doc.fileType}
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-slate-750 max-w-[190px] truncate leading-tight">{doc.name}</h5>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">Size: {doc.size} | Uploaded: {doc.updatedOn}</p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => triggerToast(`Initiate secure download of contract file: ${doc.name}`)}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Download File"
                          >
                            <Download className="w-4 h-4 shrink-0" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. NOTES SCREEN SUBPANEL */}
                {activeNestedTab === 'notes' && (
                  <div className="flex-grow overflow-y-auto p-6 flex flex-col h-full gap-4 text-left">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>Interactive Relationship Notes</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Use the block canvas below to save real-time discussions notes. Saved into local storage.</p>
                    </div>

                    <textarea 
                      value={selectedClient.notes || ''}
                      onChange={(e) => {
                        const notesVal = e.target.value;
                        const updated = { ...selectedClient, notes: notesVal };
                        setSelectedClient(updated);
                        updateClient(updated);
                      }}
                      className="w-full flex-grow p-4 bg-slate-50 hover:bg-slate-50/50 border border-slate-250 rounded-2xl text-xs text-slate-850 font-semibold leading-relaxed outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Discuss custom corporate portal upgrades with the Ramesh family during Friday luncheon..."
                    />

                    <div className="flex justify-end gap-2 shrink-0">
                      <button 
                        onClick={() => triggerToast("Discussion Note cached properly.")}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer select-none"
                      >
                        Commit & Force Sync Logs
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. CONTACTS SCREEN SUBTAB VIEW (THE CORE MAIN WORKSPACE) */}
                {activeNestedTab === 'contacts' && (
                  <div className="flex-1 flex flex-col overflow-hidden h-full">
                    
                    {/* ============================================================= */}
                    {/* CONTACTS FILTER HEADER (Search, Filtering dropdowns, Export)  */}
                    {/* ============================================================= */}
                    <div className="bg-white px-5 py-3.5 border-b border-slate-200/80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 shrink-0 select-none">
                      
                      {/* Search box block */}
                      <div className="flex flex-wrap items-center gap-2 flex-grow max-w-2xl w-full text-left">
                        <div className="relative flex-grow max-w-[280px]">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 cursor-pointer pointer-events-none" />
                          <input 
                            type="text" 
                            placeholder="Search by name, email, phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-50 border border-slate-250 rounded-xl py-2 pl-9 pr-4 text-[11.5px] font-semibold text-slate-800 placeholder-slate-400 w-full outline-none focus:bg-white focus:ring-2 focus:ring-blue-50"
                          />
                        </div>

                        {/* Designation Filters Dropdown */}
                        <select 
                          value={designationFilter}
                          onChange={(e) => setDesignationFilter(e.target.value)}
                          className="bg-slate-50 border border-slate-250 text-slate-650 text-[11.5px] font-bold py-2 px-3.5 rounded-xl cursor-copy inline-flex items-center outline-none hover:bg-slate-100/60"
                        >
                          <option value="All Designations">All Designations</option>
                          {designationsList.map((des, index) => des !== 'All Designations' && (
                            <option key={index} value={des}>{des}</option>
                          ))}
                        </select>

                        {/* Status Filter dropdown */}
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-slate-50 border border-slate-250 text-slate-650 text-[11.5px] font-bold py-2 px-3.5 rounded-xl cursor-copy inline-flex items-center outline-none hover:bg-slate-100/60"
                        >
                          <option value="All Status">All Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Right aligned actions bar */}
                      <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end">
                        <button 
                          type="button"
                          onClick={() => triggerToast("Filter parameters reset successfully.")}
                          className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl px-3 py-2 text-slate-500 font-bold text-[11.5px] transition cursor-pointer select-none"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>More Filters</span>
                        </button>

                        <button 
                          type="button"
                          onClick={handleExportCSV}
                          className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl px-3.5 py-2 text-slate-700 font-bold text-[11.5px] transition cursor-pointer select-none"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Export</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => setIsAddOpen(true)}
                          className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11.5px] rounded-xl shadow-2xs transition cursor-pointer select-none"
                        >
                          <Plus className="w-3.5 h-3.5 shrink-0" />
                          <span>Add Contact</span>
                        </button>
                      </div>
                    </div>

                    {/* ============================================================= */}
                    {/* CORE SPREADSHEET TABLE OF CONTACT DATA                        */}
                    {/* ============================================================= */}
                    <div className="flex-1 overflow-auto bg-white relative">
                      <table className="w-full text-xs text-left h-full">
                        <thead className="bg-[#f8fafc] font-black text-slate-400 select-none uppercase tracking-wider h-11 border-b border-rose-100/10 sticky top-0 z-20">
                          <tr>
                            <th className="w-12 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                              />
                            </th>
                            <th className="w-12 text-center">#</th>
                            <th className="px-6">Contact Name</th>
                            <th className="px-6">Designation</th>
                            <th className="px-6">Email</th>
                            <th className="px-6">Phone</th>
                            <th className="px-6">Status</th>
                            <th className="px-6 text-center">Primary Contact</th>
                            <th className="px-6 text-right pr-6 w-32">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-[#334155] select-none h-full" id="contacts-table-body">
                          {currentPagedContacts.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="py-12 text-center text-slate-400">
                                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto stroke-[1.5] mb-2" />
                                <h5 className="font-extrabold text-slate-500 text-sm">No Contacts Found</h5>
                                <p className="text-xs text-slate-400 mt-1">Adjust your filter designations or search spelling query.</p>
                              </td>
                            </tr>
                          ) : (
                            currentPagedContacts.map((contact, index) => {
                              const isSelected = selectedContact?.id === contact.id;
                              const isRowChecked = selectedContactIds.includes(contact.id);
                              
                              return (
                                <tr 
                                  key={contact.id} 
                                  onClick={() => setSelectedContact(contact)}
                                  className={`h-11 hover:bg-blue-50/20 cursor-pointer transition select-none ${
                                    isSelected ? 'bg-blue-50/30' : ''
                                  }`}
                                >
                                  {/* Checkbox cell */}
                                  <td className="text-center" onClick={(e) => { e.stopPropagation(); }}>
                                    <input 
                                      type="checkbox" 
                                      checked={isRowChecked}
                                      onChange={() => toggleSelectContact(contact.id)}
                                      className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                                    />
                                  </td>

                                  {/* Index Row Number */}
                                  <td className="text-center text-[11px] text-slate-400 font-bold font-mono">
                                    {indexOfFirstItem + index + 1}
                                  </td>

                                  {/* Contact Name & avatar */}
                                  <td className="px-6 py-1.5 flex items-center gap-2.5">
                                    <img 
                                      src={contact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                                      alt={contact.name}
                                      className="w-7 h-7 rounded-full object-cover shadow-2xs shrink-0 select-none bg-slate-100"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="text-left">
                                      <span className="font-bold text-slate-800 text-[11.5px] hover:text-blue-600 truncate block max-w-[150px]">{contact.name}</span>
                                      {contact.isPrimary && (
                                        <span className="bg-blue-50 text-[8px] font-black text-blue-700 tracking-wide uppercase px-1.5 py-0.2 rounded border border-blue-100 inline-block shrink-0">Primary</span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Designation role */}
                                  <td className="px-6 font-sans text-slate-500 font-semibold text-[11px] truncate max-w-[130px]" title={contact.role}>
                                    {contact.role}
                                  </td>

                                  {/* Email */}
                                  <td className="px-6 font-mono text-[11px] text-slate-500 font-medium truncate max-w-[164px]">
                                    {contact.email}
                                  </td>

                                  {/* Phone (WhatsApp logo) */}
                                  <td className="px-6 font-mono text-[11.5px] font-bold text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <span>{contact.phone}</span>
                                      {/* WhatsApp Bubble brand icon */}
                                      <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center cursor-pointer select-none hover:scale-110 active:scale-95 transition" title="Start WhatsApp Chat">
                                        <WhatsAppIcon className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600 shrink-0" />
                                      </span>
                                    </div>
                                  </td>

                                  {/* Status Badging */}
                                  <td className="px-6">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block ${
                                      contact.status === 'Active' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                                    }`}>
                                      {contact.status}
                                    </span>
                                  </td>

                                  {/* Is Primary Checked State checkbox symbol */}
                                  <td className="px-6 text-center">
                                    {contact.isPrimary ? (
                                      <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 select-none border border-emerald-200 shadow-2xs">
                                        <Check className="w-3 h-3 stroke-[2.5]" />
                                      </div>
                                    ) : (
                                      <span className="text-slate-300 font-extrabold text-[12px] block select-none">—</span>
                                    )}
                                  </td>

                                  {/* Action Elements Cell */}
                                  <td className="px-6 text-right pr-6" onClick={(e) => { e.stopPropagation(); }}>
                                    <div className="flex items-center justify-end gap-1 font-bold">
                                      {/* Trigger Audio Call button */}
                                      <button 
                                        onClick={() => triggerToast(`Dialing secured connection to ${contact.name} at: ${contact.phone}`)}
                                        className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg flex items-center justify-center transition cursor-pointer"
                                        title="Trigger Corporate Voicecall"
                                      >
                                        <PhoneIcon className="w-3.5 h-3.5 stroke-[2]" />
                                      </button>

                                      {/* Edit Entry button */}
                                      <button 
                                        onClick={() => handleEditContactClick(contact)}
                                        className="h-7 w-7 text-slate-400 hover:text-amber-600 hover:bg-amber-50/50 rounded-lg flex items-center justify-center transition cursor-pointer"
                                        title="Edit Contact Data"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Delete client contact button */}
                                      <button 
                                        onClick={() => handleDeleteContact(contact.id, contact.name)}
                                        className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg flex items-center justify-center transition cursor-pointer"
                                        title="Remove Contact Record"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* ============================================================= */}
                    {/* CONTACTS SPREADSHEET FOOTER PAGINATION BAR                    */}
                    {/* ============================================================= */}
                    <div className="bg-white border-t border-slate-200/85 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 select-none">
                      {/* Left: Entries status message */}
                      <span className="text-[11.5px] font-bold text-slate-450 leading-none">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalEntries)} of {totalEntries} entries
                      </span>

                      {/* Center: Numeric Paginations */}
                      <div className="flex items-center gap-1.5 font-sans">
                        <button 
                          onClick={() => setPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="w-7 h-7 rounded-lg border border-slate-250 flex items-center justify-center font-bold text-xs select-none transition bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                          ‹
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs transition cursor-pointer ${
                              currentPage === i + 1 
                                ? 'bg-blue-600 border-blue-600 text-white font-black shadow-2xs' 
                                : 'bg-white border-slate-250 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button 
                          onClick={() => setPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="w-7 h-7 rounded-lg border border-slate-250 flex items-center justify-center font-bold text-xs select-none transition bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                          ›
                        </button>
                      </div>

                      {/* Right: Items per page entries select drop */}
                      <div className="flex items-center gap-1.5 font-semibold text-slate-500 text-[11px] select-none">
                        <span className="block">Per Page:</span>
                        <select 
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="bg-white border border-slate-250 text-slate-700 font-extrabold py-1 px-1.5 rounded-lg outline-none cursor-copy"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* ======================================================================= */}
            {/* 3. CONTACTS DETAILS RIGHT DRAWER SIDE SHEET PANEL                       */}
            {/* ======================================================================= */}
            <div className="w-[420px] bg-white border-l border-slate-205 flex flex-col h-full overflow-hidden shrink-0 transition-all select-none">
              
              {selectedContact ? (
                <div className="flex flex-col h-full overflow-hidden select-none">
                  {/* Drawer Header line */}
                  <div className="p-5 border-b border-slate-150 flex justify-between items-center shrink-0 bg-slate-50/50">
                    <div>
                      <h4 className="text-[13.5px] font-extrabold text-[#0f172a] tracking-tight">Contact Profile Details</h4>
                      <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">Corporate business segment ledger overview</p>
                    </div>
                    {/* Clear selection */}
                    <button 
                      onClick={() => setSelectedContact(null)}
                      className="w-7 h-7 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-750 flex items-center justify-center font-black cursor-pointer bg-slate-100 transition"
                      title="Clear detail focus outline"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Drawer Content frame */}
                  <div className="flex-grow overflow-y-auto p-5 space-y-6">
                    
                    {/* Core Persona badge widget box */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative select-none">
                      {selectedContact.isPrimary && (
                        <span className="absolute top-3 left-3 bg-blue-600 text-white font-black text-[8px] tracking-widest uppercase px-2 py-0.5 rounded shadow-2xs">Primary</span>
                      )}

                      <span className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedContact.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-650'
                      }`}>
                        {selectedContact.status}
                      </span>

                      <img 
                        src={selectedContact.avatar} 
                        alt={selectedContact.name} 
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-xs bg-slate-200 select-none mb-3"
                        referrerPolicy="no-referrer"
                      />

                      <h4 className="text-sm font-black text-slate-800 leading-snug">{selectedContact.name}</h4>
                      <p className="text-xs text-slate-400 font-bold tracking-wide mt-0.5">{selectedContact.role}</p>
                      
                      <div className="flex items-center gap-1 mt-2.5 text-[10px] text-slate-400 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Joined: 10 May 2024</span>
                      </div>
                    </div>

                    {/* Fast communications action grid buttons */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10.5px] font-bold text-slate-650 select-none">
                      {/* Action 1 Phone Call */}
                      <div 
                        onClick={() => triggerToast(`Dialing voice connection: ${selectedContact.phone}`)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer active:scale-95 transition"
                      >
                        <Phone className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                        <span className="block leading-none mt-1">Call</span>
                      </div>
                      
                      {/* Action 2 Send Email */}
                      <a 
                        href={`mailto:${selectedContact.email}`}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer active:scale-95 transition block"
                      >
                        <Mail className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                        <span className="block leading-none mt-1">Email</span>
                      </a>

                      {/* Action 3 WhatsApp messaging */}
                      <div 
                        onClick={() => triggerToast(`Opening secure WhatsApp Messenger app for No: ${selectedContact.phone}`)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer active:scale-95 transition"
                      >
                        <WhatsAppIcon className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                        <span className="block leading-none mt-1">WhatsApp</span>
                      </div>

                      {/* Action 4 Check historic log */}
                      <div 
                        onClick={() => {
                          setActiveNestedTab('activity');
                          triggerToast("Scoping interaction activity logs...");
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer active:scale-95 transition"
                      >
                        <History className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                        <span className="block leading-none mt-1">Activity Log</span>
                      </div>
                    </div>

                    {/* Metadata contact credentials details list */}
                    <div className="space-y-4 pt-1 text-xs text-left text-slate-650 select-none">
                      
                      <div className="flex justify-between items-center group py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Email Address</span>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="text-slate-800">{selectedContact.email}</span>
                          <span 
                            onClick={() => {
                              navigator.clipboard.writeText(selectedContact.email);
                              triggerToast("Copied email link address.");
                            }}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 block cursor-copy active:scale-90"
                            title="Copy email to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Mobile Phone</span>
                        <span className="font-mono text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => triggerToast(`Dialing Mobile No: ${selectedContact.phone}`)}>{selectedContact.phone}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Mobile (Alt.)</span>
                        <span className="font-mono text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => triggerToast(`Dialing Alternate No: ${selectedContact.altPhone}`)}>{selectedContact.altPhone}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Designation Role</span>
                        <span className="text-slate-850 font-bold">{selectedContact.role}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Department</span>
                        <span className="text-slate-850 font-bold">{selectedContact.department}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Reports To</span>
                        <span className="text-slate-800 font-bold truncate max-w-[170px]">{selectedContact.reportsTo}</span>
                      </div>

                      <div className="flex justify-between items-start py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Address Address</span>
                        <span className="text-slate-800 font-bold text-right leading-relaxed max-w-[190px]">{selectedContact.address}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Primary Contact Status</span>
                        <span className="text-slate-850 font-bold">{selectedContact.isPrimary ? 'Yes' : 'No'}</span>
                      </div>
                    </div>

                    {/* Summary financial ledger capsule */}
                    <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl text-left font-sans select-none">
                      <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase mb-3">Summary Metrics details</span>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 font-semibold text-xs text-slate-650">
                        <div>
                          <span className="text-[10px] text-slate-405 block font-bold leading-normal">Total Projects</span>
                          <span className="text-slate-800 font-bold block">{selectedContact.projects} Projects</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-405 block font-bold leading-normal">Total Invoices</span>
                          <span className="text-slate-800 font-bold block">{selectedContact.invoices} Invoices</span>
                        </div>
                        <div className="col-span-2 border-t border-slate-205 pt-2 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-slate-405 block font-bold leading-normal">Total Payments</span>
                            <span className="text-emerald-700 font-black text-sm block leading-normal font-mono">Rs. {selectedContact.payments.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-405 block font-bold leading-normal">Total Due</span>
                            <span className="text-rose-600 font-black text-sm block leading-normal font-mono">Rs. {selectedContact.due.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Drawer Footer Actions Buttons */}
                  <div className="p-4 border-t border-slate-150 grid grid-cols-2 gap-3 shrink-0 select-none bg-slate-50">
                    <button 
                      type="button"
                      onClick={() => handleEditContactClick(selectedContact)}
                      className="border border-blue-600 hover:border-blue-500 text-blue-600 hover:text-blue-500 bg-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer select-none active:scale-98"
                    >
                      Edit Contact
                    </button>
                    <button 
                      type="button"
                      onClick={() => triggerToast(`Redirecting down secure API pipe to full audit trail layout of Ramesh's transactions`)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer select-none shadow-xs hover:shadow active:scale-98"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 h-full select-none leading-relaxed">
                  <Briefcase className="w-12 h-12 text-slate-300 stroke-[1.5] mb-2" />
                  <h4 className="text-sm font-extrabold text-slate-500">No Contact Focused</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">Choose an active representative on the directory grid list to view detailed email lists, total payment volumes, department allocations or save private remarks logs.</p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ======================================================================= */}
      {/* MODAL WINDOW 1: ADD CONTACT DIALOG                                      */}
      {/* ======================================================================= */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 flex flex-col relative"
          >
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 mb-5 text-left">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Add New Corporate Contact</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Register a contact POC representing {selectedClient?.clientName}</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContactSubmit} className="space-y-4 text-left overflow-y-auto max-h-[75vh] pr-1">
              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact POC Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Shrestha"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Designation Role *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Managing Director"
                    value={contactForm.role}
                    onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Corporate Department *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Management / Delivery"
                    value={contactForm.department}
                    onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Phone *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9811234567"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Alternate Phone</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9851234567"
                    value={contactForm.altPhone}
                    onChange={(e) => setContactForm({ ...contactForm, altPhone: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Verified Corporate Email *</label>
                <input 
                  type="email" 
                  placeholder="e.g. email@softtech.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800 leading-normal"
                  required
                />
              </div>

              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Corporate Address Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dillibazar, Kathmandu, Nepal"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status Representative</label>
                  <select 
                    value={contactForm.status}
                    onChange={(e) => setContactForm({ ...contactForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="Active">Active status</option>
                    <option value="Inactive">Inactive status</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Reports To Person</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Shrestha"
                    value={contactForm.reportsTo}
                    onChange={(e) => setContactForm({ ...contactForm, reportsTo: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Is Primary Contact toggle checkbox */}
              <div className="flex items-center gap-2.5 py-1 select-none">
                <input 
                  type="checkbox" 
                  id="add-primary-cb"
                  checked={contactForm.isPrimary}
                  onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                />
                <label htmlFor="add-primary-cb" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Assign as the absolute Primary Representative of this account
                </label>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition">Complete Register</button>
                <button type="button" onClick={() => setIsAddOpen(false)} className="py-3 px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl transition">Discard</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL WINDOW 2: EDIT CONTACT DIALOG                                     */}
      {/* ======================================================================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 flex flex-col relative"
          >
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 mb-5 text-left">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Edit Contact details</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Modify profile settings and corporate ledger indexes</p>
              </div>
              <button 
                onClick={() => { setIsEditOpen(false); setEditingContactId(null); }} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateContactSubmit} className="space-y-4 text-left overflow-y-auto max-h-[75vh] pr-1">
              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact POC Full Name *</label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Designation Role *</label>
                  <input 
                    type="text" 
                    value={contactForm.role}
                    onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Corporate Department *</label>
                  <input 
                    type="text" 
                    value={contactForm.department}
                    onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Phone *</label>
                  <input 
                    type="text" 
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Alternate Phone</label>
                  <input 
                    type="text" 
                    value={contactForm.altPhone}
                    onChange={(e) => setContactForm({ ...contactForm, altPhone: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Verified Corporate Email *</label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Corporate Address Location</label>
                <input 
                  type="text" 
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status Representative</label>
                  <select 
                    value={contactForm.status}
                    onChange={(e) => setContactForm({ ...contactForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="Active">Active status</option>
                    <option value="Inactive">Inactive status</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Reports To Person</label>
                  <input 
                    type="text" 
                    value={contactForm.reportsTo}
                    onChange={(e) => setContactForm({ ...contactForm, reportsTo: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-1 select-none">
                <input 
                  type="checkbox" 
                  id="edit-primary-cb"
                  checked={contactForm.isPrimary}
                  onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                />
                <label htmlFor="edit-primary-cb" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Assign as the absolute Primary Representative of this account
                </label>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition">Commit Changes</button>
                <button type="button" onClick={() => { setIsEditOpen(false); setEditingContactId(null); }} className="py-3 px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl transition">Discard</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL WINDOW 3: ONBOARD CLIENT REGISTER DIALOG                          */}
      {/* ======================================================================= */}
      {isAddClientOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 flex flex-col relative"
          >
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 mb-5 text-left">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Onboard New Corporate Client</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Register a legal corporate entity for contracts and licensing</p>
              </div>
              <button onClick={() => setIsAddClientOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-250 text-slate-550 flex items-center justify-center font-bold text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-left overflow-y-auto max-h-[75vh] pr-1">
              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Corporate Legal Entity Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nepal Telecom Ltd."
                  value={newClientForm.clientName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, clientName: e.target.value, companyName: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Corporate Industry Sector *</label>
                <select 
                  value={newClientForm.clientGroup}
                  onChange={(e) => setNewClientForm({ ...newClientForm, clientGroup: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="IT & Software">IT & Software Systems</option>
                  <option value="Healthcare">Healthcare Clinics</option>
                  <option value="Trading">Trading Distributors</option>
                  <option value="Education">Education Centers</option>
                  <option value="Banking">Banking Institutes</option>
                  <option value="Retail">Retail Stores</option>
                  <option value="Travel & Tourism">Travel & Tourism Providers</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Primary POC Person Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Giri"
                    value={newClientForm.contactPerson}
                    onChange={(e) => setNewClientForm({ ...newClientForm, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Official Corporate Phone *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9851122334"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Verified Corporate Email *</label>
                  <input 
                    type="email" 
                    placeholder="e.g. billing@telecom.com.np"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Government Tax ID PAN *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 606112234"
                    value={newClientForm.panNumber}
                    onChange={(e) => setNewClientForm({ ...newClientForm, panNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-bold font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Headquarters City Address *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pokhara, Kaski, Nepal"
                  value={newClientForm.address}
                  onChange={(e) => setNewClientForm({ ...newClientForm, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer">Register Corporate Client</button>
                <button type="button" onClick={() => setIsAddClientOpen(false)} className="py-3 px-5 bg-slate-100 text-slate-650 hover:bg-slate-200 font-bold text-xs rounded-xl transition">Discard</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
