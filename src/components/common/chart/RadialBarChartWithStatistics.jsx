import dynamic from "next/dynamic";
//COMPONENT
const RadialBarChart = dynamic(() => import("@components/common/chart/RadialBarChart"), {
  ssr: false,
});

export default function RadialBarChartWithStatistics({ data, participationPercentage, label }) {
  return (
    <>
      <div className="">
        <RadialBarChart data={data} label={label} />
        <div className={`grid grid-cols-2 pt-6 pb-[55px] pr-[37px] ltr:pl-[37px]`}>
          {participationPercentage.slice(0, 6).map((i, j) => (
            <div key={j} className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  i.name === "ظرفیت"
                    ? "bg-main1"
                    : i.name === "مالی"
                    ? "bg-[#7F3DFF]"
                    : i.name === "ایده"
                    ? "bg-[#E5C413]"
                    : i.name === "معنوی"
                    ? "bg-danger"
                    : i.name === "حضوری"
                    ? "bg-[#D307A6]"
                    : "bg-[#0EB26E]"
                }`}
              ></div>
              <p className={`caption3 pr-[6px] pl-[15px] ltr:pl-[6px] ltr:pr-[15px]`}>{i.name}</p>
              <p className="caption3">{i.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
