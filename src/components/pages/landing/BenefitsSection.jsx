import Image from "next/legacy/image";
import { useWindowSize } from "@uidotdev/usehooks";
import { Chart, EmptyWallet } from "iconsax-react";

export default function BenefitsSection({ tLanding }) {
  const size = useWindowSize();

  const Card = ({ icon, title, description }) => {
    return (
      <div className=" rounded-[30px] shadow-[4px_10px_30px_0] shadow-[#0000001A] w-[328px] h-[295px] 2xl:w-[405px] 2xl:h-[363px] flex flex-col items-center py-6 2xl:pt-[47px] 2xl:pb-[28px] px-6 2xl:px-[30px] text-center">
        <div className="w-[70px] h-[70px] 2xl:w-[90px] 2xl:h-[90px] rounded-full bg-main2 flex items-center justify-center shadow-[4px_10px_30px_0] shadow-[#03A6CF66]">
          {icon}
        </div>
        <h1 className="pt-[18px] pb-1 2xl:pt-[30px] 2xl:pb-[13px] text-[17px] font-bold leading-[34px] 2xl:text-[22px] 2xl:font-bold 2xl:leading-[34px] whitespace-nowrap">
          {title}
        </h1>
        <h4 className="2xl:text-[18px] 2xl:font-normal 2xl:leading-[30px]">{description}</h4>
      </div>
    );
  };

  const list = [
    {
      icon: <Chart color="white" size={size.width > 960 ? 46 : 30} />,
      title: tLanding("benefit1Title"),
      description: tLanding("benefit1Des"),
    },
    {
      icon: (
        <div className="relative">
          <Image
            alt={"volunteerIcon"}
            src="/assets/svg/landing/volunteerIcon.svg"
            width={size.width > 960 ? "50px" : "40px"}
            height={size.width > 960 ? "50px" : "40px"}
          />
        </div>
      ),
      title: tLanding("benefit2Title"),
      description: tLanding("benefit2Des"),
    },
    {
      icon: <EmptyWallet color="white" size={size.width > 960 ? 46 : 30} />,
      title: tLanding("benefit3Title"),
      description: tLanding("benefit3Des"),
    },
  ];

  return (
    <>
      <div className="relative">
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-9 -z-[1]">
          <div className="relative w-[266px] h-[40px] lg:w-[655px] lg:h-[50px]">
            <Image src={"/assets/svg/landing/benefitPath.svg"} layout="fill" alt="helpingPath" />
          </div>
        </div>
        <h1 className=" text-center text-[18px] font-bold leading-[22px] lg:text-[24px] lg:font-bold lg:leading-[22px] before:absolute before:w-[60px] before:lg:w-[60px] before:h-[9px] before:lg:h-[11px] before:bg-main4 before:top-1/2 before:-translate-y-1/2 before:-z-[1]">
          {tLanding("keyBenefits")}
        </h1>
      </div>
      <main className="flex gap-y-[30px] flex-col lg:flex-row items-center justify-between mt-[30px] lg:mt-[72px]">
        {list.map((item, _index) => (
          <div key={_index}>
            <Card icon={item.icon} title={item.title} description={item.description} />
          </div>
        ))}
      </main>
    </>
  );
}
