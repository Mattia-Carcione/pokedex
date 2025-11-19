import type { AstroGlobal } from 'astro';
import { BASE_PATH, LOCAL_URL } from '../const';

export function getCanonicalUrl(Astro: AstroGlobal): URL {
  try {
    const pathname = Astro.url?.pathname ?? `${BASE_PATH}/`;
    const base = Astro.site ?? LOCAL_URL;
    return new URL(pathname, base);
  } catch (err) {
    throw new Error(`getCanonicalUrl failed. \n Error: ${err}`);
  }
}