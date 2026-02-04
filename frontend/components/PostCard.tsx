'use client';

import Link from 'next/link';
import { Heart, MessageSquare, Repeat2, Share, MoreHorizontal } from 'lucide-react';

interface PostProps {
  post: {
    id: number;
    content: string;
    created_at: string;
    username: string;
    avatar_url: string;
    user_id: number;
    like_count: string | number;
    reply_count: string | number;
    retweet_count: string | number;
  };
}

export default function PostCard({ post }: PostProps) {
  return (
    <div className="border-b border-slate-800 p-4 hover:bg-slate-900/20 transition-all cursor-pointer group">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Link href={`/${post.username}`} onClick={(e) => e.stopPropagation()}>
            <div className="relative group">
                <img 
                src={post.avatar_url} 
                alt={post.username} 
                className="w-12 h-12 rounded-full bg-slate-800 border border-transparent group-hover:border-violet-500 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1 min-w-0">
                <Link href={`/${post.username}`} onClick={(e) => e.stopPropagation()} className="font-bold text-slate-100 hover:underline truncate">
                {post.username}
                </Link>
                <span className="text-slate-500 text-sm truncate">@{post.username}</span>
                <span className="text-slate-500 text-sm">·</span>
                <span className="text-slate-500 text-sm hover:underline">{new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <button className="text-slate-500 hover:text-violet-400 hover:bg-violet-400/10 p-1.5 rounded-full transition-all">
                <MoreHorizontal size={16} />
            </button>
          </div>
          
          <p className="text-[15px] text-slate-200 leading-normal mb-3 break-words">
            {post.content}
          </p>
          
          <div className="flex justify-between items-center max-w-md text-slate-500">
            <button title="Reply" className="flex items-center gap-2 group/btn hover:text-violet-400 transition-all">
              <div className="p-2 rounded-full group-hover/btn:bg-violet-400/10">
                <MessageSquare size={18} />
              </div>
              <span className="text-xs">{post.reply_count || 0}</span>
            </button>
            <button title="Re-sync" className="flex items-center gap-2 group/btn hover:text-green-400 transition-all">
              <div className="p-2 rounded-full group-hover/btn:bg-green-400/10">
                <Repeat2 size={18} />
              </div>
              <span className="text-xs">{post.retweet_count || 0}</span>
            </button>
            <button title="Endorse" className="flex items-center gap-2 group/btn hover:text-rose-400 transition-all">
              <div className="p-2 rounded-full group-hover/btn:bg-rose-400/10">
                <Heart size={18} />
              </div>
              <span className="text-xs">{post.like_count || 0}</span>
            </button>
            <button title="Share" className="flex items-center gap-2 group/btn hover:text-violet-400 transition-all">
              <div className="p-2 rounded-full group-hover/btn:bg-violet-400/10">
                <Share size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}