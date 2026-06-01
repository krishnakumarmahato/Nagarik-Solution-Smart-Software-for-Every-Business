import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { PaymentInvoice } from '../../types';
import { defaultStartingInvoices } from './PaymentsSummaryDashboard';
import { 
  FileText, 
  Printer, 
  Download, 
  Mail, 
  Sparkles, 
  Eye, 
  RefreshCw, 
  Plus, 
  Lock, 
  Layers, 
  CheckCircle,
  Clock,
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface InvoicesSubpageProps {
  onShowTaxInvoice: (invoice: PaymentInvoice) => void;
  triggerToast: (msg: string) => void;
  setIsAddModalOpen: (open: boolean) => void;
}

export const InvoicesSubpage: React.FC<InvoicesSubpageProps> = ({
  onShowTaxInvoice,
  triggerToast,
  setIsAddModalOpen
}) => {
  const { invoices: contextInvoices } = useCRM();

  const allInvoices = useMemo(() => {
    const combined = [...defaultStartingInvoices];
    contextInvoices.forEach(ci => {
      if (!combined.some(item => item.id === ci.id)) {
        combined.unshift(ci);
      }
    });
    return combined;
  }, [contextInvoices]);

  const [selectedTemplate, setSelectedTemplate] = useState('GovVAT');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'overdue'>('all');

  const filteredInvoices = useMemo(() => {
    if (activeTab === 'all') return allInvoices;
    if (activeTab === 'overdue') return allInvoices.filter(i => i.status === 'Overdue');
    return allInvoices.filter(i => i.status === 'Partial'); // as draft representations
  }, [allInvoices, activeTab]);

  return (
    <div className="space-y-6">
      
      {/* Visual Header Option and Template selection bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Invoice Template Registry</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Select a compliant legal billing template preset for generation and quick PDF dispatch</p>
        </div>

        {/* Templates selector option triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'GovVAT', label: 'Government VAT Invoice (PAN)', icon: Sparkles },
            { key: 'CorpS', label: 'Corporate Billing Client Statement', icon: Layers },
            { key: 'SimpleS', label: 'Simple Standard Receipt', icon: FileText }
          ].map((temp) => {
            const isSel = selectedTemplate === temp.key;
            return (
              <button
                key={temp.key}
                onClick={() => {
                  setSelectedTemplate(temp.key);
                  triggerToast(`Applied billing visual theme: ${temp.label}`);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                  isSel 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <temp.icon className="w-3.5 h-3.5" />
                <span>{temp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of details: Interactive tab switcher on the left (takes 7 columns) and Templates gallery on the right (takes 5 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List block */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                    activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Invoices ({allInvoices.length})
                </button>
                <button
                  onClick={() => setActiveTab('overdue')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                    activeTab === 'overdue' ? 'bg-red-50 text-red-700 border border-red-200' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Overdue Bills ({allInvoices.filter(i => i.status === 'Overdue').length})
                </button>
                <button
                  onClick={() => setActiveTab('draft')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                    activeTab === 'draft' ? 'bg-amber-100/60 text-amber-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Partial drafts ({allInvoices.filter(i => i.status === 'Partial').length})
                </button>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg shadow cursor-pointer transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <div 
                  key={inv.id} 
                  className="p-4 hover:bg-slate-50/30 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 font-bold shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 font-mono text-sm">{inv.invoiceNo}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          inv.status === 'Partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <h4 className="text-slate-700 font-medium mt-1">{inv.client}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{inv.project}</p>
                    </div>
                  </div>

                  {/* Pricing / Actions */}
                  <div className="flex flex-row sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-1">
                    <span className="font-mono font-black text-slate-900 text-sm">
                      Rs. {inv.amount.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        onClick={() => onShowTaxInvoice(inv)}
                        className="p-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-100 transition font-bold text-[11px] text-slate-700 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                      <button
                        onClick={() => triggerToast(`CRM: Bill Invoice ${inv.invoiceNo} duplicate was sent to client: ${inv.client}`)}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                        title="Send PDF Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">Showing {filteredInvoices.length} billing entries fully calculated inside current selection context.</p>
          </div>
        </div>

        {/* Right Help block */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute right-[-15px] top-[-15px] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-sm font-bold tracking-tight mb-2">Nepalese VAT Compliance</h4>
            <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
              All invoice formats automatically compute the Government compliant 13% statutory VAT.
              Ensure you record valid PAN/VAT registration codes inside Client properties before export.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Government PAN verified layout</span>
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm text-xs">
            <h4 className="font-bold text-slate-800 mb-2">Common Billing Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => triggerToast('Initiated batch PDF spooling for outstanding claims.')}
                className="w-full text-left py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer font-medium text-slate-700"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Batch Download Pending (PDF)</span>
              </button>
              <button
                onClick={() => triggerToast('Generated aggregate quarterly taxation file for Inland Revenue Office (IRD).')}
                className="w-full text-left py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer font-medium text-slate-700"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Compile Quarterly VAT statement</span>
              </button>
              <button
                onClick={() => triggerToast('Compliance dispatch: Emailed overdue statements to active administrators.')}
                className="w-full text-left py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer font-medium text-slate-700"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Send Batch Overdue Reminders</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
