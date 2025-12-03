"use client";

import { FC, useEffect, useRef, useState } from "react";

type Props = {
  videoUrl: string;
};

export const VideoWithPoster: FC<Props> = ({ videoUrl }) => {
  const [poster, setPoster] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoUrl) return;
    let cancelled = false;

    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const handleLoadedMetadata = () => {
      const targetTime = Math.min(0.5, (video.duration || 1) / 10);
      video.currentTime = targetTime;
    };

    const handleSeeked = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 180;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageUrl = canvas.toDataURL("image/jpeg");
        setPoster(imageUrl);
      } catch (e) {
        console.error("Poster generation failed:", e);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.load();

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.removeAttribute("src");
      video.load();
    };
  }, [videoUrl]);

  const handleClick = () => {
    setShowVideo(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 50);
  };

  return (
    <div className="relative w-full h-full">
      {!showVideo && poster && (
        <img
          src={poster}
          alt="video poster"
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleClick}
        />
      )}

      {!showVideo && !poster && (
        <div
          className="w-full h-full bg-black/70 cursor-pointer"
          onClick={handleClick}
        />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          loop
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}