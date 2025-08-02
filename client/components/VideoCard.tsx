import type { VideoSchema } from "@/shared";
import { formatDate } from "../utils";

export const VideoCard = ({ video }: { video: VideoSchema }) => {
  return (
    <article className="bg-slate-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-slate-100 relative">
        <img
          src={video.thumbnail_url}
          alt={`Thumbnail for video: ${video.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/300x200?text=Placeholder";
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          <span className="sr-only">Video title: </span>
          {video.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          <span className="sr-only">Created on: </span>
          {formatDate(video.created_at)}
        </p>

        {video.tags && video.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1" aria-label="Video tags">
            {video.tags.map((tag) => (
              <li key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};
