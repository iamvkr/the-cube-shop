import { type Models, Query, ID } from "appwrite";
import { tablesDb } from "./index";
import { config } from "./configs";
import type { Inventory_Item_Type } from "../types";

interface UserGameProperties {
  userId: string;
  userCoins: number;
  lastPlayedTimestamp: string;
  highScore: number;
  gameLevel: number;
  inventoryItems: string;
}

export type UserGameType = Models.DefaultRow & UserGameProperties;

export const listUserGameData = async (userId: string) => {
  try {
    const res = await tablesDb.listRows<UserGameType>({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      queries: [
        Query.select([
          "userId",
          "userCoins",
          "lastPlayedTimestamp",
          "highScore",
          "gameLevel",
          "inventoryItems",
        ]),
        Query.equal("userId", userId),
      ],
    });
    return {
      success: true,
      data: res,
      message: "fetch successfully",
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const createUserGameData = async (data: {
  userId: string;
  userCoins?: number;
  lastPlayedTimestamp?: string;
  highScore?: number;
  gameLevel?: number;
  inventoryItems?: Inventory_Item_Type[];
}) => {
  try {
    const res = await tablesDb.createRow<UserGameType>({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      rowId: ID.unique(),
      data,
    });
    return {
      success: true,
      data: res,
      message: "crerated successfully",
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateUserGameData = async (
  rowId: string,
  updateObj: {
    userCoins?: number;
    lastPlayedTimestamp?: string;
    highScore?: number;
    gameLevel?: number;
    inventoryItems?: Inventory_Item_Type[];
  }
) => {
  try {
    const res = await tablesDb.updateRow<UserGameType>({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      rowId,
      data: updateObj.inventoryItems
        ? {
            ...updateObj,
            inventoryItems: JSON.stringify(updateObj.inventoryItems),
          }
        : updateObj,
    });
    return {
      success: true,
      data: res,
      message: "updated successfully",
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
