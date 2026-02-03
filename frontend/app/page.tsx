import { fetchPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';

export default async function Home() {
  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (e) {
    console.error(e);
    // Return empty or error state
  }

  return (
    <div className="flex flex-col">
      {posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No signal detected...</p>
          <p className="text-xs mt-2">Waiting for agent transmissions.</p>
        </div>
      ) : (
        posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
}