import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowCircleLeft2, ArrowCircleRight2 } from "iconsax-react";

export default function HorizontalCarousel({
  setIsLoading,
  t,
  lang,
  link,
  query,
  title,
  linkTitle,
  lgTitleMb = "mb-[30px]",
  spaceBetween = "14",
  slidesOffsetBefore = "10",
  array,
  hasShowMore,
  hasShowMoreWhiteIcon = false,
  swiperSlideWidth = "80% !important",
  classNames = "",
  onClickOnShowMore = () => null,
}) {
  const router = useRouter();

  return (
    <div className={`horizontalCarousel ${classNames} ${array?.length === 0 ? "hidden" : ""}`}>
      <div
        className={`flex items-center justify-between px-4 lg:px-0 lg:rtl:pl-[30px] lg:rtl:pr-[10px] lg:ltr:pr-[30px] lg:ltr:pl-[10px] mb-[7px] lg:${lgTitleMb}`}
      >
        <h1 className="titleInput text-black lg:ctaDesktop2 lg:leading-[26px] lg:text-gray1">
          {title}
        </h1>
        {hasShowMore && !hasShowMoreWhiteIcon && (
          <button
            onClick={() => {
              router.push({ pathname: link, query }, undefined, { shallow: true });
              setIsLoading(true);
            }}
            className="flex items-center cta2 lg:title4 underline text-main2"
          >
            {linkTitle || t("seeAll")}
          </button>
        )}
        {!hasShowMore && hasShowMoreWhiteIcon && (
          <button
            onClick={() => {
              router.push({ pathname: link, query }, undefined, { shallow: true });
              onClickOnShowMore();
              document.body.style.overflow = "unset";
            }}
            className="flex items-center cta3 text-main2"
          >
            <p className="mx-[6px]">{t("seeMore")}</p>
            <div
              className={` rounded-full inline-block relative ${lang == "ar" ? "" : "rotate-180"}`}
            >
              <div
                className={` absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/ rounded-full w-4 h-4`}
              ></div>
              <div className="z-[10] relative">
                {lang == "ar" ? (
                  <ArrowCircleLeft2 color="#03A6CF" variant="Bulk" size={19} />
                  ) : (
                  <ArrowCircleRight2 color="#03A6CF" variant="Bulk" size={19} />
                )}
              </div>
            </div>
          </button>
        )}
      </div>
      <Swiper
        slidesPerView="auto"
        slidesOffsetAfter={10}
        slidesOffsetBefore={slidesOffsetBefore}
        spaceBetween={spaceBetween}
        pagination={{
          clickable: true,
        }}
        style={{ zIndex: "0" }}
        className="mySwiper"
        key={array.join(",")}
      >
        {array?.map((i, j) => (
          <SwiperSlide key={j * 4}>{i}</SwiperSlide>
        ))}
      </Swiper>
      <style>{`
      .horizontalCarousel .swiper {
        width: 100%;
        height: 100%;
      }
     .horizontalCarousel .swiper-slide {
        text-align: center;
        font-size: 18px;
        width: ${swiperSlideWidth} ;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        flex-shrink: 1
      }
      `}</style>
    </div>
  );
}
