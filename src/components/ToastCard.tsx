// custom toast card:
import { Card } from "pixel-retroui";
import closeIcon from "../assets/close.svg";
import checkIcon from "../assets/checkbox.svg";
import type { Toast } from "react-hot-toast";

const ToastCard = ({
  t,
  message,
  mode,
}: {
  t: Toast;
  message: string;
  mode?: "success" | "fail";
}) => {
  return (
    <Card
      bg="#fefcd0"
      textColor="black"
      borderColor="black"
      className={` flex items-center justify-center gap-2 ${t.visible ? "animate-custom-enter" : "animate-custom-leave"}`}
    >
      {mode === "fail" && (
        <img src={closeIcon} alt="close" className="size-4" />
      )}
      {mode === "success" && (
        <img src={checkIcon} alt="close" className="size-4" />
      )}
      {message}
    </Card>
  );
};

export default ToastCard;
