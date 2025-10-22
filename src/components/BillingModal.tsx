import { useState } from "react";
import checkBoxIcon from "../assets/checkbox.svg";
import closeIcon from "../assets/close.svg";
import cartIcon from "../assets/cart.svg";
import loaderIcon from "../assets/loader.svg";
import { useGameStore } from "../zustand/store";
import type {
  Customer_Inventory_Item_Type,
  Inventory_Item_Type,
} from "../types";
import { Button, Card, Popup } from "pixel-retroui";

function BillingModal({
  items,
  onClose,
  onComplete,
}: {
  items: Customer_Inventory_Item_Type[];
  onClose: () => void;
  onComplete: () => void;
}) {
  const { inventory, processOrder, clearCustomer, isDoingTask } =
    useGameStore();
  const [cart, setCart] = useState<Customer_Inventory_Item_Type[]>([]);
  const [showResult, setShowResult] = useState<string | null>(null); // 'success' or 'fail'

  const addToCart = (item: Inventory_Item_Type) => {
    if (cart.some((c) => c.inventoryId === item.id)) return;

    setCart([
      ...cart,
      {
        inventoryId: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: 1,
      },
    ]);
  };

  const updateCartQty = (inventoryId: string, change: number) => {
    setCart(
      cart.map((item) => {
        if (item.inventoryId === inventoryId) {
          const invItem = inventory.find((inv) => inv.id === inventoryId);
          const newQty = Math.max(
            0,
            Math.min(item.qty + change, invItem?.stock || 0)
          );
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (inventoryId: string) => {
    setCart(cart.filter((item) => item.inventoryId !== inventoryId));
  };

  const totalRevenue = cart.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const validateOrder = () => {
    if (cart.length !== items.length) return false;

    return items.every((custItem) => {
      const cartItem = cart.find((c) => c.inventoryId === custItem.inventoryId);
      return cartItem && cartItem.qty === custItem.qty;
    });
  };

  const handleConfirmSale = async () => {
    if (validateOrder()) {
      await processOrder(cart);
      setShowResult("success");
    } else {
      setShowResult("fail");
    }
  };

  if (showResult) {
    return (
      <Popup
        isOpen={true}
        onClose={() => {
          onComplete();
          clearCustomer();
        }}
        bg="#fefcd0"
        baseBg="#c381b5"
        textColor="black"
        borderColor="black"
      >
        <div className=" flex items-center justify-center z-50">
          <div className="w-96 p-8 text-center">
            {showResult === "success" ? (
              <>
                <div className="mb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <img
                      src={checkBoxIcon}
                      alt="check box"
                      className="size-6"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Perfect Order!
                </h2>
                <p className="text-gray-600 mb-4">Customer is satisfied</p>
                <p className="text-3xl font-bold text-green-600">
                  +{totalRevenue} coins
                </p>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <img src={closeIcon} alt="check box" className="size-6" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Wrong Order!
                </h2>
                <p className="text-gray-600 mb-4">Customer left disappointed</p>
                <div className="bg-gray-50 rounded p-3 text-left text-sm">
                  <p className="font-semibold mb-2">They wanted:</p>
                  {items.map((item) => (
                    <p key={item.inventoryId} className="text-gray-600">
                      • {item.name} x{item.qty}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Popup>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card
        bg="#fefcd0"
        textColor="black"
        borderColor="black"
        className="w-full max-w-4xl"
      >
        <div className="w-full max-w-4xl h-[600px] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Billing - Build Order</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <img src={closeIcon} alt="check box" className="size-6" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Inventory */}
            <div className="w-1/2 border-r p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Inventory
              </h3>
              <div className="space-y-3">
                {inventory.map((item) => {
                  const isInCart = cart.some((c) => c.inventoryId === item.id);
                  return (
                    <Card
                      //   bg={isInCart ? "green":"#e0e0e0"}
                      //   textColor="black"
                      borderColor={isInCart ? "#000" : "#e5e7eb"}
                      key={item.id}
                      className="mb-6"
                      //border-2 rounded-lg p-3 transition
                      //   className={`mb-6 ${
                      //     isInCart
                      //       ? "border-green-300 bg-green-50"
                      //       : "border-gray-200 hover:border-gray-300"
                      //   }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Price: {item.price} coins
                          </p>
                          <p className="text-sm text-gray-600">
                            Stock: {item.stock}
                          </p>
                        </div>
                      </div>
                      <Button
                        borderColor="black"
                        onClick={() => addToCart(item)}
                        disabled={isInCart || item.stock === 0}
                        className={`w-full -translate-x-3 rounded font-medium text-sm transition ${
                          isInCart
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : item.stock === 0
                            ? "bg-red-100 text-red-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isInCart
                          ? "✓ In Cart"
                          : item.stock === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Cart */}
            <div className="w-1/2 p-4 flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Cart</h3>

              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <img src={cartIcon} alt="cart" className="size-8" />
                    <p>Cart is empty</p>
                    <p className="text-sm">Add items from inventory</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.inventoryId}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.price} coins each
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.inventoryId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img
                            src={closeIcon}
                            alt="check box"
                            className="size-6"
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateCartQty(item.inventoryId, -1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold w-8 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.inventoryId, 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {(item.qty * item.price).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total and Actions */}
              <div className="border-t pt-4">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-800">Total:</p>
                    <p className="text-2xl font-bold text-green-600">
                      {totalRevenue.toFixed(0)} coins
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSale}
                    disabled={cart.length === 0}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
                  >
                    {isDoingTask ? (
                      <img
                        src={loaderIcon}
                        alt="loading"
                        className="size-6 animate-spin filter-[invert]"
                      />
                    ) : (
                      <>
                        <img
                          src={checkBoxIcon}
                          alt="check box"
                          className="size-6"
                        />
                        Confirm Sale
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default BillingModal;
