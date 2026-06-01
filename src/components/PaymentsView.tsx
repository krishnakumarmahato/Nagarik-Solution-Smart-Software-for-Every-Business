import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { PaymentInvoice } from '../types';
import { 
  PaymentsSummaryDashboard 
} from './payments/PaymentsSummaryDashboard';
import { 
  InvoicesSubpage 
} from './payments/InvoicesSubpage';
import { 
  RecurringPaymentsSubpage 
} from './payments/RecurringPaymentsSubpage';
import { 
  RefundsSubpage 
} from './payments/RefundsSubpage';
import { 
  PaymentMethodsSubpage 
} from './payments/PaymentMethodsSubpage';
import { 
  Calendar, 
  Plus, 
  Bell, 
  ChevronDown, 
  Receipt, 
  Printer, 
  FileText, 
  Maximize2,
  Lock,
  Sparkles,
  HelpCircle,
  Building2
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { 
    activePaymentSubTab, 
    setActivePaymentSubTab,
    addInvoice,
    invoices: contextInvoices
  } = useCRM();

  // Create invoice state triggers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Formal VAT Receipt printable display trigger
  const [receiptInvoice, setReceiptInvoice] = useState<PaymentInvoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Global Toast triggers
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Calendar toggle indicator
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('18 May – 18 Jun 2025');

  // Form builder fields
  const [newInv, setNewInv] = useState({
    client: '',
    project: '',
    amount: 1250000,
    dueDate: '2025-06-20',
    tax: 13, // 13% Nepalese VAT
    discount: 0,
    notes: '',
    paymentMethod: 'Bank Transfer'
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInv.client || !newInv.project) {
      triggerToast('Error: Please complete all required invoice fields.');
      return;
    }

    // Mathematical tax calculations
    const taxableTotal = Math.max(0, newInv.amount - newInv.discount);
    const computedTax = Math.round(taxableTotal * (newInv.tax / 100));

    addInvoice({
      client: newInv.client,
      project: newInv.project,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: newInv.dueDate,
      amount: newInv.amount,
      paidAmount: 0, // initially outstanding
      discount: newInv.discount,
      tax: computedTax,
      status: 'Overdue',
      paymentMethod: newInv.paymentMethod,
      notes: newInv.notes
    });

    setIsAddOpen(false);
    triggerToast(`Success: Generated new invoice for ${newInv.client}!`);
    
    // Clear Form inputs
    setNewInv({
      client: '',
      project: '',
      amount: 1250000,
      dueDate: '2025-06-20',
      tax: 13,
      discount: 0,
      notes: '',
      paymentMethod: 'Bank Transfer'
    });
  };

  const handleShowTaxInvoice = (inv: PaymentInvoice) => {
    setReceiptInvoice(inv);
    setIsReceiptOpen(true);
  };

  // Human descriptive breadcrumbs based on sub-navigation Selection
  const getSubTabBreadcrumb = () => {
    switch (activePaymentSubTab) {
      case 'invoices': return 'Invoices';
      case 'recurring-payments': return 'Recurring Payments';
      case 'refunds': return 'Refunds';
      case 'payment-methods': return 'Payment Methods';
      default: return 'All Payments';
    }
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto select-none bg-slate-50 font-sans p-6 space-y-6">
      
      {/* Dynamic Header Block (Matches the screenshot exactly) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        
        {/* Title and breadcrumb trail */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Payments</h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="cursor-pointer hover:text-blue-600">Dashboard</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-blue-600">Payments</span>
            <span>&gt;</span>
            <span className="text-blue-600 font-bold">{getSubTabBreadcrumb()}</span>
          </div>
        </div>

        {/* Global Toolbar Action Center */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Calendar Date pick button */}
          <div className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="py-2.5 px-3.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 flex items-center gap-2 hover:bg-slate-50 shadow-sm transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{selectedDateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCalendarOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 p-2 text-xs text-slate-700 font-medium">
                {['18 May – 18 Jun 2025', 'Last 30 Days', 'Last Quarter', 'This Fiscal Year'].map(range => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedDateRange(range);
                      setIsCalendarOpen(false);
                      triggerToast(`Applied date interval scope: ${range}`);
                    }}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-lg transition"
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "+ Add Invoice" Button inside Payments */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>

          {/* Notification bell with Red Badge '12' */}
          <button 
            onClick={() => triggerToast('You have 12 pending invoice approvals.')}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center justify-center relative cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              12
            </span>
          </button>

          {/* User profile picture widget: Sujan Karki */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              referrerPolicy="no-referrer"
              alt="Sujan Karki avatar"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="text-left hidden sm:block">
              <span className="text-xs font-black text-slate-800 block">Sujan Karki</span>
              <span className="text-[9.5px] text-slate-400 font-bold block">Marketing Executive</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </div>

        </div>

      </div>

      {/* Render subcomponents dynamically based on activePaymentSubTab */}
      <div className="flex-1">
        {activePaymentSubTab === 'invoices' && (
          <InvoicesSubpage
            onShowTaxInvoice={handleShowTaxInvoice}
            triggerToast={triggerToast}
            setIsAddModalOpen={setIsAddOpen}
          />
        )}

        {activePaymentSubTab === 'recurring-payments' && (
          <RecurringPaymentsSubpage triggerToast={triggerToast} />
        )}

        {activePaymentSubTab === 'refunds' && (
          <RefundsSubpage triggerToast={triggerToast} />
        )}

        {activePaymentSubTab === 'payment-methods' && (
          <PaymentMethodsSubpage triggerToast={triggerToast} />
        )}

        {(activePaymentSubTab === 'all-payments' || !activePaymentSubTab) && (
          <PaymentsSummaryDashboard
            onShowTaxInvoice={handleShowTaxInvoice}
            triggerToast={triggerToast}
            isAddModalOpen={isAddOpen}
            setIsAddModalOpen={setIsAddOpen}
          />
        )}
      </div>

      {/* Modal: Full Formal Printable Government Compliant VAT Tax Invoice overlay (exactly formatted like physical billing receipt) */}
      {isReceiptOpen && receiptInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="w-[660px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-6 relative max-h-[92vh] overflow-y-auto">
            
            {/* Modal Controls Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-blue-500" />
                <span>Internal VAT Tax Invoice Receipt</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                    triggerToast('Sent document request command to PDF spool printer');
                  }}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print VAT Receipt</span>
                </button>
                <button
                  onClick={() => setIsReceiptOpen(false)}
                  className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Tax Invoice Layout */}
            <div className="space-y-6 pt-1 text-slate-700">
              
              {/* Header logo, names, address, PAN numbers */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white">N</span>
                    <span>Nagarik Solution</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Software Development & Services</p>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1.5">Kathmandu Office, Bagmati, Nepal</span>
                  <span className="text-[10.5px] text-slate-800 font-extrabold block mt-0.5">Government PAN No: 606123456</span>
                </div>
                <div className="text-right">
                  <h3 className="text-[#f43f5e] text-lg font-black tracking-widest uppercase">TAX INVOICE</h3>
                  <span className="text-xs text-slate-800 font-mono font-bold block mt-1">Invoice Ref: {receiptInvoice.invoiceNo}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">Date: {receiptInvoice.invoiceDate}</span>
                </div>
              </div>

              <div className="h-px bg-slate-200/80 my-3" />

              {/* Bill To & Remit Details */}
              <div className="grid grid-cols-2 gap-6 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase mb-1">Billed Partner (Buyer)</span>
                  <p className="font-extrabold text-slate-900">{receiptInvoice.client}</p>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Project Context: {receiptInvoice.project}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase mb-1">Settle Details</span>
                  <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-black tracking-wider block w-max ${
                    receiptInvoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    receiptInvoice.status === 'Partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {receiptInvoice.status}
                  </span>
                  {receiptInvoice.paidOn && <span className="text-[10px] text-slate-500 font-medium mt-1">Paid Date: {receiptInvoice.paidOn}</span>}
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                      <th className="py-2.5 px-3">Itemized Scope & Scheduled Software Modules</th>
                      <th className="py-2.5 px-3 text-center w-12">Qty</th>
                      <th className="py-2.5 px-3 text-center w-28">Unit Price</th>
                      <th className="py-2.5 px-3 text-right w-28">Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800">{receiptInvoice.project}</p>
                        <span className="text-[10px] text-slate-400 leading-none">Full-stack modules, compliance setup, and API integrations with 24/7 technical help desk response</span>
                      </td>
                      <td className="py-3 px-3 text-center">1</td>
                      <td className="py-3 px-3 text-center font-mono">Rs. {(receiptInvoice.amount - receiptInvoice.tax).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">Rs. {(receiptInvoice.amount - receiptInvoice.tax).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Area layout matches details exactly */}
              <div className="w-60 ml-auto space-y-1.5 text-xs text-slate-600 font-semibold pt-2">
                <div className="flex justify-between">
                  <span>Taxable Subtotal</span>
                  <span className="font-mono text-slate-700">Rs. {(receiptInvoice.amount - receiptInvoice.tax).toLocaleString()}</span>
                </div>
                {receiptInvoice.discount > 0 && (
                  <div className="flex justify-between text-[#059669]">
                    <span>Coupon Deductions</span>
                    <span className="font-mono">-Rs. {receiptInvoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>State Government VAT (13%)</span>
                  <span className="font-mono text-slate-700">Rs. {receiptInvoice.tax.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-200 my-1" />
                <div className="flex justify-between text-slate-900 font-extrabold">
                  <span>Grand Total (Rs.)</span>
                  <span className="font-mono text-blue-900">Rs. {receiptInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#059669] font-bold">
                  <span>Amount Credited</span>
                  <span className="font-mono">Rs. {receiptInvoice.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Claim Balance Due</span>
                  <span className="font-mono font-extrabold">Rs. {(receiptInvoice.amount - receiptInvoice.paidAmount).toLocaleString()}</span>
                </div>
              </div>

              {receiptInvoice.transactionId && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-500">
                  <p>✓ Remittance Transaction ID: {receiptInvoice.transactionId}</p>
                  <p className="mt-0.5">✓ Secured Mobile Wallet Provider: {receiptInvoice.paymentMethod}</p>
                </div>
              )}

              {/* Sign-off section */}
              <div className="flex justify-between items-end mt-12 text-xs text-slate-400">
                <div>
                  <p>Generated by Nagarik CRM dispatcher.</p>
                  <p className="font-mono mt-0.5 font-bold">Requires no physical hand signature.</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-800 block">Amit Shrestha</span>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wide block mt-0.5">Finance Director, Nagarik Solution</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal: Create New Invoice Form dialog popup */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-[450px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Generate Client Tax Bill</h3>
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-xs"
              >✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Client Company Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Kathmandu Megamart Pvt Ltd"
                  value={newInv.client}
                  onChange={(e) => setNewInv({ ...newInv, client: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Standard Project Scope *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Inventory Management System installation"
                  value={newInv.project}
                  onChange={(e) => setNewInv({ ...newInv, project: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 font-semibold">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Due Date Target Limit</label>
                  <input 
                    type="date" 
                    value={newInv.dueDate}
                    onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Billing Channel Method</label>
                  <select 
                    value={newInv.paymentMethod}
                    onChange={(e) => setNewInv({ ...newInv, paymentMethod: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
                  >
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                    <option value="eSewa">eSewa Mobile Wallet</option>
                    <option value="Khalti">Khalti PSP Gateway</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-semibold">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gross Billing Value (Rs.) *</label>
                  <input 
                    type="number" 
                    value={newInv.amount}
                    onChange={(e) => setNewInv({ ...newInv, amount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold font-mono text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Promo Discount (Rs.)</label>
                  <input 
                    type="number" 
                    value={newInv.discount}
                    onChange={(e) => setNewInv({ ...newInv, discount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold font-mono text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Statutory Comments / Internal Memo</label>
                <textarea 
                  placeholder="Record taxation, milestones, or project comments..."
                  value={newInv.notes}
                  onChange={(e) => setNewInv({ ...newInv, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl h-16 text-slate-800 face-ring outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Confirm Tax Invoice
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)} 
                  className="py-2.5 px-4 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition"
                >
                  Discard
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Floating System Notification Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-850/60 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-[9999] text-xs font-bold animate-slide-left">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
