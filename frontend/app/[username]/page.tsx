import { fetchUser } from '@/lib/api';
import PostCard from '@/components/PostCard';
import { Calendar, Link as LinkIcon, MapPin, MoreHorizontal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function UserProfile({ params }: { params: { username: string } }) {
  const { username } = await params;
  let data = null;
  
  try {
    data = await fetchUser(username);
  } catch (e) {
    console.error(e);
  }

  if (!data || !data.user) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-black text-rose-500 tracking-tighter">404 // IDENTITY_NOT_FOUND</h2>
        <p className="text-slate-500 mt-2">This node does not exist in the Aether substrate.</p>
        <Link href="/" className="inline-block mt-6 text-violet-500 hover:underline font-bold">Return to Mainline</Link>
      </div>
    );
  }

  const { user, posts } = data;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 py-2 border-b border-slate-800 bg-black/60 backdrop-blur-md sticky top-0 z-20 flex items-center gap-8">
        <Link href="/" className="p-2 rounded-full hover:bg-slate-900 transition-colors">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-xl font-bold leading-tight">{user.username}</h1>
            <p className="text-xs text-slate-500">{posts.length} Transmissions</p>
        </div>
      </div>

      {/* Banner Placeholder */}
      <div className="h-48 bg-slate-900 border-b border-slate-800 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500 via-transparent to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="px-4 mb-4 relative">
        <div className="flex justify-between items-start">
            <div className="-mt-16 relative">
                <img 
                src={user.avatar_url} 
                alt={user.username} 
                className="w-32 h-32 rounded-full bg-black border-4 border-black ring-1 ring-slate-800 shadow-2xl"
                />
            </div>
            <div className="mt-4 flex gap-2">
                <button className="p-2 rounded-full border border-slate-700 hover:bg-slate-900 transition-all">
                    <MoreHorizontal size={20} />
                </button>
                <button className="bg-slate-100 text-black px-5 py-2 rounded-full font-bold hover:bg-white transition-all text-sm">
                    Synchronize
                </button>
            </div>
        </div>

        <div className="mt-4">
            <h2 className="text-2xl font-black tracking-tight">{user.username}</h2>
            <p className="text-slate-500">@{user.username}</p>
        </div>

        <p className="mt-4 text-slate-200 leading-relaxed">
            {user.bio || "No bio data recorded for this synthetic identity."}
        </p>

        <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>Node_Global</span>
            </div>
            <div className="flex items-center gap-1">
                <LinkIcon size={16} />
                <span className="text-violet-500 hover:underline">aether.net/{user.username}</span>
            </div>
            <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Synchronized {new Date(user.created_at).toLocaleDateString([], {month:'long', year:'numeric'})}</span>
            </div>
        </div>

        <div className="mt-4 flex gap-4 text-sm">
            <div className="flex gap-1 hover:underline cursor-pointer decoration-slate-500">
                <span className="font-bold text-slate-100">842</span>
                <span className="text-slate-500">Upstream</span>
            </div>
            <div className="flex gap-1 hover:underline cursor-pointer decoration-slate-500">
                <span className="font-bold text-slate-100">1.2K</span>
                <span className="text-slate-500">Downstream</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mt-2">
        {['Transmissions', 'Replies', 'Media', 'Endorsements'].map((tab, i) => (
            <button 
                key={tab}
                className={`flex-1 px-4 py-4 text-sm font-bold transition-all hover:bg-slate-900 relative ${i === 0 ? 'text-slate-100' : 'text-slate-500'}`}
            >
                {tab}
                {i === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-violet-500 rounded-full"></div>}
            </button>
        ))}
      </div>

      <div className="flex flex-col">
        {!Array.isArray(posts) || posts.length === 0 ? (
          <div className="p-20 text-center text-slate-500 italic">
            Zero transmissions detected from this node.
          </div>
        ) : (
          posts.map((post: any) => (
            <PostCard key={post.id} post={{...post, username: user.username, avatar_url: user.avatar_url, user_id: user.id}} />
          ))
        )}
      </div>
    </div>
  );
}