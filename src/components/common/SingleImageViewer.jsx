import dynamic from "next/dynamic";
import { CloseCircle } from "iconsax-react";
import Image from "next/image";
// COMPONENT dynamic import
const ModalScreen = dynamic(() => import("./ModalScreen"), { ssr: false });

export default function SingleImageViewer({ open, setOpen, url, setUrl, title = "" }) {
  return (
    <ModalScreen
      open={open}
      close={() => {
        setOpen(false);
        document.body.style.overflow = "unset";
      }}
    >
      <div className="px-2 h-screen flex flex-col items-center py-[40px] bg-black">
        <div
          className=" absolute top-[40px] right-5 cursor-pointer"
          onClick={() => {
            setOpen(false);
            setUrl(null);
            document.body.style.overflow = "unset";
          }}
        >
          <CloseCircle variant="Bold" color="#FFFFFF" />
        </div>
        <h4 className="text-white title1 mb-5">{title}</h4>
        <div className="relative m-auto center-iamge-in-modal">
          {url && (
            <div className="unset-img">
              <Image alt="profile-image" src={url} layout="fill" className="custom-img" />
            </div>
          )}
        </div>
      </div>
    </ModalScreen>
  );
}
