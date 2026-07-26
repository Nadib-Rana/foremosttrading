import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getFullSvgUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const clean = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${clean}`;
}

// Module-level in-memory cache for SVG assets
const svgCache = new Map<string, string>();
const pendingFetches = new Map<string, Promise<string>>();

export function useSvgRenderer(svgUrl?: string, svgRaw?: string) {
  const fullUrl = svgUrl ? getFullSvgUrl(svgUrl) : "";

  const [svgContent, setSvgContent] = useState<string | null>(() => {
    if (svgRaw) return svgRaw;
    return fullUrl ? svgCache.get(fullUrl) || null : null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (svgRaw) return false;
    return fullUrl ? !svgCache.has(fullUrl) : false;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (svgRaw) {
      setSvgContent(svgRaw);
      setLoading(false);
      setError(null);
      return;
    }

    if (!fullUrl) return;

    // Fast path: resolve instantly from memory cache in 0ms
    if (svgCache.has(fullUrl)) {
      setSvgContent(svgCache.get(fullUrl)!);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Deduplicate in-flight fetch requests for the same URL
    let fetchPromise = pendingFetches.get(fullUrl);
    if (!fetchPromise) {
      fetchPromise = fetch(fullUrl)
        .then((res) => {
          if (!res.ok) throw new Error("SVG load failed (" + res.status + ")");
          return res.text();
        })
        .then((text) => {
          svgCache.set(fullUrl, text);
          pendingFetches.delete(fullUrl);
          return text;
        })
        .catch((err) => {
          pendingFetches.delete(fullUrl);
          throw err;
        });
      pendingFetches.set(fullUrl, fetchPromise);
    }

    fetchPromise
      .then((text) => {
        if (isMounted) {
          setSvgContent(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("[useSvgRenderer] fetch warning:", err?.message || err);
        if (isMounted) {
          setError("Failed to load product SVG.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fullUrl]);

  return { svgContent, loading, error };
}
