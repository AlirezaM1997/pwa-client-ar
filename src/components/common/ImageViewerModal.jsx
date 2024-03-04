import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { CloseCircle } from "iconsax-react";
import { Autoplay, FreeMode, Navigation } from "swiper";
import { useRouter } from "next/router";


export default function ImageViewerModal({ currentImage = 0, imgs, open, setOpen }) {
  const router = useRouter()
  return (
    <>
      <div
        className={`${
          open ? "block" : "hidden"
        } bg-black fixed w-full h-screen z-[99999] top-0 right-0`}
      >
        <div className="w-full h-full pt-8">
          <CloseCircle
            size={30}
            variant="Bold"
            color="#fff"
            className="mr-4 mb-8 cursor-pointer"
            onClick={() => {
              document.body.style.overflow = "unset";
              router.back()
            }}
          />
          <Swiper
            style={{
              "--swiper-navigation-color": "#fff",
            }}
            spaceBetween={10}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            initialSlide={currentImage}
            navigation={true}
            modules={[Autoplay, FreeMode, Navigation]}
            className="mySwiper2-top-of-profileProject mySwiper-ImageViewerModal"
          >
            {imgs.map((imgSrc, i) => (
              <SwiperSlide key={"mySwiper-ImageViewerModal" + i}>
                <Image alt="profile-image" src={imgSrc} layout="fill" className="custom-img" />
              </SwiperSlide>
            ))}
          </Swiper>
          <style>{`
            .mySwiper-ImageViewerModal {
                --tw-bg-opacity: 1;
                background-color: rgb(46 46 46 / var(--tw-bg-opacity));
                border-radius: 14px;
                overflow: hidden;
                display: flex;
                align-items: center;
                max-height: 80%
            }
            .mySwiper-ImageViewerModal .swiper-wrapper{
                align-items: center
            }
            .mySwiper-ImageViewerModal .swiper-slide {
                width: 100% !important;
            }
            .mySwiper-ImageViewerModal .swiper-button-next:after, .mySwiper-ImageViewerModal .swiper-button-prev:after {
               font-size:30px
            }
      `}</style>
        </div>
      </div>
    </>
  );
}
