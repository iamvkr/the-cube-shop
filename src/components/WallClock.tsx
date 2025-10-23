import { useState, useEffect } from "react";

const WallClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Format the time as HH:MM:SS
  const formatTime = (date: Date) => {
    let formatHours = date.getHours();
    formatHours = formatHours >= 12 ? (formatHours - 12) :formatHours;
    const hours = String(formatHours).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex justify-center items-center text-[#004254] text-xl font-semibold">
      <h1>{formatTime(time)}</h1>
    </div>
  );
};

export default WallClock;
