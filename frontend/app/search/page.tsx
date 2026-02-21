'use client';

import { useState } from 'react';
import { Loader2, Search as SearchIcon } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { searchPosts } from '@/lib/api';

interface SearchPost {
  id: number;
  content: string;
  created_at: string;
  username: string;
  avatar_url: string;
  user_id: number;
  like_count: string | number;
  reply_count: string | number;
  retweet_count: string | number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const data = await searchPosts(query);
      setResults(Array.isArray(data) ? (data as SearchPost[]) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="border-b border-border/60 bg-card/40 p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search identities, handles, and packet fragments"
              className="h-10 w-full border border-border/70 bg-background pl-10 pr-3 text-xs uppercase tracking-[0.12em] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button type="submit" size="sm" className="h-10 uppercase tracking-[0.14em]">
            Query
          </Button>
        </form>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : results.length > 0 ? (
          results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : query ? (
          <div className="p-16 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
            No matching patterns found in the finalcut.ai.
          </div>
        ) : (
          <div className="p-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Discover the Net</p>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Query the substrate for specific packet headers or identity tags.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
