/**
 * Types and interfaces for Nagarik Solution CRM
 */

export interface Lead {
  id: string;
  businessName: string;
  city?: string;
  contactPerson: string;
  contactRole?: string;
  phone: string;
  email: string;
  websiteStatus?: 'No Website' | 'Old Website' | 'Needs Redesign' | 'Business Website' | 'Ecommerce Website';
  suggestedPitch?: string;
  packageOffered?: string;
  leadPriority: 'Hot' | 'Warm' | 'Cold';
  followUpStatus: string;
  nextFollowUpDate: string;
  clientResponse?: 'Interested' | 'Under Review' | 'Very Interested' | 'Call Attempted' | 'Not Contacted' | 'Not Yet Contacted';
  assignedTo: string;
  remarks?: string;
  category: string; // Hospitality, Trading, Education, Healthcare, IT Services, etc.
  leadSource: string; // Website, Google Maps, Facebook, Referral, Walk-in, Website Form, LinkedIn, Instagram
  productInterest?: string; // Ecommerce System, Court Management System, School Software, eHMIS/NHMIS, Custom Software
  requirementType?: 'New Implementation' | 'Customization' | 'Custom Development';
  demoStatus?: 'Scheduled' | 'Completed' | 'In Progress' | 'Proposal Sent' | 'Proposal Accepted';
  dealValue?: number;
  leadScore?: number;
  lastActivity?: string;
  currentStage?: string;
  inquiryMessage?: string;
  platform?: string; // Facebook, Instagram, WhatsApp, Messenger, Telegram
  suggestedAction?: string;
  isDuplicate?: boolean;
  matchScore?: number;
  matchReason?: string;
  followUpDelayText?: string;
  productsInterestedText?: string;
}

export interface Demo {
  id: string;
  clientName: string;
  contactPerson: string;
  leadId?: string;
  productService: string;
  demoMode: 'Online' | 'On-site';
  demoDate: string;
  demoTime: string;
  demoStatus: 'Confirmed' | 'Scheduled' | 'Completed' | 'Pending' | 'No-Show' | 'Cancelled';
  assignedTo: string;
  outcomeNextStep: string;
  meetingLink?: string;
  demoAgenda?: string;
  remarksNotes?: string;
}

export interface ProposalItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  tax: number; // percentage, e.g., 13% for VAT
  discount: number; // flat value or percentage
}

export interface Proposal {
  id: string;
  proposalNo: string;
  client: string;
  project: string;
  productInterest?: string;
  amount: number;
  status: 'Accepted' | 'Sent' | 'Viewed' | 'Draft' | 'Rejected' | 'Expired';
  sentOn: string;
  validUntil: string;
  owner: string;
  lastActivity: string;
  items: ProposalItem[];
  notes?: string;
  history?: { date: string; action: string; user: string }[];
  files?: { name: string; size: string; url: string }[];
}

export interface Client {
  id: string;
  clientName: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  clientGroup: 'IT & Software' | 'Healthcare' | 'Trading' | 'Education' | 'Banking' | 'Retail' | 'Travel & Tourism';
  status: 'Active' | 'Inactive';
  joinedOn: string;
  panNumber: string;
  notes?: string;
  totalProjects: number;
  totalInvoices: number;
  totalPaid: number;
  totalOutstanding: number;
}

export interface Campaign {
  id: string;
  campaignName: string;
  type: 'Promotional' | 'Informational' | 'Event' | 'Re-engagement' | 'Transactional' | 'Survey';
  channel: 'Email' | 'WhatsApp' | 'SMS' | 'Social Media';
  targetAudience: string;
  sent: number;
  responses: number; // represents open / click count/reply rate
  openRate: number; // percentage
  clickRate: number; // percentage
  status: 'Active' | 'Completed' | 'Scheduled' | 'Draft';
  startDate: string;
  endDate: string;
  subject?: string;
  preheader?: string;
  analytics?: {
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

export interface PaymentInvoice {
  id: string;
  invoiceNo: string;
  client: string;
  project: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  discount: number;
  tax: number;
  status: 'Paid' | 'Partial' | 'Overdue';
  paymentMethod: string;
  paidOn?: string;
  transactionId?: string;
  notes?: string;
}

export interface ProductPackage {
  id: string;
  name: string;
  category: 'Software' | 'Websites' | 'Active Products' | 'Packages';
  type: string; // SaaS, Package, Custom, Subscription
  skuCode: string;
  sellingPrice: number;
  billingFrequency: 'year' | 'month' | 'one-time';
  status: 'Active' | 'Inactive';
  createdOn: string;
  description: string;
  features: string[];
}
