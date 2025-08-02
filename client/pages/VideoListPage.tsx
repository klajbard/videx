import { useState } from "react";
import { BaseButton, Button, Input, VideoCard } from "../components";
import {
  getFilterParams,
  type SortBy,
  sortByOptions,
  useDebounce,
  useInfiniteScroll,
  useSortBy,
  useVideos,
} from "../hooks";

export const VideoListPage = ({ onAddVideo }: { onAddVideo: () => void }) => {
  const { sortBy, setSortBy } = useSortBy();
  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useVideos(
    getFilterParams(sortBy, search),
  );

  const observerRef = useInfiniteScroll<HTMLOutputElement>({
    fetchNextPage,
    hasNextPage,
    isLoading: isFetchingNextPage,
  });

  const allVideos = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div className="relative grow w-full">
          <label htmlFor="search-input" className="sr-only">
            Search videos by title
          </label>
          <Input
            id="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by title"
            aria-describedby="search-instructions"
          />
          {searchValue && (
            <BaseButton
              className="absolute right-1 top-2 bottom-0 size-6 flex items-center justify-center"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
              title="Clear search"
            >
              <span aria-hidden="true">×</span>
            </BaseButton>
          )}
        </div>
        <div className="grow" />
        <div className="flex items-center space-x-2 shrink-0">
          <label htmlFor="sort-order" className="text-sm font-medium text-gray-700">
            Sort by date:
          </label>
          <select
            id="sort-order"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="border border-gray-800 rounded-md px-3 py-2 leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="sort-instructions"
          >
            {Object.entries(sortByOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onAddVideo}>Add Video</Button>
      </div>

      {isLoading && (
        <output className="flex justify-center py-8" aria-live="polite">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
          <span className="sr-only">Loading videos...</span>
        </output>
      )}

      {!isLoading && allVideos.length === 0 && (
        <output className="text-center py-12" aria-live="polite">
          <p className="text-gray-500 text-lg">No videos found</p>
        </output>
      )}

      {!isLoading && allVideos.length > 0 && (
        <section aria-label="Video list">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {hasNextPage && (
        <output ref={observerRef} className="flex justify-center py-6" aria-live="polite">
          {isFetchingNextPage && (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
              <span className="sr-only">Loading more videos...</span>
            </>
          )}
        </output>
      )}

      {/* For screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {!isLoading && allVideos.length > 0 && `${allVideos.length} videos found`}
      </div>
    </div>
  );
};
