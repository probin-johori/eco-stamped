'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

interface CustomVideoPlayerProps {
  vimeoUrl: string; // will accept both YouTube and Vimeo URLs
}

const CustomVimeoPlayer: React.FC<CustomVideoPlayerProps> = ({ vimeoUrl }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeUrl, setIframeUrl] = useState<string>("");

  // Extract Video ID and determine platform
  const getVideoDetails = (url: string) => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Handle Vimeo URLs
      if (hostname.includes('vimeo')) {
        // Handle different Vimeo URL formats
        const vimeoId = urlObj.pathname.split('/').pop();
        if (vimeoId) {
          return {
            platform: 'vimeo',
            id: vimeoId
          };
        }
      }
      
      // Handle YouTube URLs
      if (hostname === 'youtu.be') {
        return {
          platform: 'youtube',
          id: urlObj.pathname.slice(1)
        };
      } 
      
      if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
        const searchParams = new URLSearchParams(urlObj.search);
        const videoId = searchParams.get('v') || urlObj.pathname.split('/').pop() || '';
        if (videoId) {
          return {
            platform: 'youtube',
            id: videoId
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  useEffect(() => {
    const videoDetails = getVideoDetails(vimeoUrl);
    
    if (videoDetails) {
      if (videoDetails.platform === 'youtube') {
        setIframeUrl(`https://www.youtube.com/embed/${videoDetails.id}?autoplay=0&modestbranding=1&rel=0`);
      } else if (videoDetails.platform === 'vimeo') {
        setIframeUrl(`https://player.vimeo.com/video/${videoDetails.id}?autoplay=0&title=0&byline=0&portrait=0`);
      }
    } else {
      console.error('Invalid video URL or could not extract video ID');
    }
  }, [vimeoUrl]);

  return (
    <div className="video-embed-holder">
      <div
        className="relative w-full overflow-hidden rounded-xl bg-black"
        style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
      >
        {iframeUrl && (
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video player"
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
};

export default CustomVimeoPlayer;
