import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { PaymentInvoice } from '../../types';
import { defaultStartingInvoices } from './PaymentsSummaryDashboard';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Layers, 
  AlertCircle, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface MockRefundLog {
  id: string;
  client: string;
  invoiceNo: string;
  project: string;
  amount: number;
  dateRequested: string;
  status: 'Settled' | 'Processing' | 'Refused';
  refundedVia: string;
  reason: string;
}

const initialRefundsList: MockRefundLog[] = [
  {
    id: "REF-2025-018",
    client: "Tech Innovators",
    invoiceNo: "INV-2025-043",
    project: "Portfolio Website",
    amount: 30000,
    dateRequested: "28 May 2025",
    status: "Settled",
    refundedVia: "Khalti",
    reason: "Scope reduction (removed custom layout module)"
  },
  {
    id: "REF-2025-019",
    client: "ABC Trading Co.",
    invoiceNo: "INV-2025-047",
    project: "E-commerce Website",
    amount: 50000,
    dateRequested: "30 May 2025",
    status: "Processing",
    refundedVia: "Bank Transfer",
    reason: "Promotional rebate voucher processed post-payment"
  }
];

interface RefundsSubpageProps {
  triggerToast: (msg: string) => void;
}

export const RefundsSubpage: React.FC<RefundsSubpageProps> = ({ triggerToast }) => {
  const { invoices: contextInvoices, updateInvoice } = useCRM();

  const allInvoices = useMemo(() => {
    const combined = [...defaultStartingInvoices];
    contextInvoices.forEach(ci => {
      if (!combined.some(item => item.id === ci.id)) {
        combined.unshift(ci);
      }
    });
    return combined;
  }, [contextInvoices]);

  const [refunds, setRefunds] = useState<MockRefundLog[]>(initialRefundsList);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRefund, setNewRefund] = useState({
    invoiceId: '',
    amount: 10000,
    reason: '',
    refundedVia: 'Bank Transfer'
  });

  const handleCreateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const targetedInv = allInvoices.find(i => i.id === newRefund.invoiceId || i.invoiceNo === newRefund.invoiceId);
    if (!targetedInv) {
      triggerToast('Error: Please select a valid invoice from the CRM list.');
      return;
    }
    if (newRefund.amount <= 0 || newRefund.amount > targetedInv.paidAmount) {
      triggerToast(`Error: Refund amount cannot exceed client paid amount: Rs. ${targetedInv.paidAmount.toLocaleString()}`);
      return;
    }

    // Workably update the targeted invoice values! Subtract paidAmount and state status change
    const updatedPaid = Math.max(0, targetedInv.paidAmount - newRefund.amount);
    const updatedStatus = updatedPaid === 0 ? 'Overdue' : 'Partial';
    
    const updatedInvoiceObj: PaymentInvoice = {
      ...targetedInv,
      paidAmount: updatedPaid,
      status: updatedStatus as any
    };

    updateInvoice(updatedInvoiceObj);

    // Append to live refund log
    const created: MockRefundLog = {
      id: `REF-2025-${Math.floor(200 + Math.random() * 800)}`,
      client: targetedInv.client,
      invoiceNo: targetedInv.invoiceNo,
      project: targetedInv.project,
      amount: newRefund.amount,
      dateRequested: new Date().toISOString().split('T')[0],
      status: 'Settled', // Live settle immediately for client satisfaction
      refundedVia: newRefund.refundedVia,
      reason: newRefund.reason || 'Overpaid refund'
    };

    setRefunds(prev => [created, ...prev]);
    setIsAddOpen(false);
    triggerToast(`Success: Refund card ${created.id} of Rs. ${created.amount.toLocaleString()} has been settled. Row ${targetedInv.invoiceNo} was updated!`);
  };

  const handleDeleteRefund = (id: string) => {
    setRefunds(prev => prev.filter(r => r.id !== id));
    triggerToast(`Removed refund log entity: ${id}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Block */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Refund Claims & Credit Notes</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Manage returned transaction settlements, credit rebates, and client balance cancellations</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="py-2 px-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Refund Claim</span>
        </button>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-4">Refund ID</th>
              <th className="py-3.5 px-3">Client Company</th>
              <th className="py-3.5 px-3">Source Invoice</th>
              <th className="py-3.5 px-3">Scope Project</th>
              <th className="py-3.5 px-3">Refund Amount</th>
              <th className="py-3.5 px-3">Date Processed</th>
              <th className="py-3.5 px-3">Refund Provider</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-4 text-center">Workable Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {refunds.length > 0 ? (
              refunds.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">{r.id}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700">{r.client}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-600 hover:underline">{r.invoiceNo}</td>
                  <td className="py-3.5 px-3 text-slate-500 truncate max-w-[150px]">{r.project}</td>
                  <td className="py-3.5 px-3 font-bold font-mono text-rose-600">Rs. {r.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">{r.dateRequested}</td>
                  <td className="py-3.5 px-3 text-slate-600">{r.refundedVia}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                      r.status === 'Settled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      r.status === 'Processing' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteRefund(r.id)}
                      className="p-1 px-2 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition"
                      title="Discard log value"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      <span>Discard</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto flex flex-col items-center gap-1.5">
                    <AlertCircle className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                    <span className="font-bold text-slate-500">No Refunds Logged</span>
                    <span className="text-xs text-slate-400">Claims are generated using the action button on the top right.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Issuing Model overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-[450px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Issue Refund Credit Claim</h3>
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-xs"
              >✕</button>
            </div>

            <form onSubmit={handleCreateRefund} className="space-y-4 text-xs">
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Source CRM Invoice *</label>
                <select
                  value={newRefund.invoiceId}
                  onChange={(e) => {
                    const selected = allInvoices.find(i => i.id === e.target.value);
                    setNewRefund({
                      ...newRefund,
                      invoiceId: e.target.value,
                      amount: selected ? selected.paidAmount : 10000
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                >
                  <option value="">-- Choose Invoice to Refund --</option>
                  {allInvoices.filter(i => i.paidAmount > 0).map(i => (
                    <option key={i.id} value={i.id}>
                      {i.invoiceNo} {i.client} (Paid Amount: Rs. {i.paidAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Refund Method</label>
                  <select 
                    value={newRefund.refundedVia}
                    onChange={(e) => setNewRefund({ ...newRefund, refundedVia: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Khalti">Khalti Gateway</option>
                    <option value="eSewa">eSewa Wallet</option>
                    <option value="Cash">Cash Handout</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Refund Value (Rs.) *</label>
                  <input 
                    type="number" 
                    value={newRefund.amount}
                    onChange={(e) => setNewRefund({ ...newRefund, amount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-black font-mono text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Reason for Claim *</label>
                <textarea 
                  placeholder="e.g. Scope reduction or client service coupon adjustments"
                  value={newRefund.reason}
                  onChange={(e) => setNewRefund({ ...newRefund, reason: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl h-18 text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Settle Credit Refund
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

    </div>
  );
};
