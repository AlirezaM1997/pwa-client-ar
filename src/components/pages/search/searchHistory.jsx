import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft2, ArrowRight2, HuobiToken } from "iconsax-react";
import { getCookie } from "cookies-next";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

const SearchTag = ({ text, setText, lang }) => {
  return (
    <CustomButton
      title={text}
      styleType="Secondary"
      borderColor="border-gray3"
      size="X"
      textColor="text-gray3"
      paddingX="rtl:pr-3 rtl:pl-[5px] ltr:pl-3 ltr:pr-[5px]"
      onClick={() => setText(text)}
      icon={
        lang == "ar" ? (
          <ArrowLeft2 color="#727272" size={16} />
        ) : (
          <ArrowRight2 color="#727272" size={16} />
        )
      }
      isIconLeftSide={lang == "ar" ? true : false}
    />
  );
};

const SearchHistory = ({ t, setSearch, classNames = "" }) => {
  const lang = getCookie("NEXT_LOCALE");
  // const historyOfSearches = [
  //   "charity",
  //   "orphans",
  //   "mosque",
  //   "Arba'in",
  //   "school"
  // ];
  const popularSearches = ["سلامت و درمان", "پزشکی", "محیط زیست", "کاشت درخت", "ایتام"];

  const removeHistoryOfSearches = () => {
    alert("deleted all");
  };

  return (
    <>
      <div
        className={`flex flex-col gap-[30px] px-4 lg:ltr:px-[23px] lg:mt-0 horizontalCarousel ${classNames}`}
      >
        <div className="flex flex-row gap-[6px]">
          <HuobiToken size={16} />
          <span className="cta3 text-black">{t("popularSearches")}</span>
        </div>
        <Swiper
          slidesPerView="auto"
          slidesOffsetAfter={10}
          slidesOffsetBefore="0"
          spaceBetween="14px"
          pagination={{
            clickable: true,
          }}
          style={{ zIndex: "0" }}
          className="popularSearches"
        >
          {popularSearches?.map((item, index) => (
            <SwiperSlide key={index + "popularSearches"}>
              <SearchTag lang={lang} text={item} setText={setSearch} />
            </SwiperSlide>
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
        width: max-content!important;
        white-space: nowrap;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        flex-shrink: 1
      }
      .popularSearches .swiper-wrapper {
        width: max-content
      }
      `}</style>
      </div>
    </>
  );
};

export default SearchHistory;
