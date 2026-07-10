import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ogs from 'open-graph-scraper';

export interface LinkCardData {
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
}

const FETCH_TIMEOUT_MS = 8000;
const CACHE_FILE = path.resolve('.cache/link-cards.json');

const cache = loadDiskCache();

function loadDiskCache(): Record<string, LinkCardData | null> {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveDiskCache() {
  try {
    mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch {
    // Best-effort cache; a write failure shouldn't break the build.
  }
}

function resolveUrl(maybeUrl: string | undefined, base: string): string | undefined {
  if (!maybeUrl) return undefined;
  try {
    return new URL(maybeUrl, base).href;
  } catch {
    return undefined;
  }
}

export async function fetchLinkCardData(url: string): Promise<LinkCardData | null> {
  if (url in cache) return cache[url];

  let data: LinkCardData | null = null;
  try {
    const { error, result } = await ogs({ url, timeout: FETCH_TIMEOUT_MS });
    if (!error && result.success) {
      const title = result.ogTitle || result.twitterTitle || result.dcTitle;
      if (title) {
        data = {
          url,
          title,
          description: result.ogDescription || result.twitterDescription,
          image: resolveUrl(result.ogImage?.[0]?.url, url),
          favicon: resolveUrl(result.favicon, url),
          siteName: result.ogSiteName,
        };
      }
    }
  } catch {
    data = null;
  }

  cache[url] = data;
  saveDiskCache();
  return data;
}
