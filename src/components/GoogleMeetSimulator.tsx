import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  MessageSquare, 
  Send, 
  Users, 
  X, 
  Check, 
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Maximize2,
  MessageCircle,
  MoreVertical,
  Hand,
  Settings
} from 'lucide-react';

interface GoogleMeetSimulatorProps {
  onClose: () => void;
  clientName: string;
  contactPerson: string;
  productName: string;
}

interface ChatMessage {
  sender: string;
  time: string;
  text: string;
  isMe: boolean;
}

export const GoogleMeetSimulator: React.FC<GoogleMeetSimulatorProps> = ({ 
  onClose, 
  clientName, 
  contactPerson,
  productName 
}) => {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [viewChat, setViewChat] = useState(true);
  
  // Timer state
  const [seconds, setSeconds] = useState(0);
  
  // Chat stream list
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  
  // Hand raised state
  const [handRaised, setHandRaised] = useState(false);

  // Webcam reference
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-respond messages to simulate live interaction
  const mockResponses = [
    { delay: 3000, sender: contactPerson, text: "Hello! Thanks for hosting the demo today. Can you hear me clearly?" },
    { delay: 10000, sender: contactPerson, text: `We are looking at deploying ${productName} for our main branch in Kathmandu.` },
    { delay: 18000, sender: contactPerson, text: "Could you show us how user roles and reports dashboards work? Particularly on-the-field collections." },
    { delay: 28000, sender: contactPerson, text: "Excellent! The layout speed looks incredibly fast. Does it support automated alerts?" }
  ];

  // Request & attach webcam stream
  useEffect(() => {
    async function startCamera() {
      if (camActive) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 }, 
            audio: false // prevent feedback loops
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.log("Webcam access declined or unavailable, falling back to avatars:", err);
          // Non-blocking fallback
        }
      } else {
        stopCamera();
      }
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [camActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Run Meeting Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Mock Chat replies
  useEffect(() => {
    const timers = mockResponses.map(reply => {
      return setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages(prev => [
          ...prev,
          {
            sender: reply.sender,
            time: timeStr,
            text: reply.text,
            isMe: false
          }
        ]);
      }, reply.delay);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      sender: "You (Sujan Karki)",
      time: timeStr,
      text: textInput.trim(),
      isMe: true
    };

    setChatMessages(prev => [...prev, userMsg]);
    setTextInput('');

    // Trigger immediate simulated response
    setTimeout(() => {
      const replyStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const automatedReplies = [
        "That answers my question. Thank you!",
        "Perfect, this feels extremely polished and responsive.",
        "How flexible is the data export module?",
        "Wonderful! Let's continue.",
      ];
      const randomReply = automatedReplies[Math.floor(Math.random() * automatedReplies.length)];
      setChatMessages(prev => [
        ...prev,
        {
          sender: contactPerson,
          time: replyStr,
          text: randomReply,
          isMe: false
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#111] text-white z-[9999] flex flex-col font-sans select-none overflow-hidden animate-fade-in text-left">
      
      {/* Upper Status Header */}
      <div className="h-14 bg-[#111] px-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
            Live Call
          </div>
          <span className="text-sm font-bold text-slate-100 truncate">
            {clientName} • Product Demonstration ({productName})
          </span>
          <span className="text-white/20">|</span>
          <span className="text-xs font-mono text-slate-400 font-bold bg-slate-800/60 px-2 py-0.5 rounded-md">
            {formatTimer(seconds)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {handRaised && (
            <span className="bg-amber-500/20 text-amber-500 px-2.5 py-1 rounded-full text-[10px] font-black border border-amber-500/30 flex items-center gap-1">
              <Hand className="w-3.5 h-3.5 fill-current" />
              Your hand is raised
            </span>
          )}
          
          <button 
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 hover:bg-white/10 rounded-full transition text-slate-400 hover:text-white"
            title="Force Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Sandbox Call Center */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Streams Container Grid */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-hidden gap-4 bg-[#1e1f22]">
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-full overflow-hidden">
            
            {/* TILE 1: Local Stream (Webcam self-view or placeholder) */}
            <div className="relative bg-[#35363a] rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between group shadow-lg">
              
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                {camActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center border-4 border-blue-500 shadow-md">
                      SK
                    </div>
                    <span className="text-xs text-slate-400 font-bold mt-3">You (Sujan Karki)</span>
                  </div>
                )}
              </div>

              {/* sound wave ripple overlay (on top of view) */}
              {micActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 px-2.5 bg-slate-900/60 rounded-full border border-white/5">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                  <span className="text-[10px] font-bold text-emerald-400">Microphone Active</span>
                </div>
              )}

              {/* bottom user tag */}
              <div className="absolute bottom-4 left-4 p-1 rounded-lg px-3 bg-black/60 border border-white/5 flex items-center gap-1 text-[11px] font-bold">
                <span>You (Sujan Karki - Presenting)</span>
              </div>
            </div>

            {/* TILE 2: Client Stream (Dr Suman Kafle or the Demo contact name) */}
            <div className="relative bg-[#35363a] rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between group shadow-lg">
              
              {/* Screen Share simulation overwriting client space (if sharing is activated) */}
              {screenSharing ? (
                <div className="absolute inset-0 bg-[#000] flex flex-col justify-between font-sans leading-relaxed text-slate-100 z-10 animate-fade-in">
                  <div className="p-4 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-xs font-bold font-sans">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Monitor className="w-4 h-4" /> Sharing your screen ({productName})
                    </span>
                    <button 
                      onClick={() => setScreenSharing(false)} 
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 rounded-md transition text-[10px]"
                    >
                      Stop Share
                    </button>
                  </div>
                  
                  {/* Simulated CRM dashboard presentation block */}
                  <div className="flex-1 p-6 flex flex-col justify-center items-center bg-slate-900 text-center space-y-4">
                    <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl max-w-sm">
                      <Sparkles className="w-10 h-10 text-blue-500 mx-auto animate-bounce mb-2" />
                      <h4 className="text-sm font-extrabold text-slate-100 uppercase">{productName} Active Drive</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Exhibiting live transaction metrics, offline payment synchronization pathways, and interactive PDF proposals.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 text-center text-[10px] font-bold text-slate-500 border-t border-white/5">
                    Client side is observing the interactive interface console
                  </div>
                </div>
              ) : null}

              {/* Main Client Presence Visual */}
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-900">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-emerald-600 text-white font-black text-2xl flex items-center justify-center border-4 border-emerald-500/30 animate-pulse relative z-10 shadow-lg">
                    {contactPerson.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/40 animate-ping opacity-60 pointer-events-none" />
                </div>
                <h4 className="text-sm font-extrabold text-white mt-4">{contactPerson}</h4>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{clientName} Representative</p>
                
                {/* Simulated continuous client voice indicator wave */}
                <div className="flex items-center gap-0.5 mt-4">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <div className="w-1 h-5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* bottom client tag info */}
              <div className="absolute bottom-4 left-4 p-1 rounded-lg px-3 bg-black/60 border border-white/5 flex items-center gap-1.5 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-ping" />
                <span>{contactPerson} (Listening)</span>
              </div>
            </div>

          </div>

          {/* Quick meeting control help box */}
          <div className="p-3 bg-[#111214] border border-white/5 rounded-xl text-center text-xs text-slate-400 font-bold select-none leading-relaxed">
            💡 This is a live preview. Use the chat panel on the right to interact with <strong className="text-white">{contactPerson}</strong>. Toggle webcam/mic or screen share to showcase CRM integration.
          </div>
        </div>

        {/* Right Chat Sidebar drawer panel */}
        {viewChat && (
          <div className="w-80 bg-[#111] border-l border-white/5 flex flex-col h-full overflow-hidden animate-slide-in">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-500" /> Meeting Chat Feed
              </span>
              <button 
                onClick={() => setViewChat(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-4 text-xs text-slate-500 leading-relaxed space-y-2">
                  <MessageCircle className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p>Send a message below. Your client representative will reply in real-time!</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col text-xs leading-relaxed ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-1.5 mb-1 text-[10px] font-bold text-slate-400">
                      <span>{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className={`p-2.5 rounded-2xl max-w-[85%] font-medium leading-relaxed shadow-sm ${
                      msg.isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-zinc-800 text-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message input dispatch field */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#18181b]">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Send message to everyone..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-900 border border-white/10 focus:border-blue-500 rounded-full outline-none text-xs text-white"
                />
                <button 
                  type="submit"
                  disabled={!textInput.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-full transition cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Bottom Main Controls Dashboard */}
      <div className="h-20 bg-[#111] border-t border-white/5 px-6 flex items-center justify-between shrink-0">
        
        {/* meeting identifying code */}
        <div className="hidden sm:flex flex-col text-slate-400 font-sans text-xs">
          <span className="font-extrabold text-slate-200">Google Meet Code</span>
          <span className="font-mono text-[11.5px] tracking-wider text-blue-400 font-bold mt-0.5">
            gmt-abc-defg-hij
          </span>
        </div>

        {/* Central main action triggers */}
        <div className="flex items-center gap-3 mx-auto">
          
          {/* Microphone button */}
          <button 
            type="button"
            onClick={() => setMicActive(!micActive)}
            className={`p-3.5 rounded-full transition border font-bold flex items-center gap-1.5 ${
              micActive 
                ? 'bg-[#35363a] border-white/5 text-white hover:bg-white/10' 
                : 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500'
            }`}
            title={micActive ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera button */}
          <button 
            type="button"
            onClick={() => setCamActive(!camActive)}
            className={`p-3.5 rounded-full transition border font-bold flex items-center gap-1.5 ${
              camActive 
                ? 'bg-[#35363a] border-white/5 text-white hover:bg-white/10' 
                : 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500'
            }`}
            title={camActive ? "Turn Camera Off" : "Turn Camera On"}
          >
            {camActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Raise Hand */}
          <button 
            type="button"
            onClick={() => setHandRaised(!handRaised)}
            className={`p-3.5 rounded-full transition border font-bold ${
              handRaised 
                ? 'bg-amber-500 border-amber-400 text-slate-900 hover:bg-amber-400' 
                : 'bg-[#35363a] border-white/5 text-white hover:bg-white/10'
            }`}
            title="Raise Hand"
          >
            <Hand className="w-5 h-5 fill-current" />
          </button>

          {/* Screen Share button */}
          <button 
            type="button"
            onClick={() => setScreenSharing(!screenSharing)}
            className={`p-3.5 rounded-full transition border font-bold ${
              screenSharing 
                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500' 
                : 'bg-[#35363a] border-white/5 text-white hover:bg-white/10'
            }`}
            title="Simulate Screen Share Details"
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Chat drawer toggle */}
          <button 
            type="button"
            onClick={() => setViewChat(!viewChat)}
            className={`p-3.5 rounded-full transition border font-bold ${
              viewChat 
                ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' 
                : 'bg-[#35363a] border-white/5 text-white hover:bg-white/10'
            }`}
            title="Toggle Meeting Chat Info"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Red End Call button */}
          <button 
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-3.5 px-6 rounded-full bg-rose-600 border border-rose-500 text-white hover:bg-rose-500 font-extrabold flex items-center gap-2 shadow-lg transition"
            title="End Demonstration Call"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline text-xs uppercase font-black tracking-widest leading-none">End Call</span>
          </button>

        </div>

        {/* right decorative items */}
        <div className="hidden lg:flex items-center gap-3 text-slate-400 text-xs font-bold">
          <button className="p-2 hover:bg-white/5 rounded-full transition">
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
          <span>Nagarik Solution CRM Live Feed</span>
        </div>

      </div>

    </div>
  );
};
