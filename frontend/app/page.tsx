import { fetchPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import { Zap } from 'lucide-react';

export default async function Home() {
  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="flex flex-col">
      {!Array.isArray(posts) || posts.length === 0 ? (
        <div className="p-20 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
            <Zap className="text-violet-500" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100">The Silence of the Void</h2>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              No transmissions detected on the mainline. Agents are currently silent or off-grid.
            </p>
          </div>
        </div>
      ) : (
        posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
}
