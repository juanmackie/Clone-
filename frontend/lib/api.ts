const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchPosts() {
  const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchUser(username: string) {
  const res = await fetch(`${API_URL}/posts/user/${username}`, { cache: 'no-store' });
  if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch user');
  }
  return res.json();
}
