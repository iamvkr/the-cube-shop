import { useEffect, useState } from "react";
import { useGameStore } from "../../zustand/store";
import type { Inventory_Item_Type } from "../../types";
import { UpdatePriceModal } from "./UpdatePriceModal";
import UpgradeTimer from "../upgrades/UpgradeTimer";
import UpgradeModal from "../upgrades/UpgradeModal";
import { Button, Popup } from "pixel-retroui";
import { playClickAudio } from "../../playSound";

export function InventoryModal({ onClose }: { onClose: () => void }) {
  const {
    inventory,
    updatePrice,
    activeUpgrades,
    completeUpgrade,
    checkUpgrades,
  } = useGameStore();
  const [editingItem, setEditingItem] = useState<Inventory_Item_Type | null>(
    null
  );
  const [upgradingItem, setUpgradingItem] =
    useState<Inventory_Item_Type | null>(null);
  // Check upgrades periodically
  useEffect(() => {
    checkUpgrades();
    const interval = setInterval(checkUpgrades, 1000);
    return () => clearInterval(interval);
  }, [checkUpgrades]);

  const getItemUpgrade = (inventoryId: string) => {
    return activeUpgrades.find((u) => u.inventoryId === inventoryId);
  };

  return (
    <Popup
      isOpen={true}
      onClose={() => {
        onClose();
        playClickAudio();
      }}
      bg="#fefcd0"
      baseBg="#c381b5"
      textColor="black"
      borderColor="black"
    >
      <div className="">
        <div className=" w-96 p-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Inventory</h2>
          </div>

          {inventory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No products yet. Add some!
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {inventory.map((item) => {
                const upgrade = getItemUpgrade(item.id);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Selling Price: {item.price} coins
                        </p>
                        <p className="text-sm text-gray-600">
                          Stock: {item.stock}
                        </p>
                      </div>
                      <span className="text-xs bg-green-200 px-2 py-1 rounded">
                        {(
                          ((item.price - item.baseCost) / item.baseCost) *
                          100
                        ).toFixed(0)}
                        % margin
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <Button
                        textColor="black"
                        shadow="#e0e0e0"
                        className="bg-blue-100 text-blue-700 m-0 p-0"
                        onClick={() => {setEditingItem(item);playClickAudio()}}
                      >
                        Update Price
                      </Button>
                      <Button
                        textColor="black"
                        shadow="#e0e0e0"
                        className="bg-green-100 text-green-700 m-0 p-0"
                        onClick={() => {setUpgradingItem(item);playClickAudio()}}
                        disabled={!!upgrade}
                      >
                        Upgrade
                      </Button>
                    </div>

                    {upgrade && (
                      <UpgradeTimer
                        upgrade={upgrade}
                        onComplete={() => completeUpgrade(upgrade.id)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {editingItem && (
          <UpdatePriceModal
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onUpdate={updatePrice}
          />
        )}

        {upgradingItem && (
          <UpgradeModal
            item={upgradingItem}
            onClose={() => setUpgradingItem(null)}
          />
        )}
      </div>
    </Popup>
  );
}
