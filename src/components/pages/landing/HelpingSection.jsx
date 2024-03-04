import Image from "next/legacy/image";

export default function HelpingSection({ tLanding }) {
  return (
    <>
      <section className="flex flex-col lg:flex-row-reverse lg:gap-x-[67px] relative">
        <div className="flex items-center justify-center gap-5 ">
          <div className="relative w-[165px] h-[260px] lg:w-[300px] lg:h-[500px]">
            <Image
              src={"/assets/images/landing/HelpingSection1.png"}
              layout="fill"
              alt="HelpingSection1"
              className=" rounded-[20px]"
            />
          </div>
          <div className="flex flex-col gap-y-5 lg:-mt-[100px]">
            <div className="relative w-[143px] h-[141px] lg:w-[277px] lg:h-[280px]">
              <Image
                src={"/assets/images/landing/HelpingSection2.png"}
                layout="fill"
                alt="SendLink-image"
                className=" rounded-[20px]"
              />
            </div>
            <div className="relative w-[143px] h-[100px] lg:w-[277px] lg:h-[180px]">
              <Image
                src={"/assets/images/landing/SendLink.png"}
                layout="fill"
                alt="SendLink-image"
                className=" rounded-[20px]"
              />
            </div>
          </div>
        </div>
        <div className="mt-[62px] lg:w-2/3 relative">
          <div className="relative">
            <h1 className="mb-[11px] text-[18px] font-bold leading-[22px] lg:text-[24px] lg:leading-[40px] before:absolute before:w-[98px] before:lg:w-[98px] before:h-[11px] before:bg-main4 before:top-1/2 before:lg:top-1/2 before:-translate-y-1/2 before:-z-[1]">
              {tLanding("helpingTitle")}
            </h1>
          </div>
          <h3 className="caption1 text-[14px] font-normal leading-[30px] lg:text-[20px] lg:font-medium lg:leading-[40px] text-justify">
            {tLanding("helpingDes")}
          </h3>
          <div className="absolute -top-[50px] lg:-top-[10px] lg:ltr:-right-[100px] lg:rtl:-left-[100px] -z-[1]">
            <div className="relative w-[266px] h-[40px] lg:w-[340px] lg:h-[50px]">
              <Image src={"/assets/svg/landing/helpingPath.svg"} layout="fill" alt="helpingPath" />
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute ltr:left-[42px] rtl:-left-[42px]  lg:top-[41px] bg-main9 lg:h-[418px] lg:w-[95%] -z-[2] lg:rounded-bl-[120px]"></div>
        <div className="absolute top-[35%] lg:top-[unset] lg:bottom-[40px] lg:right-[12%] right-[15%] ">
          <div className="relative w-[40px] h-[40px] lg:w-[50px] lg:h-[50px]">
            <Image src={"/assets/svg/landing/blue-circle-3.svg"} layout="fill" alt="helpingPath" />
          </div>
        </div>
      </section>
    </>
  );
}
