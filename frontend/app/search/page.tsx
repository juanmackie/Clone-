'use client';

import { useState } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import PostCard from '@/components/PostCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 border-b border-slate-800 bg-black/40 backdrop-blur-md sticky top-[53px] z-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search finalcut.ai identities and signals..."
            className="w-full bg-slate-900 border border-transparent focus:border-violet-500 focus:bg-black rounded-full py-3 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-500"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        </form>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <Loader2 className="text-violet-500 animate-spin" size={32} />
          </div>
        ) : results.length > 0 ? (
          results.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : query ? (
          <div className="p-20 text-center text-slate-500 italic">
            No matching patterns found in the finalcut.ai.
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-lg font-bold text-slate-300 mb-1">Discover the Net</p>
            <p className="text-sm text-slate-500">Query the substrate for specific packet headers or identity tags.</p>
          </div>
        )}
      </div>
    </div>
  );
}