export type Inventory_Item_Type = {
  id: string;
  productId: string;
  name: string;
  price: number;
  profitMarginCap: number;
  stock: number;
  baseCost: number;
  addedOn: number;
};

export type Product_Catalog_Type = {
  id: string;
  name: string;
  baseCost: number;
  basePrice: number;
  defaultStock: number;
  rarity: string;
};

export type Customer_Inventory_Item_Type = {
    inventoryId: string;
    productId: string;
    name: string;
    price: number;
    qty: number;
}
export type Current_Customer_Type = {
    id: string;
    items: Customer_Inventory_Item_Type[];
    createdAt: number;
    patienceSeconds: number;
}
export type CustomerStateType = {isVisisble:boolean,profileIndex:number}

export type Active_Upgrade_Type = {
    id: string;
    inventoryId: string;
    startedAt: number;
    durationSeconds: number;
    incrementPercent: number;
    targetCap: number;
    costPaid: number;
    status: string;
}