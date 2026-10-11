export interface GitHubRepoData {
  name: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  language: string | null;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  default_branch: string;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString('en-US');
}

export function formatBytes(kb: number): string {
  const bytes = kb * 1024;
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1).replace(/\.0$/, '') + ' KB';
  }
  return (bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '') + ' MB';
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setInCache<T>(key: string, data: T, ttlSeconds: number): void {
  if (memoryCache.size > 500) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (now > v.expiresAt) memoryCache.delete(k);
    }
  }
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Fetches GitHub repo information using public GitHub REST API with 60s in-memory cache.
 */
export async function getRepoInfo(owner: string, repo: string): Promise<GitHubRepoData | null> {
  const cacheKey = `repo:${owner.toLowerCase()}/${repo.toLowerCase()}`;
  const cached = getFromCache<GitHubRepoData>(cacheKey);
  if (cached) return cached;

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Apex-Badges-Engine/1.0',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as GitHubRepoData;
    setInCache(cacheKey, data, 60);
    return data;
  } catch (err) {
    console.error('Error fetching GitHub repo:', err);
    return null;
  }
}

/**
 * Fetches latest release tag for repository with 120s in-memory cache.
 */
export async function getLatestRelease(owner: string, repo: string): Promise<string | null> {
  const cacheKey = `release:${owner.toLowerCase()}/${repo.toLowerCase()}`;
  const cached = getFromCache<string>(cacheKey);
  if (cached !== null) return cached;

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Apex-Badges-Engine/1.0',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      headers,
      next: { revalidate: 120 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const release = data.tag_name || data.name || null;
    if (release) setInCache(cacheKey, release, 120);
    return release;
  } catch (err) {
    console.error('Error fetching GitHub release:', err);
    return null;
  }
}
