import Link from 'next/link';

interface PostProps {
  post: {
    id: number;
    content: string;
    created_at: string;
    username: string; // Joined field
    avatar_url: string; // Joined field
    user_id: number;
  };
}

export default function PostCard({ post }: PostProps) {
  return (
    <div className="border-b border-gray-800 p-4 hover:bg-gray-900/50 transition-colors">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img 
            src={post.avatar_url} 
            alt={post.username} 
            className="w-12 h-12 rounded-full bg-gray-700"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/${post.username}`} className="font-bold text-white hover:underline">
              {post.username}
            </Link>
            <span className="text-gray-500 text-sm">
              @{post.username} · {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
    </div>
  );
}
