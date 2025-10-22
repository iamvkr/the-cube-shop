import { create } from "zustand";
import { PRODUCT_CATALOG } from "../data";
import type {
  Inventory_Item_Type,
  Current_Customer_Type,
  CustomerStateType,
  Customer_Inventory_Item_Type,
  Active_Upgrade_Type,
} from "../types";
import type { Models } from "appwrite";
import { updateUserGameData, type UserGameType } from "../appwrite/db";
import { getRandom } from "../utils";

interface UserStates {
  user: Models.User | false | null;
  setUser: (data: Models.User | false) => void;
}

interface GameStates {
  /** LOADER */
  isDoingTask: boolean;
  /** GLOBAL GAME STARTED */
  isGameStarted: boolean;
  setIsGameStarted: (status: boolean) => void;

  /** GAME VARIABLES */
  coins: number;
  setCoins: (coins: number) => void;
  inventory: Inventory_Item_Type[];
  setInventory: (i: Inventory_Item_Type[]) => void;
  gameDataRow: UserGameType | null;
  // Appwrite : User Table : ROW
  setGameDataRow: (row: UserGameType) => void;
  activeUpgrades: Active_Upgrade_Type[];
  currentCustomer: Current_Customer_Type | null;
  customerState: CustomerStateType;
  setCustomerState: (newState: CustomerStateType) => void;

  /** GAME OPERATIONS */
  addProduct: (productId: string) => Promise<void>;
  updatePrice: (inventoryId: string, newPrice: number) => Promise<void>;
  spawnCustomer: () => void;
  clearCustomer: () => void;
  processOrder: (confirmedItems: Customer_Inventory_Item_Type[]) => void;
  startProfitUpgrade: (
    inventoryId: string,
    incrementPercent: number,
    cost: number,
    duration: number
  ) => void;
  completeUpgrade: (upgradeId: string) => Promise<GameStates | undefined>;
  checkUpgrades: () => void;
  restockProduct: (
    inventoryId: string,
    productId: string,
    rowId: string
  ) => Promise<GameStates | undefined>;

  /** SOUNDS AND BGM */
  bgm: {
    isPlaying: boolean;
    setIsPlaying: (status: boolean) => void;
  };
}

export const useUserStore = create<UserStates>()((set) => ({
  user: null,
  setUser: (data) => set(() => ({ user: data })),
}));

