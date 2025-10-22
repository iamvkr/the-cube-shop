// LOGIN/SIGNUP PAGE
import { Button, Card, Input } from "pixel-retroui";
import { useGameStore, useUserStore } from "../zustand/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import mailIcon from "../assets/mail.svg";
import eyeIcon from "../assets/eye.svg";
import eyeCloseIcon from "../assets/eye-close.svg";
import loaderIcon from "../assets/loader.svg";
import toast from "react-hot-toast";
import ToastCard from "../components/ToastCard";
import { getUser, loginUser, signupUser } from "../appwrite/auth";
import { validate } from "../utils";
import PreLoadAssets from "../components/PreLoadAssets";
import SplashView from "../components/SplashView";

const Start = () => {
  const { isGameStarted, setIsGameStarted, bgm } = useGameStore();
  const { setUser } = useUserStore();
  const [gameResponseiveWrapper, setgameResponseiveWrapper] = useState({
    scale: "100%",
  });
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [passVisible, setpassVisible] = useState(false);

  const [shopName, setshopName] = useState("");

  const [isLoading, setisLoading] = useState(false);
  const [isSfxEnabled, setIsSfxEnabled] = useState(false);

  const navigate = useNavigate();

  const setupGame = () => {
    // const cWidth = document.body.clientWidth;
    const cHeight = document.body.clientHeight;
    //   setmessage(`${cWidth}, ${cHeight}`);
    setIsGameStarted(true);
    //   set scale/translete x and y for smaller devices:
    if (cHeight < 720) {
      const scalePercent = Math.round(((720 - cHeight) * 100) / 720);
      setgameResponseiveWrapper({
        scale: String(100 - scalePercent - 1) + "%",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const obj = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };
    const { email, password } = obj;

    try {
      if (!isLoginMode) {
        // signup mode:

        // validation
        const validateSignupInput = validate(email, password, shopName);
        if (validateSignupInput.result) {
          setisLoading(true);
          // perform signup:
          const res = await signupUser(shopName.trim(), email.trim(), password);
          if (!res.success) {
            // signup error
            throw new Error(res.message);
          }
          // else if signup success: user auto signins using login mode:
        } else {
          // validation error
          throw new Error(validateSignupInput.message);
        }
      }
      // LOGIN MODE:
      const validateLoginInput = validate(email, password);
      if (validateLoginInput.result) {
        setisLoading(true);
        const res = await loginUser(email, password);
        if (!res.success) {
          // Login error
          throw new Error(res.message);
        }
        // login success
        toast.custom((t) => (
          <ToastCard t={t} message="Success!" mode="success" />
        ));
        // save user:
        const u = await getUser();
        if (!u.success) {
          // something went wrong to get user
          throw new Error(u.message);
        }
        setUser(u.data!);
        // go to dashboard:
        navigate("/shop", { replace: true });
      } else {
        // validation error
        throw new Error(validateLoginInput.message);
      }
    } catch (error) {
      toast.custom((t) => (
        <ToastCard
          t={t}
          message={error instanceof Error ? error.message : ""}
          mode="fail"
        />
      ));
    } finally {
      setisLoading(false);
    }
  };

  const [bgLoaded, setBgLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "./bg_main.png";
    img.onload = () => {
      setBgLoaded(true);
    };
  }, []);

  useEffect(() => {
    // check if sfx is enabled:
    const sfxEnabled = localStorage.getItem("sfx");
    if (sfxEnabled === null || sfxEnabled === "true") {
      setIsSfxEnabled(true);
    }
    // bgm play on these pages:
    const isBgmEnabled = localStorage.getItem("bgm");
    if (isBgmEnabled === null || isBgmEnabled === "true") {
      localStorage.setItem("bgm", "true");
      bgm.setIsPlaying(true);
    } else {
      bgm.setIsPlaying(false);
    }
  }, []);

  return (
    <PreLoadAssets>
      <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-blue-200 gap-4">
        {!isGameStarted ? (
          <SplashView
            setupGame={setupGame}
            isSfxEnabled={isSfxEnabled}
            setIsSfxEnabled={setIsSfxEnabled}
          />
        ) : (
          <div className={`${!bgLoaded ? "hidden" : ""}`}>
            <div
              id="game-responseive-wrapper"
              className={`h-[720px] w-[1280px] shrink-0 bg-no-repeat bg-center bg-cover relative rounded-md overflow-hidden`}
              style={{
                scale: gameResponseiveWrapper.scale,
                backgroundImage: `url("./bg_main.png")`,
              }}
            >
              {/* SNOWFLAKES*/}
              {[...new Array(20)].map((_, i) => (
                <div className="snowflake" key={i}>
                  ❆
                </div>
              ))}
              {/* SHOP NAME */}
              <input
                type="text"
                placeholder="Enter Shop Name"
                value={shopName}
                onChange={(e) => {
                  setshopName(e.target.value);
                }}
                className="border-5_ absolute bottom-72 left-100 text-black outline-none text-2xl"
              />

              {/* <div className="box h-[200px] w-[200px] bg-blue-400">{gameResponseiveWrapper.scale}</div> */}

              {/* HEADING */}
              <Card
                bg="#fefcd0"
                textColor="black"
                borderColor="black"
                className="inline-block absolute top-4 left-4"
              >
                The Cube Shop
              </Card>

              {/* EXIT */}
              {/* exit btn */}
              <Button
                bg="#fefcd0"
                textColor="black"
                borderColor="black"
                shadow="#c381b5"
                className="absolute top-4 right-4"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }}
              >
                Exit Game
              </Button>

              {/* INTRO AND DETAILS */}
              <Card
                bg="#fefcd0"
                textColor="black"
                borderColor="black"
                shadowColor="#c381b5"
                className="p-4 text-center absolute top-50 left-20 text-xs"
              >
                <h2>Hello! Welcome to Cube Store!</h2>
                <p>This is the card content.</p>
              </Card>

              {/* LOGIN - SIGNUP FORM */}
              <Card
                bg="#fefcd0"
                textColor="black"
                borderColor="black"
                shadowColor="#c381b5"
                className="p-4 text-center absolute top-45 right-4 max-w-sm"
              >
                <h2 className="font-medium text-xs lg:text-xl">
                  {isLoginMode ? "Login Into Your" : "Create a New"} <br />{" "}
                  Store
                </h2>
                <div>
                  <form className="mt-4" onSubmit={handleSubmit}>
                    <Input
                      name="email"
                      icon={mailIcon}
                      onIconClick={() => {
                        //   console.log("jjh");
                      }}
                      bg="#fefcd0"
                      textColor="black"
                      borderColor="black"
                      placeholder="Enter Email"
                      className="w-full"
                      // onChange={(e) => console.log(e.target.value)}
                    />
                    <Input
                      name="password"
                      type={passVisible ? "text" : "password"}
                      className="mt-4 w-full"
                      icon={passVisible ? eyeIcon : eyeCloseIcon}
                      onIconClick={() => {
                        setpassVisible(!passVisible);
                      }}
                      bg="#fefcd0"
                      textColor="black"
                      borderColor="black"
                      placeholder="Enter Password"
                      // onChange={(e) => console.log(e.target.value)}
                    />
                    <div>
                      <Button
                        bg="#fefcd0"
                        textColor="black"
                        borderColor="black"
                        shadow="#c381b5"
                        className="mt-4 w-full -translate-x-[6px] flex items-center justify-center gap-2 disabled:pointer-events-none disabled:bg-slate-400/50"
                        style={{ width: "100%" }}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <img
                            src={loaderIcon}
                            alt="loading"
                            className="size-5 animate-spin"
                          />
                        )}
                        {isLoginMode ? "Login" : "Create"}
                      </Button>
                    </div>
                  </form>

                  <h2 className="text-sm mt-6">
                    {isLoginMode ? "Do Not Own Store?" : "Already Own a Store?"}{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={() => {
                        setIsLoginMode(!isLoginMode);
                      }}
                    >
                      {isLoginMode ? "Create" : "Login"}
                    </span>
                  </h2>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PreLoadAssets>
  );
};

export default Start;
