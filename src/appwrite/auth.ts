import { ID } from "appwrite";
import { account } from "./index";

/** SIGNUP */
export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await account.create({
      userId: ID.unique(),
      email: email,
      password: password,
      name: name,
    });
    return {
      success: true,
      data: response,
      message: "user signup succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

/** LOGIN */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await account.createEmailPasswordSession({
      email: email,
      password: password,
    });
    return { success: true, data: response, message: "user login succesfully" };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

/** Get the currently logged in user. */
export const getUser = async () => {
  try {
    const response = await account.get();
    return { success: true, data: response, message: "found user" };
  } catch (error) {
    return {
      success: false,
      message: "getUser :: Error: " + (error as Error).message,
    };
  }
};

/** LOGOUT */
export const logoutUser = async () => {
  try {
    await account.deleteSession({ sessionId: "current" });
    localStorage.removeItem("JWT");
    return { success: true, message: "logout user" };
  } catch (error) {
    return {
      success: false,
      message: "logoutUser :: Error: " + (error as Error).message,
    };
  }
};
