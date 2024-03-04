import Link from "next/link";
import Image from "next/legacy/image";
import { useWindowSize } from "@uidotdev/usehooks";
import { Message, MoreSquare, Profile } from "iconsax-react";
// FUNCTION
import { getRequirementsName } from "@functions/getRequirementsName";

export default function TopOfCard({
  t,
  data,
  tPM,
  participator,
  participatorImage,
  lang,
  openDottedMenu,
  setOpenDottedMenu,
  useInModal = false,
}) {
  const size = useWindowSize();
  return (
    <>
      <div className="flex items-start justify-between w-full">
        <div className="flex w-full gap-[13px]">
          <div className=" relative w-[45px] h-[45px] lg:w-[68px] lg:h-[68px] rounded-full ">
            <Image
              src={participatorImage ? participatorImage : "/assets/images/default-user-image.png"}
              layout="fill"
              alt={"Participator-Image"}
              className="rounded-full p-2 cover-center-img"
            ></Image>
          </div>
          <div>
            <p className="heading lg:titleDesktop4 text-black">{participator || t("anonymous")}</p>
            <div className="flex flex-row pt-1">
              <p className="caption2 lg:captionDesktop4 text-gray3">
                {tPM("participationType")} {"."}
              </p>
              <p className="caption2 lg:captionDesktop4 text-black px-1">
                {getRequirementsName(data.type, lang)}
              </p>
            </div>
          </div>
        </div>
        {!useInModal && participator && (
          <div className="relative">
            <div
              className=" cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDottedMenu(!openDottedMenu);
              }}
            >
              <MoreSquare color="#ACACAF" size={size.width < 960 ? 28 : 32} />
            </div>
            {openDottedMenu && (
              <div
                className="bg-white absolute rtl:left-[3px] ltr:right-[3px] top-[34px] border-[1px] lg:border-[2px] border-gray4 rounded-[10px] rtl:rounded-tl-none ltr:rounded-tr-none px-2 py-3 lg:px-[14px] lg:py-[14px]"
                onClick={(e) => e.stopPropagation()}
              >
                {data.participator.role === "association" && (
                  <Link href={`/association-profile/${data.participator._id}`} prefetch={false}>
                    <div className="flex items-center gap-x-2">
                      <Profile color="#484848" size={16} />
                      <p className="caption4 text-gray1">{t("profile")}</p>
                    </div>
                  </Link>
                )}
                <Link
                  href={
                    size.width < 960
                      ? `/messages/${data.participator._id}?name=${data.participator.name}`
                      : `/messages/?id=${data.participator._id}&name=${data.participator.name}`
                  }
                  prefetch={false}
                >
                  <div className="flex items-center gap-x-2 mt-[9px] lg:mt-4">
                    <Message color="#484848" size={16} />
                    <p className="caption4 text-gray1">{t("chat")}</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
