import { useState } from "react";
import type { Inventory_Item_Type } from "../../types";
import { Button, Card } from "pixel-retroui";
import { useGameStore } from "../../zustand/store";
import loaderIcon from "../../assets/loader.svg";

export function UpdatePriceModal({
  item,
  onClose,
  onUpdate,
}: {
  item: Inventory_Item_Type;
  onClose: () => void;
  onUpdate: (id: string, newPrice: number) => Promise<void>;
}) {
  const [newPrice, setNewPrice] = useState(item.price);
  const maxPrice = item.baseCost * (1 + item.profitMarginCap);
  const { isDoingTask } = useGameStore();

  const handleSave = async () => {
    if (newPrice <= maxPrice && newPrice > 0) {
      await onUpdate(item.id, newPrice);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <Card bg="#fefcd0" textColor="black" borderColor="black" className="w-80">
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">{item.name} - Update Price</h3>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Cost
              </label>
              <p className="bg-gray-100 p-2 rounded">{item.baseCost} coins</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profit Margin Cap
              </label>
              <p className="text-sm text-gray-600">
                {(item.profitMarginCap * 100).toFixed(0)}%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Allowed Price
              </label>
              <p className="bg-gray-100 p-2 rounded text-green-600 font-semibold">
                {maxPrice.toFixed(2)} coins
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Price
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                min="0"
                max={maxPrice}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {newPrice > maxPrice && (
                <p className="text-xs text-red-600 mt-1">
                  Exceeds max allowed price
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              //   bg="#fefcd0"
              textColor="black"
              //   borderColor="black"
              shadow="#e0e0e0"
              onClick={onClose}
              disabled={newPrice > maxPrice || newPrice <= 0 || isDoingTask}
              className="flex-1 "
            >
              Cancel
            </Button>

            <Button
              bg="#fefcd0"
              textColor="black"
              borderColor="black"
              shadow="#c381b5"
              onClick={handleSave}
              disabled={newPrice > maxPrice || newPrice <= 0 || isDoingTask}
              className="flex items-center justify-center gap-2 flex-1 "
            >
              {isDoingTask && (
                <img
                  src={loaderIcon}
                  alt="add"
                  className="size-6 animate-spin"
                />
              )}
              Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
