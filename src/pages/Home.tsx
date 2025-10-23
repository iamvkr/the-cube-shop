// LANDING PAGE:
import { Button, Card } from "pixel-retroui";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../zustand/store";
import { getUser } from "../appwrite/auth";
import loaderIcon from "../assets/loader.svg";
import cartIcon from "../assets/cart.svg";
import coinIcon from "../assets/coin.svg";
import trendingIcon from "../assets/trending-up.svg";
import packageIcon from "../assets/package.svg";
import clockIcon from "../assets/clock.svg";
import playIcon from "../assets/play.svg";
import { playClickAudio } from "../playSound";
import HowToPlayModal from "../components/HowToPlayModal";

const Home = () => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isOpenTutorialModal, setisOpenTutorialModal] = useState(false);

  const playNOW = () => {
    playClickAudio();
    mainRef.current?.requestFullscreen();
    try {
      (window.screen.orientation as any).lock("landscape-primary");
    } catch (error) {}
    navigate("/start");
  };

  const { user, setUser } = useUserStore();
  useEffect(() => {
    if (user === null) {
      getUser().then((res) => {
        if (res.success) {
          setUser(res.data!); // user is logged In
        } else {
          setUser(false); //user is logged out
        }
      });
    }
  }, []);

  type FeatureCardProps = {
    icon: React.ReactNode;
    label: string;
  };

  const FeatureCard = ({ icon, label }: FeatureCardProps) => (
    <Card
      bg="#fefcd0"
      textColor="black"
      borderColor="black"
      className="flex items-center gap-3 hover:bg-[#f9f6bd] cursor-pointer"
    >
      <div>{icon}</div>
      <span className="text-gray-700 font-medium">{label}</span>
    </Card>
  );

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-gradient-to-b from-yellow-100 to-white text-gray-800 flex flex-col items-center px-6 py-10"
    >
      {/* Hero Section */}
      <section className="text-center max-w-3xl min-h-[50vh] flex items-center justify-center flex-col">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight flex flex-col items-center gap-4">
          <img src="cube_logo.png" alt="Logo" className="h-32" />
          {/* 🛍️ */}
          The Cube Shop
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Run your own store, serve quirky customers, and grow your coin stash.
          Set prices, manage stock, and unlock profits — at one click.
        </p>
        <div className="flex gap-2">
          {user === null && (
            <Button onClick={playClickAudio}>
              <img src={loaderIcon} alt="add" className="size-6 animate-spin" />
            </Button>
          )}
          {user === false && <Button onClick={playNOW}>Play Now</Button>}
          {user && (
            <Link to={"/shop"}>
              <Button
                onClick={() => {
                  playClickAudio();
                }}
              >
                Go To Shop
              </Button>
            </Link>
          )}
          <Button
            onClick={() => {
              setisOpenTutorialModal(true);
            }}
          >
            How to Play
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-16 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col gap-3 items-center">
            <img src={cartIcon} alt="cart" className="size-18" />

            <h3 className="font-semibold">Add Products</h3>
            <p className="text-sm text-gray-600">
              Spend coins to add items to your inventory. Each product has a
              base cost and stock.
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <img src={coinIcon} alt="coin" className="size-18" />
            <h3 className="font-semibold">Set Prices & Earn</h3>
            <p className="text-sm text-gray-600">
              Adjust prices within allowed profit margins. Serve customers and
              earn coins from every sale.
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <img src={trendingIcon} alt="trending" className="size-18" />
            <h3 className="font-semibold">Unlock Upgrades</h3>
            <p className="text-sm text-gray-600">
              Boost your profit cap over time with upgrades. Start a timer and
              unlock more earning potential!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Game Features</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<img src={trendingIcon} alt="trending" className="size-18" />}
            label="Profit Margin Strategy"
          />
          <FeatureCard
            icon={<img src={packageIcon} alt="trending" className="size-18" />}
            label="Inventory Management"
          />
          <FeatureCard
            icon={<img src={cartIcon} alt="cart" className="size-18" />}
            label="Real-time Orders"
          />
          <FeatureCard
            icon={<img src={coinIcon} alt="coin" className="size-18" />}
            label="Persistent Coin System"
          />
          <FeatureCard
            icon={<img src={clockIcon} alt="coin" className="size-18" />}
            label="Time-Based Upgrades"
          />
          <FeatureCard
            icon={<img src={playIcon} alt="coin" className="size-18" />}
            label="Simple Click-to-Play"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-500 text-center border-t border-gray-200 pt-6 w-full max-w-4xl">
        Made with ❤ using React, Zustand, Tailwind CSS.
        <br />
        Powered by{" "}
        <a
          href="https://appwrite.io"
          className="underline cursor-pointer"
          title="Appwrite"
          target="_blank"
        >
          Appwrite
        </a>{" "}
        © 2025{" "}
        <a
          href="/"
          className="underline cursor-pointer"
          title="The Cube Shop"
          target="_blank"
        >
          thecubeshop
        </a>{" "}
        -{" "}
        <a
          href="https://github.com/iamvkr"
          className="underline cursor-pointer"
          title="Github - Iamvkr"
          target="_blank"
        >
          Iamvkr
        </a>
      </footer>

      <HowToPlayModal
        isOpenTutorialModal={isOpenTutorialModal}
        setisOpenTutorialModal={setisOpenTutorialModal}
      />
    </div>
  );
};

export default Home;
