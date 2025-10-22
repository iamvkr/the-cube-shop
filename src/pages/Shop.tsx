// IN GAME SHOP PAGE
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "pixel-retroui";
import { useGameStore, useUserStore } from "../zustand/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import addBoxIcon from "../assets/add-box.svg";
import cartIcon from "../assets/cart.svg";
import coinIcon from "../assets/coin.svg";
import loaderIcon from "../assets/loader.svg";
import volumeIcon from "../assets/volume2.svg";
import volumeXIcon from "../assets/volumeX.svg";
import { AddProductModal } from "../components/inventory/AddProductModal";
import { InventoryModal } from "../components/inventory/InventoryModal";
import { CustomerPopup } from "../components/CustomerModals";
import AuthProvider from "../AuthProvider";
import { createUserGameData, listUserGameData } from "../appwrite/db";
import SplashView from "../components/SplashView";
import { logoutUser } from "../appwrite/auth";
import { getRandom } from "../utils";
import PreLoadAssets from "../components/PreLoadAssets";

const Shop = () => {
  const { user } = useUserStore();
  const {
    isGameStarted,
    setIsGameStarted,
    currentCustomer,
    coins,
    setCoins,
    spawnCustomer,
    customerState,
    setCustomerState,
    inventory,
    setInventory,
    // gameDataRow,
    setGameDataRow,
    bgm,
  } = useGameStore();
  const [gameResponseiveWrapper, setgameResponseiveWrapper] = useState({
    scale: "100%",
  });
  const [activeModal, setActiveModal] = useState<String | null>(null);
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

  useEffect(() => {
    if (inventory.length <= 0 && coins < 0 && user) {
      // get inventory from db:
      const getInventory = async () => {
        const res = await listUserGameData(user.$id);
        if (res.success) {
          const rows = res.data!;
          if (rows.total <= 0) {
            // inventory do not exist:
            // cretate new empty inventory to db:
            const cr = await createUserGameData({ userId: user.$id });
            if (cr.success && cr.data) {
              console.log("succesfully created a New Data");
              setCoins(500);
              return true;
            }
          } else {
            // set game data locally:
            setGameDataRow(rows.rows[0]);

            // update local inventory with db inventory:
            if (rows.rows[0].inventoryItems)
              setInventory(JSON.parse(rows.rows[0].inventoryItems));
            setCoins(rows.rows[0].userCoins);
          }
        }
      };
      getInventory();
    }
  }, [user]);

  const [bgLoaded, setBgLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "./bg_shop_view.png";
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
    if (isBgmEnabled === null) {
      localStorage.setItem("bgm", "true");
      bgm.setIsPlaying(true);
    } else if (isBgmEnabled === "true") {
      localStorage.setItem("bgm", "true");
      bgm.setIsPlaying(true);
    } else {
      bgm.setIsPlaying(false);
    }

    const cTimer = setTimeout(() => {
      setCustomerState({
        isVisisble: true,
        profileIndex: getRandom(1, 4), // generate bw 1 - 4
      });
    }, getRandom(10000, 30000)); // arrival at 10s to 30s
    return () => {
      clearTimeout(cTimer);
    };
  }, []);

  return (
    <PreLoadAssets>
      <AuthProvider>
        <div className="flex flex-col  items-center justify-center h-screen overflow-hidden bg-blue-200 gap-4">
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
                  backgroundImage: `url("./bg_shop_view.png")`,
                }}
              >
                {/* SNOWFLAKES*/}
                {[...new Array(20)].map((_, i) => (
                  <div className="snowflake" key={i}>
                    ❆
                  </div>
                ))}

                <div className="absolute top-4 left-4 flex items-center gap-4">
                  {/* HEADING */}
                  <Card
                    bg="#fefcd0"
                    textColor="black"
                    borderColor="black"
                    className=""
                  >
                    {user && user.name}
                  </Card>
                  {/* PLUS ADD Product */}
                  <Button
                    bg="#fefcd0"
                    textColor="black"
                    borderColor="black"
                    shadow="#c381b5"
                    className="flex items-center gap-1"
                    onClick={() => setActiveModal("add")}
                  >
                    <img src={addBoxIcon} alt="Add" className="size-5" />
                    ADD Product
                  </Button>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-4">
                  {/* COINS */}
                  <Button
                    bg="#fefcd0"
                    textColor="black"
                    borderColor="black"
                    shadow="#c381b5"
                    className="flex items-center gap-1"
                  >
                    {coins < 0 ? (
                      <img
                        src={loaderIcon}
                        alt="laoding"
                        className="size-5 animate-spin"
                      />
                    ) : (
                      <>
                        <img src={coinIcon} alt="Add" className="size-5" />
                        {coins}
                      </>
                    )}
                  </Button>
                  {/* EXIT */}
                  <Button
                    bg="#fefcd0"
                    textColor="black"
                    borderColor="black"
                    shadow="#c381b5"
                    onClick={() => {
                      navigate("/");
                      setTimeout(() => {
                        window.location.reload();
                      }, 100);
                    }}
                  >
                    Exit Game
                  </Button>
                  {/* ACCOUNT */}
                  <DropdownMenu
                    bg="#fefcd0"
                    textColor="black"
                    borderColor="black"
                    shadowColor="#c381b5"
                  >
                    <DropdownMenuTrigger>Settings</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="flex gap-2 my-2">
                        <span
                          onClick={async () => {
                            await logoutUser();
                            navigate("/");
                            setTimeout(() => {
                              window.location.reload();
                            }, 100);
                          }}
                        >
                          Logout
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <div
                          className="flex gap-2 my-2"
                          onClick={() => {
                            setIsSfxEnabled(!isSfxEnabled);
                            localStorage.setItem(
                              "sfx",
                              JSON.stringify(!isSfxEnabled)
                            );
                          }}
                        >
                          <img
                            src={isSfxEnabled ? volumeIcon : volumeXIcon}
                            alt="volume"
                            className="size-5"
                          />
                          Sound
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div
                          className="flex gap-2 my-2"
                          onClick={() => {
                            bgm.setIsPlaying(!bgm.isPlaying);
                            localStorage.setItem(
                              "bgm",
                              JSON.stringify(!bgm.isPlaying)
                            );
                          }}
                        >
                          <img
                            src={bgm.isPlaying ? volumeIcon : volumeXIcon}
                            alt="volume"
                            className="size-5"
                          />
                          BGM
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

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

                {/* Computer box */}
                <Button
                  bg="gray"
                  textColor="black"
                  borderColor="gray"
                  onClick={() => setActiveModal("inventory")}
                  //   shadowColor="#c381b5"
                  className="p-4 text-center absolute bottom-32 left-80 text-xs w-37 h-28 hover:bg-[#479955] bg-[#56ba67] cursor-pointer flex flex-col items-center justify-center"
                >
                  <img src={cartIcon} alt="Add" className="size-5" />
                  Inventory
                </Button>

                {/* customer box: */}
                {customerState.isVisisble && (
                  <div
                    onClick={spawnCustomer}
                    className="text-center absolute bottom-34 left-150 text-xs w-37 h-45 overflow-hidden cursor-pointer"
                  >
                    {customerState.profileIndex === 1 && (
                      <img src={"/man_1.png"} alt="Add" />
                    )}
                    {customerState.profileIndex === 2 && (
                      <img src={"/man_2.png"} alt="Add" />
                    )}
                    {customerState.profileIndex === 3 && (
                      <img src={"/woman_1.png"} alt="Add" />
                    )}
                    {customerState.profileIndex === 4 && (
                      <img src={"/woman_2.png"} alt="Add" />
                    )}
                  </div>
                )}

                {/* Modals */}
                {activeModal === "add" && (
                  <AddProductModal onClose={() => setActiveModal(null)} />
                )}
                {activeModal === "inventory" && (
                  <InventoryModal onClose={() => setActiveModal(null)} />
                )}
                {currentCustomer && (
                  <CustomerPopup onClose={() => setActiveModal(null)} />
                )}
              </div>
            </div>
          )}
        </div>
      </AuthProvider>
    </PreLoadAssets>
  );
};

export default Shop;
