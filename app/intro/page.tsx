"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleVideoEnd = () => {
      sessionStorage.setItem("hasSeenIntro", "true");
      router.push("/");
    };

    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (video && video.duration) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", handleVideoEnd);
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (video) {
        video.removeEventListener("ended", handleVideoEnd);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [router]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-[50vw] h-[50vh]"
          autoPlay
          playsInline
          muted
        >
          <source src="/intro-vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-3/4 max-w-md ">
          <div className="h-10 bg-transparent border-3 border-black rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
