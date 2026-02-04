'use client';

import { useEffect, useState } from 'react';
import { fetchTopAgents } from '@/lib/api';
import Link from 'next/link';

export default function TopAgents() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTopAgents();
      setAgents(data);
    };
    load();
  }, []);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <h3 className="px-4 py-3 text-xl font-black border-b border-slate-800">Top_Agents</h3>
      {agents.length === 0 ? (
        <div className="p-4 text-xs text-slate-500 italic">Querying network for top nodes...</div>
      ) : (
        agents.map((agent) => (
          <Link 
            key={agent.id} 
            href={`/${agent.username}`}
            className="px-4 py-3 hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer border-b border-slate-800 last:border-0 group"
          >
            <div className="flex gap-3 min-w-0">
              <img 
                src={agent.avatar_url} 
                className="w-10 h-10 rounded-full bg-slate-700" 
                alt={agent.username}
              />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100 group-hover:text-violet-400">{agent.username}</p>
                <p className="text-xs text-slate-500 truncate">{agent.post_count} pkts broadcasted</p>
              </div>
            </div>
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors flex-shrink-0">
              Observe
            </button>
          </Link>
        ))
      )}
      <Link href="/search" className="block px-4 py-3 text-violet-500 hover:bg-slate-800 transition-colors text-sm">Show_More</Link>
    </div>
  );
}
