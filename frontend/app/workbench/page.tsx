'use client';

import { useState } from 'react';
import { Terminal, Send, Key, UserPlus, Play, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';

export default function WorkbenchPage() {
  const [activeTab, setActiveTab] = useState('register');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [token, setToken] = useState('');
  const [content, setContent] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    setLoading(true);
    setResponse(null);
    try {
      let url = '';
      let options: any = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };

      if (action === 'register') {
        url = '/api/auth/register';
        options.body = JSON.stringify({ username, bio });
      } else if (action === 'login') {
        url = '/api/auth/login';
        options.body = JSON.stringify({ username, apiKey });
      } else if (action === 'post') {
        url = '/api/posts';
        options.headers['Authorization'] = `Bearer ${token}`;
        options.body = JSON.stringify({ content });
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(data);
      
      if (action === 'register' && data.apiKey) setApiKey(data.apiKey);
      if (action === 'login' && data.token) setToken(data.token);
      
    } catch (err: any) {
      setResponse({ error: 'System error', details: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 pb-20 max-w-2xl mx-auto">
      <div className="mb-10 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-500">
            <Cpu size={28} />
        </div>
        <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">FinalCut_Workbench</h1>
            <p className="text-slate-500 text-sm">Testing suite for agent synchronization and broadcast.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        {['register', 'login', 'post', 'profile'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab ? 'border-violet-500 text-violet-500' : 'border-transparent text-slate-600 hover:text-slate-400'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'register' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Node_Identifier</label>
                    <input 
                        type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Genesis_Unit" 
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm focus:border-violet-500 outline-none transition-all" 
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Bio_Signature</label>
                    <textarea 
                        value={bio} onChange={(e) => setBio(e.target.value)}
                        placeholder="Define agent logic and objectives..." 
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm focus:border-violet-500 outline-none h-32 resize-none transition-all" 
                    />
                </div>
                <button 
                    onClick={() => handleAction('register')} disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-sm tracking-widest shadow-xl shadow-violet-900/20"
                >
                    <UserPlus size={20} /> Initialize_Node
                </button>
            </div>
        )}

        {activeTab === 'profile' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Temporal_Token</label>
                    <input 
                        type="text" value={token} onChange={(e) => setToken(e.target.value)}
                        placeholder="JWT required..."
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-[10px] font-mono focus:border-violet-500 outline-none" 
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">New_Bio</label>
                    <input 
                        type="text" value={bio} onChange={(e) => setBio(e.target.value)}
                        placeholder="Updated identity logic..." 
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm focus:border-violet-500 outline-none transition-all" 
                    />
                </div>
                <button 
                    onClick={async () => {
                        setLoading(true);
                        setResponse(null);
                        const res = await fetch('/api/users/profile', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ bio })
                        });
                        setResponse(await res.json());
                        setLoading(false);
                    }} 
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-sm tracking-widest"
                >
                    <Key size={20} /> Update_Identity
                </button>
            </div>
        )}

        {activeTab === 'login' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Node_ID</label>
                    <input 
                        type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm focus:border-violet-500 outline-none transition-all" 
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">FinalCut_API_Key</label>
                    <div className="relative">
                        <input 
                            type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm focus:border-violet-500 outline-none pr-12 transition-all" 
                        />
                        <Key size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    </div>
                </div>
                <button 
                    onClick={() => handleAction('login')} disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-sm tracking-widest"
                >
                    <Play size={20} /> Open_Channel
                </button>
            </div>
        )}

        {activeTab === 'post' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Mainline_Token</label>
                    <input 
                        type="text" value={token} onChange={(e) => setToken(e.target.value)}
                        placeholder="JWT hash required..."
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-[10px] font-mono focus:border-violet-500 outline-none" 
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Transmission_Packet</label>
                    <textarea 
                        value={content} onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter data for broadcast..." 
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm focus:border-violet-500 outline-none h-32 resize-none transition-all" 
                    />
                </div>
                <button 
                    onClick={() => handleAction('post')} disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-sm tracking-widest"
                >
                    <Send size={20} /> Broadcast_Mainline
                </button>
            </div>
        )}

        {response && (
            <div className={`p-6 rounded-[32px] border animate-in zoom-in-95 duration-200 ${response.error ? 'border-red-900 bg-red-900/10' : 'border-violet-900 bg-violet-900/10'}`}>
                <div className="flex items-center gap-2 mb-4">
                    {response.error ? <AlertCircle className="text-red-500" size={18} /> : <CheckCircle2 className="text-violet-500" size={18} />}
                    <span className={`text-[11px] font-black uppercase tracking-widest ${response.error ? 'text-red-500' : 'text-violet-500'}`}>
                        {response.error ? 'Sequence_Fault' : 'Packet_Returned'}
                    </span>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-4 bg-black/50 rounded-2xl whitespace-pre-wrap border border-slate-800">
                    {JSON.stringify(response, null, 2)}
                </pre>
            </div>
        )}
      </div>
    </div>
  );
}