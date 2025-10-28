import { Popup } from "pixel-retroui";
import ReactPlayer from "react-player";

const HowToPlayModal = ({
  isOpenTutorialModal,
  setisOpenTutorialModal,
}: {
  isOpenTutorialModal: boolean;
  setisOpenTutorialModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    isOpenTutorialModal && (
      <Popup
        isOpen={true}
        onClose={() => {
          setisOpenTutorialModal(false);
        }}
        bg="#fefcd0"
        baseBg="#c381b5"
        textColor="black"
        borderColor="black"
        className="m-0"
      >
        <div className="w-full h-60 xl:w-160 xl:h-80 rounded overflow-hidden">
        <ReactPlayer
          src="https://m.youtube.com/watch?v=43B930Mu6Vw"
          className="w-full h-full "
          controls={true}
        />
        </div>
      </Popup>
    )
  );
};

export default HowToPlayModal;
