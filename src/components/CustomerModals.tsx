import { useEffect, useState } from "react";
import { useGameStore } from "../zustand/store";
import checkBoxIcon from "../assets/checkbox.svg";
import BillingModal from "./BillingModal";
import { Button, Popup, ProgressBar } from "pixel-retroui";
import { getRandom } from "../utils";

export function CustomerPopup({ onClose }: { onClose: () => void }) {
  const { currentCustomer, clearCustomer, customerState, setCustomerState } =
    useGameStore();
  const [timeLeft, setTimeLeft] = useState(currentCustomer!.patienceSeconds);
  const [showBilling, setShowBilling] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearCustomer();
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, clearCustomer, onClose]);

  const timePercentage = (timeLeft / currentCustomer!.patienceSeconds) * 100;
  const isLowTime = timeLeft <= 10;

  const onDismiss = () => {
    clearCustomer();
    setCustomerState({ ...customerState, isVisisble: false }); // remove current customer view
    setTimeout(() => {
      // bring a new customer after timeout:
      setCustomerState({
        isVisisble: true,
        profileIndex: getRandom(1, 4), // generate bw 1 - 4
      });
    }, getRandom(10000, 20000));
    onClose();
  };

  if (showBilling) {
    return (
      <BillingModal
        items={currentCustomer!.items}
        onClose={() => setShowBilling(false)}
        onComplete={()=>{
            onDismiss()
            // onClose
        }}
      />
    );
  }

  return (
    <>
      <Popup
        isOpen={true}
        onClose={() => {}}
        bg="#fefcd0"
        baseBg="#c381b5"
        textColor="black"
        borderColor="black"
      >
        <div className="w-96 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Customer Arrived!</h2>
          </div>

          {/* Timer */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">
                Customer Patience
              </p>
              <p
                className={`text-sm font-bold ${
                  isLowTime ? "text-red-600" : "text-gray-600"
                }`}
              >
                {timeLeft}s
              </p>
            </div>
            {/* <div className="w-full bg-gray-200_ bg-purple-300 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isLowTime ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${timePercentage}%` }}
              />
            </div> */}
            <ProgressBar
              size="sm"
              color={isLowTime ? "red" : "oklch(72.3% 0.219 149.579)"}
              borderColor="black"
              className="w-full"
              progress={timePercentage}
              //   progress={ (2.5 * incrementPercent) - 25 }
            />
          </div>

          {/* Shopping List */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Shopping List:
            </p>
            <div className="space-y-2">
              {currentCustomer &&
                currentCustomer.items.map((item) => (
                  <div
                    key={`${item.inventoryId}-${item.qty}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} x{item.qty}
                    </span>
                    <span className="text-gray-600">
                      {(item.qty * item.price).toFixed(0)} coins
                    </span>
                  </div>
                ))}
            </div>
            <div className="border-t border-blue-200 mt-3 pt-2 flex justify-between font-semibold text-sm">
              <span>Total:</span>
              <span className="text-blue-600">
                {currentCustomer &&
                  currentCustomer.items
                    .reduce((sum, item) => sum + item.qty * item.price, 0)
                    .toFixed(0)}{" "}
                coins
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              textColor="black"
              shadow="#e0e0e0"
              onClick={onDismiss}
              className="flex-1 "
            >
              Dismiss
            </Button>

            <Button
              bg="#fefcd0"
              textColor="black"
              borderColor="black"
              shadow="#c381b5"
              onClick={() => setShowBilling(true)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <img src={checkBoxIcon} alt="check box" className="size-6" />
              Process Order
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
}
