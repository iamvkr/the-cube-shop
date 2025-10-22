import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundry";
import Home from "./pages/Home";
import Start from "./pages/Start";
import Shop from "./pages/Shop";
import { Toaster } from "react-hot-toast";

import "pixel-retroui/dist/index.css";
import "pixel-retroui/dist/fonts.css";
import { playClickAudio } from "./playSound";
import BgmPlayer from "./BgmPlayer";
import "./App.css"

const App: React.FC = () => {
  useEffect(() => {
    document.addEventListener("click", playClickAudio);

    return () => {
      document.removeEventListener("click", playClickAudio);
    };
  }, []);

  return (
    <>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<Start />} />
            <Route path="/shop" element={<Shop />} />
          </Routes>
          <Toaster />
          <BgmPlayer />
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
};

export default App;
