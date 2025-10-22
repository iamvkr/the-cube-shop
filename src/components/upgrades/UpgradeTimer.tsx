import { useEffect, useState } from "react";
import type { Active_Upgrade_Type } from "../../types";
import checkBoxIcon from "../../assets/add-box.svg";
import zapIcon from "../../assets/zap.svg";
import loaderIcon from "../../assets/loader.svg";
import { useGameStore } from "../../zustand/store";
import { Button } from "pixel-retroui";

// Timer display component for active upgrades
export default function UpgradeTimer({
  upgrade,
  onComplete,
}: {
  upgrade: Active_Upgrade_Type;
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const {isDoingTask} = useGameStore()

  useEffect(() => {
    const updateTimer = () => {
      const elapsed = (Date.now() - upgrade.startedAt) / 1000;
      const remaining = Math.max(0, upgrade.durationSeconds - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0 && upgrade.status === "running") {
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [upgrade, onComplete]);

  const progress =
    ((upgrade.durationSeconds - timeLeft) / upgrade.durationSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);

  if (upgrade.status === "completed") {
    return (
      <div className="mt-2 bg-green-100 border border-green-300 rounded p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
            <img src={zapIcon} alt="check" className="size-6" />
            Upgrade Complete!
          </span>
          <Button
            onClick={onComplete}
            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            {isDoingTask ? <img src={loaderIcon} alt="loader" className="size-5 animate-spin" />
            :
            <>
            Claim +{upgrade.incrementPercent}%
            </>}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
          <img src={checkBoxIcon} alt="check" className="size-6" />
          Upgrading +{upgrade.incrementPercent}%
        </span>
        <span className="text-xs text-blue-600 font-mono">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
