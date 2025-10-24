import { ProgressBar } from "pixel-retroui";
import React, { useEffect, useState } from "react";
import loaderIcon from "../assets/loader.svg";
import { getRandom } from "../utils";

const PreLoadAssets = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);

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

  useEffect(() => {
    if (sessionStorage.getItem("loaded")) {
      setReady(true);
    } else {
      loadAssets().then(() => {
        setTimeout(() => {
          setReady(true);
          sessionStorage.setItem("loaded", "true");
        }, 1000);
      });
    }
    async function loadAssets() {
      for (let i = 0; i < assets.length; i++) {
        const res = await fetch(assets[i].src);
        if (res.ok) {
          setLoaded(((i + 1) / assets.length) * 100);
        }
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, getRandom(800, 1000));
        });
      }
      setReady(true);
    }
  }, []);

  useEffect(() => {
    setProgress(loaded);
  }, [loaded]);

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
