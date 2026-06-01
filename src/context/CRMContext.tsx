import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, Demo, Proposal, Client, Campaign, PaymentInvoice, ProductPackage } from '../types';
import {
  initialWebsiteLeads,
  initialSoftwareLeads,
  initialSocialMediaLeads,
  initialDemos,
  initialProposals,
  initialClients,
  initialCampaigns,
  initialInvoices,
  initialPackages,
  mockUsers
} from '../data';

interface CRMContextType {
  leads: Lead[];
  demos: Demo[];
  proposals: Proposal[];
  clients: Client[];
  campaigns: Campaign[];
  invoices: PaymentInvoice[];
  packages: ProductPackage[];
  currentUser: typeof mockUsers[0];
  switchUser: (id: string) => void;
  
  // Tabs & Navigation State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeLeadSubTab: string;
  setActiveLeadSubTab: (subTab: string) => void;
  activeCallSubTab: string;
  setActiveCallSubTab: (subTab: string) => void;
  activeDemoSubTab: string;
  setActiveDemoSubTab: (subTab: string) => void;
  activeProposalSubTab: string;
  setActiveProposalSubTab: (subTab: string) => void;
  activePackageSubTab: string;
  setActivePackageSubTab: (subTab: string) => void;
  activeClientSubTab: string;
  setActiveClientSubTab: (subTab: string) => void;
  activePaymentSubTab: string;
  setActivePaymentSubTab: (subTab: string) => void;
  activeReportsSubTab: string;
  setActiveReportsSubTab: (subTab: string) => void;
  
  // Operations
  addLead: (lead: Omit<Lead, 'id'> & { idPrefix?: string }) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  
  addDemo: (demo: Omit<Demo, 'id'>) => void;
  updateDemo: (demo: Demo) => void;
  deleteDemo: (id: string) => void;
  
  addProposal: (proposal: Omit<Proposal, 'id' | 'proposalNo'>) => void;
  updateProposal: (proposal: Proposal) => void;
  
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  
  addInvoice: (invoice: Omit<PaymentInvoice, 'id' | 'invoiceNo'>) => void;
  updateInvoice: (invoice: PaymentInvoice) => void;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  addPackage: (pkg: Omit<ProductPackage, 'id'>) => void;
  updatePackage: (pkg: ProductPackage) => void;
  deletePackage: (id: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeLeadSubTab, setActiveLeadSubTab] = useState<string>('all');
  const [activeCallSubTab, setActiveCallSubTab] = useState<string>('all');
  const [activeDemoSubTab, setActiveDemoSubTab] = useState<string>('all');
  const [activeProposalSubTab, setActiveProposalSubTab] = useState<string>('all');
  const [activePackageSubTab, setActivePackageSubTab] = useState<string>('all');
  const [activeClientSubTab, setActiveClientSubTab] = useState<string>('contacts');
  const [activePaymentSubTab, setActivePaymentSubTab] = useState<string>('all-payments');
  const [activeReportsSubTab, setActiveReportsSubTab] = useState<string>('overview');
  
  // Database Collections state initialized with localStorage support
  const [leads, setLeads] = useState<Lead[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [invoices, setInvoices] = useState<PaymentInvoice[]>([]);
  const [packages, setPackages] = useState<ProductPackage[]>([]);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

  // Load from local storage or set initial values
  useEffect(() => {
    const storedLeads = localStorage.getItem('nagarik_leads');
    
    const wLeads = [...initialWebsiteLeads];
    const sLeads = [...initialSoftwareLeads];
    const smLeads = [...initialSocialMediaLeads];
    const allStartingLeads: Lead[] = [...wLeads, ...sLeads, ...smLeads];
    
    const parsedStored = storedLeads ? JSON.parse(storedLeads) : [];
    const hasCorrectStart = parsedStored.length > 0 && parsedStored[0].businessName === 'Himalayan Coffee House';
    
    if (storedLeads && hasCorrectStart) {
      setLeads(parsedStored);
    } else {
      setLeads(allStartingLeads);
      localStorage.setItem('nagarik_leads', JSON.stringify(allStartingLeads));
    }

    const storedDemos = localStorage.getItem('nagarik_demos');
    setDemos(storedDemos ? JSON.parse(storedDemos) : initialDemos);

    const storedProposals = localStorage.getItem('nagarik_proposals');
    setProposals(storedProposals ? JSON.parse(storedProposals) : initialProposals);

    const storedClients = localStorage.getItem('nagarik_clients');
    setClients(storedClients ? JSON.parse(storedClients) : initialClients);

    const storedCampaigns = localStorage.getItem('nagarik_campaigns');
    setCampaigns(storedCampaigns ? JSON.parse(storedCampaigns) : initialCampaigns);

    const storedInvoices = localStorage.getItem('nagarik_invoices');
    setInvoices(storedInvoices ? JSON.parse(storedInvoices) : initialInvoices);

    const storedPackages = localStorage.getItem('nagarik_packages');
    if (storedPackages) {
      const parsedPkgs = JSON.parse(storedPackages);
      if (parsedPkgs.length < 10) {
        setPackages(initialPackages);
        localStorage.setItem('nagarik_packages', JSON.stringify(initialPackages));
      } else {
        setPackages(parsedPkgs);
      }
    } else {
      setPackages(initialPackages);
    }

    const storedUser = localStorage.getItem('nagarik_active_user');
    if (storedUser) {
      const found = mockUsers.find(u => u.id === storedUser);
      if (found) setCurrentUser(found);
    }
  }, []);

  // Save changes to localStorage helper
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const switchUser = (id: string) => {
    const found = mockUsers.find(u => u.id === id);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('nagarik_active_user', id);
    }
  };

