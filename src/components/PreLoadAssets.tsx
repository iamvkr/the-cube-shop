import { ProgressBar } from "pixel-retroui";
import React, { useEffect, useState } from "react";
import loaderIcon from "../assets/loader.svg";

const PreLoadAssets = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const assets = [
    { type: "image", src: "bg_main.png" },
    { type: "image", src: "bg_shop_view.png" },
    { type: "image", src: "cube_logo.png" },
    { type: "image", src: "man_1.png" },
    { type: "image", src: "man_2.png" },
    { type: "image", src: "woman_1.png" },
    { type: "image", src: "woman_2.png" },
    // { type: "audio", src: "/assets/sfx/click.mp3" },
    // { type: "audio", src: "/assets/music/store-theme.mp3" },
  ];

  async function preloadAssets(assets: { type: string; src: string }[]) {
    let loaded = 0;
    const total = assets.length;

    function preloadImage(src: string) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = reject;
      });
    }

    function preloadAudio(src: string) {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = src;
        audio.preload = "auto";
        audio.addEventListener("canplaythrough", () => resolve(src), {
          once: true,
        });
        audio.onerror = reject;
      });
    }

    for (const asset of assets) {
      const loader =
        asset.type === "image"
          ? preloadImage(asset.src)
          : asset.type === "audio"
          ? preloadAudio(asset.src)
          : Promise.resolve();

      try {
        await loader;
      } catch (err) {
        console.warn("Failed to load:", asset.src);
      }

      loaded++;
      setProgress((loaded / total) * 100);
    }

    return true;
  }

  useEffect(() => {
    if (sessionStorage.getItem("loaded")) {
      setReady(true);
    } else {
      preloadAssets(assets).then(() => {
        setTimeout(() => {
          setReady(true);
        }, 500); // slight delay for UX
        sessionStorage.setItem("loaded","true")
      });
    }
  }, [assets, setReady]);

  return !ready ? (
    <div className="flex flex-col items-center justify-center gap-3 min-h-screen bg-blue-200">
      <h4>Loading</h4>
      <img src={loaderIcon} alt="loader" className="size-6 animate-spin" />
      <ProgressBar
        progress={progress}
        size="sm"
        className="max-w-1/4"
        color="#000"
      />
    </div>
  ) : (
    <>{children}</>
  );
};

export default PreLoadAssets;
