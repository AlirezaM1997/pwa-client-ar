import "swiper/css";
import { useState } from "react";
import Image from "next/legacy/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { saveToStorage } from "@functions/saveToStorage";

export default function IntroductionModal({ t, lang, introductionModal, setIntroductionModal }) {
  const [page, setPage] = useState(1);
  const [mySwiper, setMySwiper] = useState({});

  return (
    <>
      <div
        className={`${
          introductionModal ? "" : "hidden"
        } h-screen fixed flex flex-col bottom-0 z-[9999999] w-full top-0 left-0`}
      >
        <Swiper
          className="mySwiper-introduction-modal"
          onInit={(ev) => {
            setMySwiper(ev);
          }}
          onSlideChange={(e) => setPage(e.activeIndex + 1)}
        >
          <SwiperSlide>
            <div className="flex flex-col items-center justify-center  relative h-full px-5">
              <div className="w-[340px] h-[290px] absolute left-0 top-0 z-10">
                <Image
                  src="/assets/images/introduction-rectangle.png"
                  layout="fill"
                  alt={"logo"}
                ></Image>
              </div>
              <div className="w-[160px] h-[120px] relative mr-3 ltr:ml-3">
                <Image src="/assets/images/logo.png" layout="fill" alt={"logo"}></Image>
              </div>
              <h1 className="heading pb-[10px] pt-5">{t("introduction.welcomeToUnityvo")}</h1>
              <p className="text-gray4 caption1 text-center">
                {t("introduction.welcomeToUnityvoDes")}
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center justify-center  relativ h-full px-5">
              <div className="w-[345px] h-[320px] relative mr-3 ltr:ml-3">
                <Image src="/assets/images/create-request.png" layout="fill" alt={"logo"}></Image>
              </div>
              <h1 className="heading pb-[10px] pt-5 w-full">{t("createRequest")}</h1>
              <p className="text-gray4 caption1 text-justify">
                {t("introduction.createRequestDes")}
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center justify-center  relative h-full px-5">
              <div className="w-[340px] h-[318px] relative mr-3 ltr:ml-3">
                <Image src="/assets/images/create-project.png" layout="fill" alt={"logo"}></Image>
              </div>
              <h1 className="heading pb-[10px] pt-5 w-full">
                {t("introduction.createProjectByAssociation")}
              </h1>
              <p className="text-gray4 caption1 text-justify">
                {t("introduction.createProjectByAssociationDes")}
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center justify-center  relative h-full px-5">
              <div className="w-[348px] h-[336px] relative mr-3 ltr:ml-3">
                <Image
                  src="/assets/images/participation-in-app.png"
                  layout="fill"
                  alt={"logo"}
                ></Image>
              </div>
              <h1 className="heading pb-[10px] pt-5 w-full">
                {t("introduction.participationInApp")}
              </h1>
              <p className="text-gray4 caption1 text-justify">
                {t("introduction.participationInAppDes")}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
        <div className="flex items-center justify-between w-full z-10 bottom-[40px] px-5 fixed left-1/2 -translate-x-1/2">
          <button
            className={`heading `}
            onClick={() => {
              document.body.style.overflow = "unset";
              setIntroductionModal(false);
              saveToStorage("isFirstVisit", 1);
            }}
          >
            {t("skip")}
          </button>
          <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <button
              className={`rounded-sm w-2 h-2 border-gray1 border-[2px] mx-[2.5px] ${
                page === 1 ? "bg-gray1" : ""
              }`}
            ></button>
            <button
              className={`rounded-sm w-2 h-2 border-gray1 border-[2px] mx-[2.5px] ${
                page === 2 ? "bg-gray1" : ""
              }`}
            ></button>
            <button
              className={`rounded-sm w-2 h-2 border-gray1 border-[2px] mx-[2.5px] ${
                page === 3 ? "bg-gray1" : ""
              }`}
            ></button>
            <button
              className={`rounded-sm w-2 h-2 border-gray1 border-[2px] mx-[2.5px] ${
                page === 4 ? "bg-gray1" : ""
              }`}
            ></button>
          </div>
          <button
            className={`heading text-main1`}
            onClick={() =>
              page !== 4
                ? (setPage(page + 1), mySwiper.slideNext())
                : (setIntroductionModal(false),
                  (document.body.style.overflow = "unset"),
                  saveToStorage("isFirstVisit", 1))
            }
          >
            {t("next")}
          </button>
        </div>
      </div>
    </>
  );
}
