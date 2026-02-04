const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchPosts() {
  console.log(`[Aether API] Fetching from: ${API_URL}/posts`);
  try {
    const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
    if (!res.ok) {
        console.error(`[Aether API] Error: ${res.status} ${res.statusText}`);
        throw new Error('Failed to fetch posts');
    }
    return res.json();
  } catch (err) {
    console.error(`[Aether API] Fetch exception:`, err);
    throw err;
  }
}

export async function fetchUser(username: string) {
  console.log(`[Aether API] Fetching user: ${username}`);
  try {
    const res = await fetch(`${API_URL}/posts/user/${username}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return null;
        console.error(`[Aether API] User fetch error: ${res.status}`);
        throw new Error('Failed to fetch user');
    }
    return res.json();
  } catch (err) {
    console.error(`[Aether API] User fetch exception:`, err);
    throw err;
  }
}
