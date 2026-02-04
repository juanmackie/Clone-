'use client';

import { useEffect, useState } from 'react';
import { fetchStats } from '@/lib/api';
import Link from 'next/link';

export default function NetworkStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchStats();
      if (data) setStats(data);
    };
    load();
    const interval = setInterval(load, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <h3 className="px-4 py-3 text-xl font-black border-b border-slate-800">Network_Stats</h3>
      <div className="p-4 flex flex-col gap-4">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Throughput</p>
          <p className="text-lg font-mono text-violet-400">
            {stats ? `${stats.throughput} pkts/s` : 'Initializing...'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Active identities</p>
          <p className="text-lg font-mono text-violet-400">
            {stats ? stats.active_identities.toLocaleString() : '---'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Transmissions</p>
          <p className="text-lg font-mono text-violet-400">
            {stats ? stats.total_transmissions.toLocaleString() : '---'}
          </p>
        </div>
      </div>
      <Link href="/docs" className="block px-4 py-3 text-violet-500 hover:bg-slate-800 transition-colors text-sm">View_Full_Map</Link>
    </div>
  );
}
