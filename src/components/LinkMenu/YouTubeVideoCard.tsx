import { useState, useEffect, useRef } from "react";
import { useAtom, isLoading } from "@/stores/globalStore";
import { getRelativeTimeFromNow, getAbsoluteTimeElapsed } from "@/utils/";
import { gameTrailers } from "@/constants/appInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@/components/ui/skeleton";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export type VideoData = {
  url: string;
  id: string;
  uploadDate?: string | null;
  thumbnailURL: string;
  channelName: string;
  title: string;
  description: string;
};

const videoDataCache: Record<string, VideoData> = {};

export const YouTubeVideoCard = ({
  videoUrl,
  showChannelName = false,
  relativeDate = false,
  absoluteDate = true,
  className = "",
  openInNewTab = false,
}: {
  videoUrl: string;
  showChannelName?: boolean;
  relativeDate?: boolean;
  absoluteDate?: boolean;
  className?: string;
  openInNewTab?: boolean;
}) => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [_, setIsComponentLoading] = useAtom(isLoading);
  const thumbnailRef = useRef<HTMLImageElement>(null);

  /* 
    Update global loading state based on component loading status
  */
  useEffect(() => {
    const isComponentReady = !isVideoLoading && videoData !== null && thumbnailLoaded && error === null;

    if (!isComponentReady) {
      setIsComponentLoading(true);
    } else {
      setIsComponentLoading(false);
    }

    return () => {
      setIsComponentLoading(true);
    };
  }, [isVideoLoading, videoData, thumbnailLoaded, error, setIsComponentLoading]);

  /* 
    Fetch video data and manage caching
  */
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Check if data is already in cache
        if (videoDataCache[videoUrl]) {
          const cachedData = videoDataCache[videoUrl];
          setVideoData(cachedData);
          setUploadDate(cachedData.uploadDate || null);
          setIsVideoLoading(false);
          setThumbnailLoaded(true);
          return;
        }

        setIsVideoLoading(true);
        setError(null);
        setThumbnailLoaded(false);

        const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();

        const videoId = new URL(videoUrl).searchParams.get("v") || "";
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`; // Use max resolution thumbnail

        /* 
          Get upload date from appInfo
        */
        let uploadDateValue = null;
        const trailerInfo = gameTrailers.videos.find((video) => video.url === videoUrl);
        if (trailerInfo?.uploadDate) {
          uploadDateValue = trailerInfo.uploadDate;
          setUploadDate(uploadDateValue);
        }

        const newVideoData: VideoData = {
          ...data,
          thumbnailURL: thumbnailUrl,
          id: videoId,
          uploadDate: uploadDateValue,
        };

        // Store in cache and set state
        videoDataCache[videoUrl] = newVideoData;
        setVideoData(newVideoData);

        // Check if the thumbnail is already in cache
        if (thumbnailRef.current && thumbnailRef.current.complete) {
          setThumbnailLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
        setError("Failed to load video data");
      } finally {
        setIsVideoLoading(false);
      }
    };

    fetchVideoData();
  }, [videoUrl]);

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  /* 
   fallback to lower quality image if thumbnail fails to load
  */
  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://img.youtube.com/vi/${videoData?.id}/hqdefault.jpg`;
  };

  // Skeleton UI state that mimics styling layout of YouTube Card
  if (isVideoLoading) {
    return (
      <div className={`block w-full min-w-[250px] overflow-hidden rounded px-2 py-4 ${className}`}>
        {/* Title skeleton */}
        <Skeleton className="h-5 w-full" />

        {/* Author/date info */}
        <div className="mt-1 flex flex-col">
          {showChannelName && <Skeleton className="mt-1 h-3 w-2/3" />}
          {(relativeDate || absoluteDate) && <Skeleton className="mt-1 h-3 w-1/2" />}
        </div>

        {/* Thumbnail skeleton with 16:9 aspect ratio */}
        <div className="relative mt-2 w-full overflow-hidden rounded">
          <div className="relative aspect-video">
            <Skeleton className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error UI state that mimics styling layout of YouTube Card
  if (error || !videoData) {
    return (
      <div className={`block w-full min-w-[250px] overflow-hidden rounded px-2 py-4 ${className}`}>
        {/* Error title placeholder */}
        <Skeleton className="h-5 w-full" />
        <div className="mt-1 flex flex-col">
          <Skeleton className="mt-1 h-3 w-1/2" />
        </div>
        <div className="relative mt-2 w-full overflow-hidden rounded">
          <div className="relative aspect-video bg-zinc-800/50 shadow-2xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="min-w-full text-rose-500" />
              <p className="px-2 text-center text-sm text-rose-400">Failed to load video data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format display date based on component props. This prevents both relativeTime and absoluteTime props being used at the same time
  const displayDate = relativeDate && uploadDate ? getRelativeTimeFromNow(uploadDate) : absoluteDate && uploadDate ? getAbsoluteTimeElapsed(uploadDate) : null;

  return (
    <a
      href={videoData.url}
      target={openInNewTab ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`block w-full min-w-[250px] overflow-hidden rounded px-2 py-4 ${className}`}
    >
      <p className="line-clamp-1 text-sm font-bold text-slate-100 transition-opacity duration-300 ease-in-out">{videoData.title}</p>
      <div className="flex flex-col">
        {showChannelName && <p className="text-xs text-slate-100 transition-opacity duration-300 ease-in-out">{videoData.channelName}</p>}
        {displayDate && <p className="text-xs text-slate-100 transition-opacity duration-300 ease-in-out">{displayDate} ago</p>}
      </div>
      <div className="relative mt-2 w-full overflow-hidden rounded">
        <div className="relative aspect-video shadow-2xl">
          <img
            ref={thumbnailRef}
            src={videoData.thumbnailURL}
            alt={videoData.title}
            className={`absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-500 ease-in-out ${thumbnailLoaded ? "opacity-90" : "opacity-0"}`}
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailError}
          />
          <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${thumbnailLoaded ? "pointer-events-none opacity-0" : "opacity-70"}`}>
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    </a>
  );
};
