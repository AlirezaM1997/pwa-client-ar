import Link from "next/link";
import Image from "next/legacy/image";
import { Verify } from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";

export default function ImageSlider({ title, data, lang }) {
  const size = useWindowSize();

  return (
    <>
      <div className="px-4 pb-[50px] relative imageSlider">
        <h1 className="titleInput lg:ctaDesktop2 lg:leading-[26px] text-center mb-[30px] lg:mb-[40px]">
          {title}
        </h1>
        {/* <Slider {...settings}>
          {data?.map((i, j) => (
            <Link
              key={j}
              href={`/association-profile/${i._id}`}
              className="flex flex-col items-center justify-center "
              prefetch={false}
            >
              <div className="centerSlide relative w-[84px] h-[84px] lg:w-[100px] lg:h-[100px]">
                <Image
                  src={i.image ? i.image : "/assets/images/default-association-image.png"}
                  layout="fill"
                  alt={"image"}
                  className="rounded-full cover-center-img"
                ></Image>
              </div>
              <div className="flex items-start justify-center flex-row gap-1 pt-2">
                <h4 className="caption3 leading-[16px] text-center break-words max-w-[90px]">
                  {i.name}
                </h4>
                {data?.verifyBadge && (
                  <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0 mt-1" />
                )}
              </div>
              {i.averageScore > 0 && (
                <div className="flex items-center justify-center mt-1">
                  <span className="text-[10px] leading-[20px] font-normal ltr:mr-1 rtl:ml-1">
                    {i.averageScore}
                  </span>
                  <Star w={8} h={8} fill="#FFC800" color="#FFC800" />
                </div>
              )}
            </Link>
          ))}
        </Slider> */}
      </div>
    </>
  );
}