  // Lead CRUD
  const addLead = (leadData: Omit<Lead, 'id'> & { idPrefix?: string }) => {
    const prefix = leadData.idPrefix || 'L';
    const newId = `${prefix}-${Date.now().toString().slice(-4)}`;
    
    // Clean idPrefix from leadData before creating Lead object
    const { idPrefix, ...leadFields } = leadData;
    const newLead: Lead = { ...leadFields, id: newId };
    
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveToStorage('nagarik_leads', updated);
  };

  const updateLead = (updatedLead: Lead) => {
    const updated = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    setLeads(updated);
    saveToStorage('nagarik_leads', updated);
  };

  const deleteLead = (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    saveToStorage('nagarik_leads', updated);
  };

  // Demo CRUD
  const addDemo = (demoData: Omit<Demo, 'id'>) => {
    const newId = `D-${Date.now().toString().slice(-3)}`;
    const newDemo: Demo = { ...demoData, id: newId };
    const updated = [newDemo, ...demos];
    setDemos(updated);
    saveToStorage('nagarik_demos', updated);
  };

  const updateDemo = (updatedDemo: Demo) => {
    const updated = demos.map(d => d.id === updatedDemo.id ? updatedDemo : d);
    setDemos(updated);
    saveToStorage('nagarik_demos', updated);
  };

  const deleteDemo = (id: string) => {
    const updated = demos.filter(d => d.id !== id);
    setDemos(updated);
    saveToStorage('nagarik_demos', updated);
  };

  // Proposal CRUD
  const addProposal = (propData: Omit<Proposal, 'id' | 'proposalNo'>) => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newProp: Proposal = {
      ...propData,
      id: `P-${Date.now()}`,
      proposalNo: `PR-2026-${rand}`
    };
    const updated = [newProp, ...proposals];
    setProposals(updated);
    saveToStorage('nagarik_proposals', updated);
  };

  const updateProposal = (prop: Proposal) => {
    const updated = proposals.map(p => p.id === prop.id ? prop : p);
    setProposals(updated);
    saveToStorage('nagarik_proposals', updated);
  };

  // Client CRUD
  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newId = `C-${Date.now().toString().slice(-3)}`;
    const newClient: Client = { ...clientData, id: newId };
    const updated = [newClient, ...clients];
    setClients(updated);
    saveToStorage('nagarik_clients', updated);
  };

  const updateClient = (updatedClient: Client) => {
    const updated = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    setClients(updated);
    saveToStorage('nagarik_clients', updated);
  };

  // Invoice CRUD
  const addInvoice = (invData: Omit<PaymentInvoice, 'id' | 'invoiceNo'>) => {
    const rand = Math.floor(100 + Math.random() * 900);
    const newInvoice: PaymentInvoice = {
      ...invData,
      id: `INV-${Date.now()}`,
      invoiceNo: `INV-2026-${rand}`
    };
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    saveToStorage('nagarik_invoices', updated);
  };

  const updateInvoice = (updatedInv: PaymentInvoice) => {
    const updated = invoices.map(i => i.id === updatedInv.id ? updatedInv : i);
    setInvoices(updated);
    saveToStorage('nagarik_invoices', updated);
  };

  // Campaign CRUD
  const addCampaign = (campData: Omit<Campaign, 'id'>) => {
    const newId = `CP-${Date.now().toString().slice(-3)}`;
    const newCampaign: Campaign = { ...campData, id: newId };
    const updated = [newCampaign, ...campaigns];
    setCampaigns(updated);
    saveToStorage('nagarik_campaigns', updated);
  };

  const updateCampaign = (updatedCamp: Campaign) => {
    const updated = campaigns.map(c => c.id === updatedCamp.id ? updatedCamp : c);
    setCampaigns(updated);
    saveToStorage('nagarik_campaigns', updated);
  };

  const deleteCampaign = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    saveToStorage('nagarik_campaigns', updated);
  };

  // Packages CRUD
  const addPackage = (pkgData: Omit<ProductPackage, 'id'>) => {
    const newId = `PKG-${Date.now().toString().slice(-3)}`;
    const newPkg: ProductPackage = { ...pkgData, id: newId };
    const updated = [newPkg, ...packages];
    setPackages(updated);
    saveToStorage('nagarik_packages', updated);
  };

  const updatePackage = (updatedPkg: ProductPackage) => {
    const updated = packages.map(p => p.id === updatedPkg.id ? updatedPkg : p);
    setPackages(updated);
    saveToStorage('nagarik_packages', updated);
  };

  const deletePackage = (id: string) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    saveToStorage('nagarik_packages', updated);
  };

  return (
    <CRMContext.Provider value={{
      leads,
      demos,
      proposals,
      clients,
      campaigns,
      invoices,
      packages,
      currentUser,
      switchUser,
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
      addLead,
      updateLead,
      deleteLead,
      addDemo,
      updateDemo,
      deleteDemo,
      addProposal,
      updateProposal,
      addClient,
      updateClient,
      addInvoice,
      updateInvoice,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      addPackage,
      updatePackage,
      deletePackage
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
};