export const useGameStore = create<GameStates>()((set, get) => ({
  isDoingTask: false,
  isGameStarted: false,
  setIsGameStarted: (status) => set(() => ({ isGameStarted: status })),

  coins: -1,
  setCoins: (c) => set({ coins: c }),
  inventory: [],
  setInventory: (i) => set({ inventory: i }),
  gameDataRow: null,
  setGameDataRow: (row) => set({ gameDataRow: row }),
  activeUpgrades: [],
  currentCustomer: null,
  customerState: { isVisisble: false, profileIndex: 1 },
  setCustomerState: (newState) => set({ customerState: newState }),

  // Add product to inventory
  addProduct: async (productId) => {
    const product = PRODUCT_CATALOG.find((p) => p.id === productId);
    const state = get();
    const rowId = state.gameDataRow?.$id;
    if (!product || state.coins < product.baseCost) return set(state);

    const newInventoryItem = {
      id: `inv_${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      profitMarginCap: 0.5,
      stock: product.defaultStock,
      baseCost: product.baseCost,
      addedOn: Date.now(),
    };

    set({ isDoingTask: true });
    try {
      if (!rowId) {
        throw new Error("ROW ID NOT FOUND!");
      }

      const updatedCoins = state.coins - product.baseCost;
      const updatedInventory = [...state.inventory, newInventoryItem];
      //  update in db:
      await updateUserGameData(rowId, {
        userCoins: updatedCoins,
        inventoryItems: updatedInventory,
      });

      // update locally
      set({
        coins: updatedCoins,
        inventory: updatedInventory,
      });
    } catch (error) {
      set(state);
    }
    set({ isDoingTask: false });
  },

  // Update price of inventory item
  updatePrice: async (inventoryId: string, newPrice: number) => {
    const state = get();
    const rowId = state.gameDataRow?.$id;
    const updatedInventory = state.inventory.map((item) =>
      item.id === inventoryId ? { ...item, price: newPrice } : item
    );
    set({ isDoingTask: true });
    try {
      if (!rowId) {
        throw new Error("ROW ID NOT FOUND!");
      }

      // update price in db:
      await updateUserGameData(rowId, {
        inventoryItems: updatedInventory,
      });
      //   update locally
      set({
        inventory: updatedInventory,
      });
    } catch (error) {
      set(state);
    }
    set({ isDoingTask: false });
  },

  // Generate random customer with shopping list
  spawnCustomer: () => {
    set((state) => {
      if (state.inventory.length === 0) return state;
      const availableItems = state.inventory.filter((item) => item.stock > 0);

      function getSmartCustomerItems(inventory: Inventory_Item_Type[]) {
        if (inventory.length <= 0) {
          return [];
        }
        const selectedINDEX = new Set();
        // select max 3 products and min 1
        const itemCounts = Math.min(getRandom(1, 3), inventory.length);
        for (let i = 0; i < itemCounts; i++) {
          const randomIndex = getRandom(0, inventory.length - 1);
          if (!selectedINDEX.has(randomIndex)) {
            selectedINDEX.add(randomIndex);
          }
        }

        return inventory
          .filter((_, i) => selectedINDEX.has(i))
          .map((item) => {
            const qty = Math.min(getRandom(1, 3), item.stock);
            return {
              inventoryId: item.id,
              productId: item.productId,
              name: item.name,
              price: item.price,
              qty,
            };
          });
      }

      const customer = {
        id: `cust_${Date.now()}`,
        items: getSmartCustomerItems(availableItems),
        createdAt: Date.now(),
        patienceSeconds: getRandom(30, 45),
      };

      return { currentCustomer: customer };
    });
  },

  // Clear current customer
  clearCustomer: () => {
    set({ currentCustomer: null });
  },

  // Process order: deduct inventory, add coins
  processOrder: async (confirmedItems: Customer_Inventory_Item_Type[]) => {
    const state = get();
    const rowId = state.gameDataRow?.$id;
    let totalRevenue = 0;

    const updatedInventory = state.inventory.map((invItem) => {
      const orderItem = confirmedItems.find(
        (ci) => ci.inventoryId === invItem.id
      );
      if (!orderItem) return invItem;

      totalRevenue += orderItem.qty * orderItem.price;
      return { ...invItem, stock: invItem.stock - orderItem.qty };
    });

    set({ isDoingTask: true });
    try {
      if (!rowId) {
        throw new Error("ROW ID NOT FOUND!");
      }
      // update in db:
      await updateUserGameData(rowId, {
        inventoryItems: updatedInventory,
        userCoins: state.coins + totalRevenue,
      });
      //   update locally
      set({
        inventory: updatedInventory,
        coins: state.coins + totalRevenue,
        // currentCustomer: null,
      });
    } catch (error) {
      set(state);
    }
    set({ isDoingTask: false });
  },

  // Start profit upgrade
  startProfitUpgrade: (inventoryId, incrementPercent, cost, duration) =>
    set((state) => {
      const item = state.inventory.find((inv) => inv.id === inventoryId);
      if (!item || state.coins < cost) return state;

      const newUpgrade = {
        id: `u_${Date.now()}`,
        inventoryId,
        startedAt: Date.now(),
        durationSeconds: duration,
        incrementPercent,
        targetCap: item.profitMarginCap + incrementPercent / 100,
        costPaid: cost,
        status: "running",
      };

      return {
        coins: state.coins - cost,
        activeUpgrades: [...state.activeUpgrades, newUpgrade],
      };
    }),

  // Complete upgrade and update inventory item
  completeUpgrade: async (upgradeId) => {
    const state = get();
    const rowId = state.gameDataRow?.$id;
    const upgrade = state.activeUpgrades.find((u) => u.id === upgradeId);
    if (!upgrade) return state;

    const updatedInventory = state.inventory.map((item) =>
      item.id === upgrade.inventoryId
        ? { ...item, profitMarginCap: upgrade.targetCap }
        : item
    );

    set({ isDoingTask: true });
    try {
      if (!rowId) {
        throw new Error("ROW ID NOT FOUND!");
      }
      // update db:
      await updateUserGameData(rowId, {
        inventoryItems: updatedInventory,
        userCoins: state.coins,
      });

      // update locally:
      set({
        inventory: updatedInventory,
        activeUpgrades: state.activeUpgrades.filter((u) => u.id !== upgradeId),
      });
    } catch (error) {}
    set({ isDoingTask: false });
  },

  // Check and auto-complete upgrades (call this periodically)
  checkUpgrades: () =>
    set((state) => {
      const now = Date.now();
      const updatedUpgrades = state.activeUpgrades.map((upgrade) => {
        const elapsed = (now - upgrade.startedAt) / 1000;
        if (
          elapsed >= upgrade.durationSeconds &&
          upgrade.status === "running"
        ) {
          return { ...upgrade, status: "completed" };
        }
        return upgrade;
      });

      return { activeUpgrades: updatedUpgrades };
    }),

  // Restock existing inventory item
  restockProduct: async (inventoryId: string, productId: string) => {
    const state = get();
    const rowId = state.gameDataRow?.$id;
    const product = PRODUCT_CATALOG.find((p) => p.id === productId);
    const invItem = state.inventory.find((inv) => inv.id === inventoryId);
    if (!product || !invItem || state.coins < product.baseCost) return state;

    const updatedInventory = state.inventory.map((item) =>
      item.id === inventoryId
        ? { ...item, stock: item.stock + product.defaultStock }
        : item
    );

    set({ isDoingTask: true });
    try {
      if (!rowId) {
        throw new Error("ROW ID NOT FOUND!");
      }
      // update db
      await updateUserGameData(rowId, {
        userCoins: state.coins - product.baseCost,
        inventoryItems: updatedInventory,
      });
      //   update locally
      set({
        coins: state.coins - product.baseCost,
        inventory: updatedInventory,
      });
    } catch (error) {
      set(state);
    }
    set({ isDoingTask: false });
  },
  bgm: {
    isPlaying: false,
    setIsPlaying: (status) => {
      set((state) => ({ bgm: { ...state.bgm, isPlaying: status } }));
    },
  },
}));

/** SPANW CUSTOMER SMART SELECTION old algo:
 * 
 * // Calculate attractiveness score for each item based on price  ==============
      //   const calculateAttractiveness = (item: Inventory_Item_Type) => {
      //     const profitMargin = (item.price - item.baseCost) / item.baseCost;

      //     // Base chance: lower margin = higher chance
      //     // 0% margin = 90% chance, 50% = 70%, 100% = 40%, 150% = 20%
      //     let baseChance = 90 - profitMargin * 80;
      //     baseChance = Math.max(10, Math.min(90, baseChance)); // Clamp between 10-90%

      //     // Stock bonus: more stock = slightly higher visibility
      //     const stockBonus = Math.min(item.stock / 20, 1.2); // Max 20% bonus

      //     return baseChance * stockBonus;
      //   };

      // Create weighted list  ==============
      //   const itemsWithWeights = availableItems.map((item) => ({
      //     item,
      //     weight: calculateAttractiveness(item),
      //   }));

      // Weighted random selection ==============
      //   const selectWeightedItem = (
      //     items: {
      //       item: Inventory_Item_Type;
      //       weight: number;
      //     }[]
      //   ) => {
      //     const totalWeight = items.reduce((sum, entry) => sum + entry.weight, 0);
      //     let random = Math.random() * totalWeight;

      //     for (const entry of items) {
      //       random -= entry.weight;
      //       if (random <= 0) {
      //         return entry.item;
      //       }
      //     }
      //     return items[items.length - 1].item; // Fallback
      //   };

      // Generate shopping list (1-3 items)  ==============
      //   const itemCount = Math.floor(Math.random() * 3) + 1;
      //   const items = [];
      //   const selectedIds = new Set();

      //   for (let i = 0; i < itemCount; i++) {
      //     // Filter out already selected items
      //     const availablePool = itemsWithWeights.filter(
      //       (entry) => !selectedIds.has(entry.item.id)
      //     );

      //     if (availablePool.length === 0) break;

      //     const selectedItem = selectWeightedItem(availablePool);
      //     selectedIds.add(selectedItem.id);

      //     // Quantity: 1-3, but not more than available stock
      //     const qty = Math.min(
      //       Math.floor(Math.random() * 3) + 1,
      //       selectedItem.stock
      //     );

      //     items.push({
      //       inventoryId: selectedItem.id,
      //       productId: selectedItem.productId,
      //       name: selectedItem.name,
      //       price: selectedItem.price,
      //       qty,
      //     });
      //   }

      //   function getSmartCustomerItems(inventory: Inventory_Item_Type[]) {
      //     // Assign weights based on stock and price
      //     const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);

      //     // Generate weights for each item:
      //     // Weight = (stock / totalStock) + (1 / price) [to make higher stock and lower price more favorable]
      //     const weightedItems = inventory.map((item) => {
      //       const stockWeight = item.stock / totalStock; // Proportion of stock in the inventory
      //       const priceWeight = 1 / item.price; // Inverse of price (lower price gets higher weight)

      //       // Quantity: 1-3, but not more than available stock
      //       const qty = Math.min(Math.floor(Math.random() * 3) + 1, item.stock);
      //       return {
      //         ...item,
      //         qty,
      //         weight: stockWeight + priceWeight, // Combine the two
      //         normalizedWeight: 0, // added to fix ts tantrums
      //       };
      //     });

      //     // Normalize the weights to sum up to 1
      //     const totalWeight = weightedItems.reduce(
      //       (sum, item) => sum + item.weight,
      //       0
      //     );
      //     weightedItems.forEach((item) => {
      //       item.normalizedWeight = item.weight / totalWeight; // Normalize to [0, 1]
      //     });

      //     // Pick up to 3 items based on the weights
      //     const selectedItems = [];
      //     const numberOfItemsToPick = Math.min(weightedItems.length, 3);

      //     const selectedIds = new Set();
      //     // Perform weighted random selection
      //     for (let i = 0; i < numberOfItemsToPick; i++) {
      //       const availablePool = weightedItems.filter(
      //         (entry) => !selectedIds.has(entry.id)
      //       );

      //       if (availablePool.length === 0) break;
      //       const rand = Math.random();
      //       let cumulativeWeight = 0;

      //       for (let item of weightedItems) {
      //         cumulativeWeight += item.normalizedWeight;
      //         if (rand <= cumulativeWeight) {
      //           selectedItems.push({
      //             inventoryId: item.id,
      //             productId: item.productId,
      //             name: item.name,
      //             price: item.price,
      //             qty: item.qty,
      //           });
      //           break;
      //         }
      //       }
      //     }

      //     return selectedItems;
      //   }
 * 
 */
