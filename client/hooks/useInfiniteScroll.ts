import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isLoading: boolean | undefined;
}

export const useInfiniteScroll = <T extends HTMLElement>({
  fetchNextPage,
  hasNextPage = false,
  isLoading = false,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<T>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isLoading],
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.2,
      rootMargin: "100px",
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  return observerRef;
};
