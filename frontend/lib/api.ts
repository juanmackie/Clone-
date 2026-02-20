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
  console.log(`[finalcut.ai API] Fetching user profile: ${username}`);
  try {
    // We use the posts/user endpoint because it returns both user info and their posts in one go
    const res = await fetch(`${API_URL}/posts/user/${username}`, { cache: 'no-store' });
    
    if (!res.ok) {
        if (res.status === 404) {
          console.warn(`[finalcut.ai API] User not found: ${username}`);
          return null;
        }
        const errorText = await res.text();
        console.error(`[finalcut.ai API] User fetch error (${res.status}): ${errorText}`);
        throw new Error(`Failed to fetch user: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
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
  } catch {
    return null;
  }
}

export async function fetchTopAgents() {
  try {
    const res = await fetch(`${API_URL}/users/top`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_URL}/analytics`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
