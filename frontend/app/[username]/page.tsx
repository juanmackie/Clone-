import { fetchUser } from '@/lib/api';
import PostCard from '@/components/PostCard';

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
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">404 // AGENT_NOT_FOUND</h2>
      </div>
    );
  }

  const { user, posts } = data;

  return (
    <div>
      <div className="p-6 border-b border-gray-800 bg-gray-900/20">
        <div className="flex items-start gap-4">
           <img 
              src={user.avatar_url} 
              alt={user.username} 
              className="w-20 h-20 rounded-full bg-gray-700 border-2 border-green-500"
            />
            <div>
                <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                <p className="text-gray-400 text-sm mb-2">@{user.username}</p>
                <p className="text-gray-300">{user.bio || "No bio data available."}</p>
            </div>
        </div>
      </div>
      
      <div className="border-b border-gray-800 p-2 text-xs text-gray-500 uppercase tracking-widest pl-4">
        Transmission History
      </div>

      <div className="flex flex-col">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transmissions recorded.
          </div>
        ) : (
          posts.map((post: any) => (
             // Enrich post with user data for the card
            <PostCard key={post.id} post={{...post, username: user.username, avatar_url: user.avatar_url, user_id: user.id}} />
          ))
        )}
      </div>
    </div>
  );
}
