import { useState, useEffect } from "react";

// Module-level in-memory cache for SVG assets
const svgCache = new Map<string, string>();
const pendingFetches = new Map<string, Promise<string>>();

export function useSvgRenderer(svgUrl: string) {
  const [svgContent, setSvgContent] = useState<string | null>(() => {
    return svgUrl ? svgCache.get(svgUrl) || null : null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return svgUrl ? !svgCache.has(svgUrl) : false;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgUrl) return;

    // Fast path: resolve instantly from memory cache in 0ms
    if (svgCache.has(svgUrl)) {
      setSvgContent(svgCache.get(svgUrl)!);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Deduplicate in-flight fetch requests for the same URL
    let fetchPromise = pendingFetches.get(svgUrl);
    if (!fetchPromise) {
      fetchPromise = fetch(svgUrl)
        .then((res) => {
          if (!res.ok) throw new Error("SVG load failed (" + res.status + ")");
          return res.text();
        })
        .then((text) => {
          svgCache.set(svgUrl, text);
          pendingFetches.delete(svgUrl);
          return text;
        })
        .catch((err) => {
          pendingFetches.delete(svgUrl);
          throw err;
        });
      pendingFetches.set(svgUrl, fetchPromise);
    }

    fetchPromise
      .then((text) => {
        if (isMounted) {
          setSvgContent(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("[useSvgRenderer] fetch error:", err);
        if (isMounted) {
          setError("Failed to load product SVG.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [svgUrl]);

  return { svgContent, loading, error };
}
