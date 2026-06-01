import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  Power, 
  PowerOff, 
  Clock, 
  Repeat, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface MockRecurringProfile {
  id: string;
  client: string;
  project: string;
  amount: number;
  interval: 'Monthly' | 'Quarterly' | 'Yearly';
  status: 'Active' | 'Paused' | 'Canceled';
  nextBillingDate: string;
}

const initialRecurringProfiles: MockRecurringProfile[] = [
  {
    id: "REC-2025-001",
    client: "SoftTech Solutions",
    project: "Retainer Nagarik CRM Support",
    amount: 150000,
    interval: "Monthly",
    status: "Active",
    nextBillingDate: "15 Jun 2025"
  },
  {
    id: "REC-2025-002",
    client: "ABC Trading Co.",
    project: "Premium E-commerce Maintenance",
    amount: 75000,
    interval: "Monthly",
    status: "Active",
    nextBillingDate: "20 Jun 2025"
  },
  {
    id: "REC-2025-003",
    client: "Himalayan Bank Ltd.",
    project: "Dedicated Cloud Server VPS Lease",
    amount: 320000,
    interval: "Monthly",
    status: "Active",
    nextBillingDate: "10 Jun 2025"
  },
  {
    id: "REC-2025-004",
    client: "Bright Future School",
    project: "LMS Annual Portal Renewal",
    amount: 180000,
    interval: "Yearly",
    status: "Paused",
    nextBillingDate: "15 May 2026"
  }
];

interface RecurringPaymentsSubpageProps {
  triggerToast: (msg: string) => void;
}

export const RecurringPaymentsSubpage: React.FC<RecurringPaymentsSubpageProps> = ({ triggerToast }) => {
  const [profiles, setProfiles] = useState<MockRecurringProfile[]>(initialRecurringProfiles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    client: '',
    project: '',
    amount: 50000,
    interval: 'Monthly' as 'Monthly' | 'Quarterly' | 'Yearly',
    status: 'Active' as 'Active' | 'Paused' | 'Canceled',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const handleToggleStatus = (id: string, currentStatus: MockRecurringProfile['status']) => {
    const nextStatusMap: Record<MockRecurringProfile['status'], MockRecurringProfile['status']> = {
      'Active': 'Paused',
      'Paused': 'Active',
      'Canceled': 'Active'
    };
    const nextStatus = nextStatusMap[currentStatus];
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    triggerToast(`Subscription ${id} is now ${nextStatus}!`);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    triggerToast(`Unsubscribed & deleted recurring profile: ${id}`);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.client || !newProfile.project) {
      triggerToast('Error: Please complete all required retainer properties.');
      return;
    }
    const created: MockRecurringProfile = {
      id: `REC-2025-${Math.floor(100 + Math.random() * 900)}`,
      client: newProfile.client,
      project: newProfile.project,
      amount: Number(newProfile.amount),
      interval: newProfile.interval,
      status: newProfile.status,
      nextBillingDate: newProfile.nextBillingDate
    };
    setProfiles(prev => [created, ...prev]);
    setIsAddOpen(false);
    triggerToast(`Success: Enrolled recurring retainer fee of Rs. ${created.amount.toLocaleString()} for ${created.client}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Retainer overview stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-4.5 rounded-2xl border border-slate-250 border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Active Retainer Contracts</span>
            <h4 className="text-lg font-black text-slate-800">{profiles.filter(p => p.status === 'Active').length} Profiles</h4>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Monthly MRR Potential</span>
            <h4 className="text-lg font-black text-emerald-600 font-mono">
              Rs. {profiles.reduce((acc, p) => p.status === 'Active' ? acc + (p.interval === 'Monthly' ? p.amount : Math.round(p.amount / 12)) : acc, 0).toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Paused Subscriptions</span>
              <h4 className="text-lg font-black text-amber-600">{profiles.filter(p => p.status === 'Paused').length} Retainers</h4>
            </div>
          </div>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Setup Retainer</span>
          </button>
        </div>

      </div>

      {/* Main ledger list */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-4">Profile Code</th>
              <th className="py-3.5 px-3">Retainer Client</th>
              <th className="py-3.5 px-3">Core Scope Reference</th>
              <th className="py-3.5 px-3">Fee Interval</th>
              <th className="py-3.5 px-3">Billing Amount</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Next Bill Date</th>
              <th className="py-3.5 px-4 text-center">Workable Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {profiles.length > 0 ? (
              profiles.map((p) => {
                const isActive = p.status === 'Active';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">{p.id}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{p.client}</td>
                    <td className="py-3.5 px-3 text-slate-500 truncate max-w-[200px]">{p.project}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#eff6ff] text-[#1e40af]">
                        {p.interval}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold font-mono text-slate-900">Rs. {p.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                        p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        p.status === 'Paused' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">{p.nextBillingDate}</td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Toggle active button */}
                        <button
                          onClick={() => handleToggleStatus(p.id, p.status)}
                          className={`p-1.5 rounded-lg border transition ${
                            isActive 
                              ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100/60' 
                              : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100/60'
                          }`}
                          title={isActive ? "Pause Retainer" : "Activate Retainer"}
                        >
                          {isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProfile(p.id)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100/60 transition"
                          title="Delete Retainer Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  <div className="max-w-sm mx-auto flex flex-col items-center gap-1.5">
                    <AlertCircle className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <span className="font-bold text-slate-500">No Retainers Registered</span>
                    <span className="text-xs text-slate-400">Create software retainers support agreements above.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Subscription Modal Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-[450px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Configure Retainer Profile</h3>
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-xs"
              >✕</button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-4 text-xs">
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Client Company Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nepal Tourism Board"
                  value={newProfile.client}
                  onChange={(e) => setNewProfile({ ...newProfile, client: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Monthly/Annual Support Scope *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dedicated AWS Engine & DevOps Retainer"
                  value={newProfile.project}
                  onChange={(e) => setNewProfile({ ...newProfile, project: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Billing Interval</label>
                  <select 
                    value={newProfile.interval}
                    onChange={(e) => setNewProfile({ ...newProfile, interval: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                  >
                    <option value="Monthly">Monthly Retainer</option>
                    <option value="Quarterly">Quarterly Retainer</option>
                    <option value="Yearly">Yearly Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Billing Retainer Fee (Rs.)</label>
                  <input 
                    type="number" 
                    value={newProfile.amount}
                    onChange={(e) => setNewProfile({ ...newProfile, amount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-black font-mono text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">First Scheduled Run Date</label>
                <input 
                  type="date" 
                  value={newProfile.nextBillingDate}
                  onChange={(e) => setNewProfile({ ...newProfile, nextBillingDate: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold font-mono"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Create Retainer Profile
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
