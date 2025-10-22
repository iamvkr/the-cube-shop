import { useState } from "react";
import { useGameStore } from "../../zustand/store";
import { calculateUpgradeCost, calculateUpgradeDuration } from "../../utils";
import type { Inventory_Item_Type } from "../../types";
import trendingUpIcon from "../../assets/trending-up.svg";
import closeIcon from "../../assets/close.svg";
import { Button, Card, ProgressBar } from "pixel-retroui";

// Upgrade modal for starting profit upgrade
export default function UpgradeModal({
  item,
  onClose,
}: {
  item: Inventory_Item_Type;
  onClose: () => void;
}) {
  const { coins, startProfitUpgrade, activeUpgrades } = useGameStore();
  const [incrementPercent, setIncrementPercent] = useState(10);

  const cost = calculateUpgradeCost(incrementPercent);
  const duration = calculateUpgradeDuration(incrementPercent);
  const newCap = item.profitMarginCap + incrementPercent / 100;
  const canAfford = coins >= cost;
  const maxCapReached = newCap > 2.0; // 200% cap limit

  const hasActiveUpgrade = activeUpgrades.some(
    (u) => u.inventoryId === item.id
  );

  const handleStartUpgrade = () => {
    if (canAfford && !maxCapReached && !hasActiveUpgrade) {
      startProfitUpgrade(item.id, incrementPercent, cost, duration);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card
        bg="#fefcd0"
        textColor="black"
        borderColor="black"
        className="w-auto"
      >
        <div className="w-96 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <img src={trendingUpIcon} alt="trendingup" className="size-6" />
              Profit Upgrade
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <img src={closeIcon} alt="trendingup" className="size-6" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-600">
              Current Margin Cap: {(item.profitMarginCap * 100).toFixed(0)}%
            </p>
          </div>

          {hasActiveUpgrade && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
              <p className="text-sm text-yellow-800 font-semibold">
                ⚠️ Upgrade already in progress for this item
              </p>
            </div>
          )}

          {maxCapReached && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ Maximum profit margin cap reached (200%)
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Increment: {incrementPercent}%
              </label>
              <ProgressBar
                size="sm"
                color="blue"
                borderColor="black"
                className="w-full"
                progress={incrementPercent * 2}
              />
              {/* <input
              type="range"
              min="10"
              max="50"
              step="10"
              value={incrementPercent}
              onChange={(e) => setIncrementPercent(parseInt(e.target.value))}
              className="w-full"
              disabled={hasActiveUpgrade || maxCapReached}
            /> */}
              <div
                className="flex justify-between text-xs text-gray-500 mt-3"
                onClick={(e) => {
                  if ((e.target as HTMLSpanElement).id) {
                    setIncrementPercent(
                      parseInt((e.target as HTMLSpanElement).id)
                    );
                  }
                }}
              >
                <button className=" p-1 border-2 pointer-events-none" id="0">
                  0%
                </button>
                <button
                  className="bg-blue-50 p-1 cursor-pointer border-2 hover:border-black"
                  id="10"
                >
                  10%
                </button>
                <button
                  className="bg-blue-50 p-1 cursor-pointer border-2 hover:border-black"
                  id="20"
                >
                  20%
                </button>
                <button
                  className="bg-blue-50 p-1 cursor-pointer border-2 hover:border-black"
                  id="30"
                >
                  30%
                </button>
                <button
                  className="bg-blue-50 p-1 cursor-pointer border-2 hover:border-black"
                  id="40"
                >
                  40%
                </button>
                <button
                  className="bg-blue-50 p-1 cursor-pointer border-2 hover:border-black"
                  id="50"
                >
                  50%
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs text-gray-600">Cost</p>
                <p
                  className={`text-lg font-bold ${
                    canAfford ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {cost} coins
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <p className="text-xs text-gray-600">Duration</p>
                <p className="text-lg font-bold text-purple-600">{duration}s</p>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-300 rounded">
              <p className="text-xs text-gray-600 mb-1">New Margin Cap</p>
              <p className="text-2xl font-bold text-green-600">
                {(item.profitMarginCap * 100).toFixed(0)}% →{" "}
                {(newCap * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              borderColor="black"
              onClick={onClose}
              shadow="#e0e0e0"
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              bg="#fefcd0"
              textColor="black"
              borderColor="black"
              shadow="#c381b5"
              onClick={handleStartUpgrade}
              disabled={!canAfford || maxCapReached || hasActiveUpgrade}
              className="flex items-center justify-center gap-2 flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Start Upgrade
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
