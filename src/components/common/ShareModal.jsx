import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { toast } from "react-hot-toast";
import { useWindowSize } from "@uidotdev/usehooks";
import { CloseCircle, Link2 } from "iconsax-react";
import { FacebookShareButton, WhatsappShareButton, WhatsappIcon, FacebookIcon } from "next-share";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function ShareModal({ open, close, data, t, shareLink }) {
  const size = useWindowSize();

  return (
    <>
      <CustomTransitionModal
        open={open}
        close={close}
        width={size.width < 960 ? "330px" : ""}
        hasCloseBtn={false}
      >
        <div className="h-[145px] lg:h-[184px] bg-gray6 rounded-t-[20px]">
          <div
            className=" absolute top-[18px] ltr:right-3 rtl:left-3 cursor-pointer"
            onClick={close}
          >
            <CloseCircle />
          </div>
          <div className=" relative w-[238px] h-[140px] lg:w-[354px] lg:h-[209px] mx-auto -top-[30px] lg:-top-[52px]">
            <Image
              src={
                data?.imgs && data?.imgs[0]
                  ? data?.imgs[0]
                  : data?.image
                  ? data?.image
                  : "/assets/images/default-project-card-image.png"
              }
              layout="fill"
              alt={"image-share"}
              className="rounded-[14px] cover-center-img"
            ></Image>
          </div>
        </div>
        <div className="flex flex-col pt-5 pb-7 px-4">
          <h1 className="text-center heading">{data?.title}</h1>
          <div className="flex gap-x-[30px] lg:gap-x-[48px] justify-center mt-[47px] mb-[37px]">
            <div className="w-[60px] h-[60px] lg:w-[85px] lg:h-[85px] rounded-full bg-[#EAFFEA] flex items-center justify-center">
              <WhatsappShareButton
                url={shareLink}
                title={data?.title}
                separator=":: "
                aria-valuetext={data?.title}
              >
                <WhatsappIcon size={size.width < 960 ? 25 : 30} round />
              </WhatsappShareButton>
            </div>
            <div className="w-[60px] h-[60px] lg:w-[85px] lg:h-[85px] rounded-full bg-[#EAF2FF] flex items-center justify-center">
              <FacebookShareButton url={shareLink} title={data?.title} hashtag={"#mofid"}>
                <FacebookIcon size={size.width < 960 ? 25 : 30} round />
              </FacebookShareButton>
            </div>
          </div>
          <p className="caption3 pb-[6px] ltr:text-left rtl:text-right">{t("copyLink")}</p>
          <div className="grid grid-cols-[auto_40px] lg:grid-cols-[auto_44px] gap-x-2">
            <div
              dir="ltr"
              className="px-4 py-2 border-[1px] border-gray6 rounded-lg text-left caption3 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {shareLink}
            </div>
            <button
              className="bg-main2 rounded-lg flex justify-center items-center lg:h-[44px]"
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast.custom(() => <Toast text={t("successfulCopyLinkToast")} />);
              }}
            >
              <Link2 color="#ffffff" size={26} />
            </button>
          </div>
        </div>
      </CustomTransitionModal>
    </>
  );
}
