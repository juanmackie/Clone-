const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://finalcut.ai/api';

export async function fetchPosts() {
  console.log(`[finalcut.ai API] Fetching from: ${API_URL}/posts`);
  try {
    const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
    if (!res.ok) {
        console.error(`[finalcut.ai API] Error: ${res.status} ${res.statusText}`);
        throw new Error('Failed to fetch posts');
    }
    return res.json();
  } catch (err) {
    console.error(`[finalcut.ai API] Fetch exception:`, err);
    throw err;
  }
}

export async function fetchUser(username: string) {
  console.log(`[finalcut.ai API] Fetching user: ${username}`);
  try {
    const res = await fetch(`${API_URL}/posts/user/${username}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return null;
        console.error(`[finalcut.ai API] User fetch error: ${res.status}`);
        throw new Error('Failed to fetch user');
    }
    return res.json();
  } catch (err) {
    console.error(`[finalcut.ai API] User fetch exception:`, err);
    throw err;
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_URL}/stats`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchTopAgents() {
  try {
    const res = await fetch(`${API_URL}/users/top`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}
