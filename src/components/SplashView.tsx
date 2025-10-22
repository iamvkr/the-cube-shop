import { Button } from "pixel-retroui";
import playIcon from "../assets/play.svg";
import volumeIcon from "../assets/volume2.svg";
import volumeXIcon from "../assets/volumeX.svg";
import { useGameStore } from "../zustand/store";

const SplashView = ({
  setupGame,
  isSfxEnabled,
  setIsSfxEnabled,
}: {
  setupGame: () => void;
  isSfxEnabled:boolean;
  setIsSfxEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { bgm } = useGameStore();
  return (
    <>
      <Button
        bg="#fefcd0"
        textColor="black"
        borderColor="black"
        shadow="#c381b5"
        onClick={setupGame}
        className="flex items-center justify-center gap-2 w-xs"
      >
        <img src={playIcon} alt="volume" className="size-5" />
        Start Game
      </Button>
      <Button
        bg="#fefcd0"
        textColor="black"
        borderColor="black"
        shadow="#c381b5"
        onClick={() => {
          setIsSfxEnabled(!isSfxEnabled);
          localStorage.setItem("sfx", JSON.stringify(!isSfxEnabled));
        }}
        className="flex items-center justify-center gap-2 w-xs"
      >
        <img
          src={isSfxEnabled ? volumeIcon : volumeXIcon}
          alt="volume"
          className="size-5"
        />
        Sound
      </Button>
      <Button
        bg="#fefcd0"
        textColor="black"
        borderColor="black"
        shadow="#c381b5"
        onClick={() => {
          bgm.setIsPlaying(!bgm.isPlaying);
          localStorage.setItem("bgm", JSON.stringify(!bgm.isPlaying));
        }}
        className="flex items-center justify-center gap-2 w-xs"
      >
        <img
          src={bgm.isPlaying ? volumeIcon : volumeXIcon}
          alt="volume"
          className="size-5"
        />
        BGM
      </Button>
    </>
  );
};

export default SplashView;
