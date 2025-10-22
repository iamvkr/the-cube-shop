const clickSound = new Audio("/sounds/mouse-click.mp3");

export const playClickAudio = () => {
  let isSfxEnabled = localStorage.getItem("sfx");
  if (isSfxEnabled === null || isSfxEnabled === "true") {
    localStorage.setItem("sfx", "true");
    clickSound.play();
  } else {
    localStorage.setItem("sfx", "false");
  }
};
