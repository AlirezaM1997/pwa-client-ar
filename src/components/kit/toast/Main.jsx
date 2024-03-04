import { Danger, InfoCircle, Information, TickCircle } from "iconsax-react";

export default function Toast({ text, status = "SUCCESS" }) {
  const lookupStatus = {
    SUCCESS: <TickCircle color="#43936C" />,
    ERROR: <InfoCircle color="#CB3A31" />,
    INFO: <Information color="#3267E3" />,
    WARNING: <Danger color="#FF8800" />,
  };
  const lookupBgColor = {
    SUCCESS: "bg-[#EBF8F1]",
    ERROR: "bg-[#FFEBEB]",
    INFO: "bg-[#EBEFF7]",
    WARNING: "bg-[#FFF3D8]",
  };
  return (
    <>
      <div
        className={` max-w-md w-full ${lookupBgColor[status]}  shadow-lg rounded-lg flex gap-x-3 items-center h-[72px] px-3`}
      >
        <div className="">{lookupStatus[status]}</div>
        <div className="">{text}</div>
      </div>
    </>
  );
}
