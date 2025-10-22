import { useState } from "react";
import { useGameStore } from "../../zustand/store";
import type { Inventory_Item_Type, Product_Catalog_Type } from "../../types";
import { Button, Popup } from "pixel-retroui";
import { PRODUCT_CATALOG } from "../../data";
import packageIcon from "../../assets/package.svg";
import coinIcon from "../../assets/coin.svg";
import loaderIcon from "../../assets/loader.svg";
import { playClickAudio } from "../../playSound";

export function AddProductModal({ onClose }: { onClose: () => void }) {
  const {
    coins,
    addProduct,
    inventory,
    restockProduct,
    gameDataRow,
    isDoingTask,
  } = useGameStore();
  const [selectedProductId, setSelectedProductId] = useState("");

  const getInventoryItem = (productId: string) => {
    return inventory.find((item) => item.productId === productId);
  };

  const handleAddProduct = (product: Product_Catalog_Type) => {
    if (coins >= product.baseCost) {
      setSelectedProductId(product.id);
      addProduct(product.id);
      playClickAudio();
    }
  };
  const handleRestock = (
    product: Product_Catalog_Type,
    invItem: Inventory_Item_Type
  ) => {
    if (coins >= product.baseCost && gameDataRow) {
      setSelectedProductId(product.id);
      restockProduct(invItem.id, product.id, gameDataRow.$id);
      playClickAudio();
    }
  };

  return (
    <>
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
        <div className="w-96 p-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Add Product</h2>
          </div>

          <div className="grid grid-cols-1  gap-4 max-h-96 overflow-y-auto">
            {PRODUCT_CATALOG.map((product) => {
              const invItem = getInventoryItem(product.id);
              const canAfford = coins >= product.baseCost;
              const isOutOfStock = invItem && invItem.stock === 0;
              const isLowStock =
                invItem && invItem.stock > 0 && invItem.stock <= 10;

              return (
                <div
                  key={product.id}
                  className="border-2 rounded-lg p-4 hover:shadow-md transition"
                  style={{
                    borderColor: isOutOfStock
                      ? "#ef4444"
                      : isLowStock
                      ? "#f59e0b"
                      : "#e5e7eb",
                  }}
                >
                  {/* Product Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-xs text-gray-600 mt-2">
                        Cost Price: {product.baseCost} coins
                      </p>
                      {invItem && (
                        <p className="text-xs text-gray-600">
                          Selling Price: {invItem.price} coins
                        </p>
                      )}
                      {invItem && (
                        <p className="text-xs text-gray-600">
                          profit margin cap:{" "}
                          {(invItem.profitMarginCap * 100).toFixed(0)} %
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Stock per purchase: {product.defaultStock}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        product.rarity === "rare"
                          ? "bg-purple-200 text-purple-800"
                          : product.rarity === "uncommon"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {product.rarity}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="mb-3 text-sm">
                    {/* <p className="text-gray-600">Stock per purchase: {product.defaultStock}</p> */}
                    {invItem && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="font-semibold text-gray-700 flex items-center gap-1">
                          <img src={packageIcon} alt="add" className="size-6" />
                          Your Stock:
                          <span
                            className={
                              isOutOfStock
                                ? "text-red-600"
                                : isLowStock
                                ? "text-orange-600"
                                : "text-green-600"
                            }
                          >
                            {invItem.stock}
                          </span>
                        </p>
                        {/* <p className="text-xs text-gray-500">Selling at: {invItem.price} coins</p> */}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {!invItem ? (
                    // Not owned - Add to inventory
                    <Button
                      onClick={() => handleAddProduct(product)}
                      borderColor="#000"
                      disabled={!canAfford || isDoingTask}
                      className={`-translate-x-3 w-full py-2 flex items-center justify-center gap-2 text-sm ${
                        canAfford
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isDoingTask && selectedProductId === product.id ? (
                        <img
                          src={loaderIcon}
                          alt="load"
                          className="size-6 animate-spin filter-[brightness(0)_invert(1)]"
                        />
                      ) : (
                        <>
                          <img
                            src={coinIcon}
                            alt="coin"
                            className="size-6 filter-[brightness(0)_invert(1)]"
                          />
                          {product.baseCost} - Add to Inventory
                        </>
                      )}
                    </Button>
                  ) : isOutOfStock ? (
                    // Out of stock - Urgent restock
                    <Button
                      onClick={() => handleRestock(product, invItem)}
                      disabled={!canAfford || isDoingTask}
                      borderColor="#000"
                      className={`-translate-x-3 w-full py-2 flex items-center justify-center gap-2 text-sm ${
                        canAfford
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isDoingTask && selectedProductId === product.id ? (
                        <img
                          src={loaderIcon}
                          alt="add"
                          className="size-6 animate-spin filter-[brightness(0)_invert(1)]"
                        />
                      ) : (
                        <>
                          <img src={coinIcon} alt="coin" className="size-6" />
                          {product.baseCost} - Restock Now
                        </>
                      )}
                    </Button>
                  ) : (
                    // Has stock - Buy more
                    <Button
                      onClick={() => handleRestock(product, invItem)}
                      disabled={!canAfford || isDoingTask}
                      className={`-translate-x-3 w-full py-2 flex items-center justify-center gap-2 text-sm ${
                        canAfford
                          ? isLowStock
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isDoingTask && selectedProductId === product.id ? (
                        <img
                          src={loaderIcon}
                          alt="add"
                          className="size-6 animate-spin filter-[brightness(0)_invert(1)]"
                        />
                      ) : (
                        <>
                          <img
                            src={coinIcon}
                            alt="add"
                            className="size-6 filter-[brightness(0)_invert(1)]"
                          />
                          {product.baseCost} - Buy More Stock
                        </>
                      )}
                    </Button>
                  )}

                  {!canAfford && (
                    <p className="text-xs text-red-600 mt-2 text-center">
                      Not enough coins
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Popup>
    </>
  );
}
