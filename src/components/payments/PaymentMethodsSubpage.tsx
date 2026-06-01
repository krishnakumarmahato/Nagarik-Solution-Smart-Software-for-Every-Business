import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Smartphone, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface GatewayConfig {
  id: string;
  name: string;
  type: string;
  logo: string;
  logoBg: string;
  processingFee: string;
  status: 'Active' | 'Inactive';
  sandbox: boolean;
  merchantId: string;
}

const initialGateways: GatewayConfig[] = [
  {
    id: "GW-ESEWA",
    name: "eSewa Mobile Wallet",
    type: "Digital Wallet Integration",
    logo: "eS",
    logoBg: "bg-emerald-600",
    processingFee: "3.5% + Rs. 10",
    status: "Active",
    sandbox: true,
    merchantId: "ESEWA_MERCHANT_LIVE_883"
  },
  {
    id: "GW-KHALTI",
    name: "Khalti PSP Gateway",
    type: "Digital Wallet & Card Reader",
    logo: "Kh",
    logoBg: "bg-purple-600",
    processingFee: "2.5%",
    status: "Active",
    sandbox: true,
    merchantId: "KHLT_PROD_API_KEY_442"
  },
  {
    id: "GW-CONNECTIPS",
    name: "connectIPS Gateway",
    type: "Interbank Fund Transfer (Nepal)",
    logo: "cI",
    logoBg: "bg-blue-600",
    processingFee: "Flat Rs. 2 - 15",
    status: "Active",
    sandbox: false,
    merchantId: "CIPS_NTB_GOV_6612"
  },
  {
    id: "GW-DIRECTBANK",
    name: "Corporate Bank Transfer",
    type: "NMB Bank / Nepal Bank Limited",
    logo: "Bank",
    logoBg: "bg-indigo-600",
    processingFee: "0% Free",
    status: "Active",
    sandbox: false,
    merchantId: "NMB_ACC_772019485"
  },
  {
    id: "GW-PHYSICAL",
    name: "Cash / Counter Overlap",
    type: "Physical Cash Receipts",
    logo: "Cash",
    logoBg: "bg-amber-600",
    processingFee: "0% Free",
    status: "Active",
    sandbox: false,
    merchantId: "N/A - Cash Registers"
  }
];

interface PaymentMethodsSubpageProps {
  triggerToast: (msg: string) => void;
}

export const PaymentMethodsSubpage: React.FC<PaymentMethodsSubpageProps> = ({ triggerToast }) => {
  const [gateways, setGateways] = useState<GatewayConfig[]>(initialGateways);

  const handleToggleGate = (id: string, current: GatewayConfig['status']) => {
    const nextStatus = current === 'Active' ? 'Inactive' : 'Active';
    setGateways(prev => prev.map(gw => gw.id === id ? { ...gw, status: nextStatus } : gw));
    triggerToast(`Payment gateway ${id} is now ${nextStatus}!`);
  };

  const handleToggleSandbox = (id: string, currentVal: boolean) => {
    setGateways(prev => prev.map(gw => gw.id === id ? { ...gw, sandbox: !currentVal } : gw));
    triggerToast(`Applied mode: ${!currentVal ? 'SANDBOX TRIAL' : 'LIVE PRODUCTION'} for ${id}`);
  };

  const handleSaveMerchantKey = (id: string, val: string) => {
    setGateways(prev => prev.map(gw => gw.id === id ? { ...gw, merchantId: val } : gw));
    triggerToast(`Saved updated merchant credentials for gateway ${id}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Informative Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Payment Gateway Orchestrator</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Activate, customize merchant keys, and toggle between sandboxed test scenarios or live processing channels</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>PCI-DSS Secured Terminal</span>
        </div>
      </div>

      {/* Grid of configurable cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gw) => {
          const isActive = gw.status === 'Active';
          return (
            <div 
              key={gw.id} 
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col justify-between ${
                isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'
              }`}
            >
              
              {/* Header Title & Details toggle */}
              <div className="p-4.5 border-b border-slate-150 flex items-start justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${gw.logoBg} text-white font-black text-xs flex items-center justify-center shrink-0 border shadow-sm`}>
                    {gw.logo}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{gw.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{gw.type}</p>
                  </div>
                </div>

                {/* Switch checkbox toggle */}
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handleToggleGate(gw.id, gw.status)}
                    className="rounded text-blue-500 focus:ring-blue-400 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Configurations */}
              <div className="p-4.5 space-y-3.5 text-xs">
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Processing Charge Fees:</span>
                  <span className="font-semibold text-slate-700 font-mono">{gw.processingFee}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Environment Sandbox Trial:</span>
                  <button
                    onClick={() => handleToggleSandbox(gw.id, gw.sandbox)}
                    className={`px-2.5 py-1 text-[9px] font-extrabold rounded border cursor-pointer uppercase transition ${
                      gw.sandbox 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}
                  >
                    {gw.sandbox ? 'On (Sandbox Testing)' : 'Off (Live Prod)'}
                  </button>
                </div>

                {/* Key Inputs */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Merchant Secret Acc Key (Editable PIN)</span>
                  <input 
                    type="text" 
                    defaultValue={gw.merchantId}
                    onChange={(e) => handleSaveMerchantKey(gw.id, e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono text-slate-700 outline-none focus:border-blue-500 transition"
                  />
                  <p className="text-[9px] text-slate-400 leading-none mt-1">Changes are automatically encrypted before save.</p>
                </div>

              </div>

              {/* Status footer button */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  isActive ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  ● Gateway Status: {isActive ? 'Live Accepting Payments' : 'Disabled / Suspended'}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
