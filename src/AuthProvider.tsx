import React, { useEffect } from "react";
import { useUserStore } from "./zustand/store";
import { getUser } from "./appwrite/auth";
import loaderIcon from "./assets/loader.svg";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useUserStore();
  useEffect(() => {
    if (user === null) {
      // fetching user for auth:

      getUser().then((res) => {
        if (res.success) {
          setUser(res.data!); // user is logged In
        } else {
          setUser(false); //user is logged out
        }
      });
    }
  }, []);
  return (
    <>
      {user === null && (
        <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-blue-200">
          <img
            src={loaderIcon}
            alt="Loading..."
            className="size-6 animate-spin"
          />
        </div>
      )}
      {user === false && (
        <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-blue-200">
          Login to continue!
        </div>
      )}
      {user && children}
    </>
  );
};

export default AuthProvider;
