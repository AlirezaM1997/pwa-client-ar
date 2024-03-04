import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import ReactApexChart from "react-apexcharts";
import { useWindowSize } from "@uidotdev/usehooks";

export default function ColumnChart({ data, categories, total }) {
  const { t } = useTranslation();
  const size = useWindowSize();
  const [series, setSeries] = useState([
    {
      data,
    },
  ]);

  // const max = Math.max(...series[0].data);
  // const maxIndex = series[0].data.findIndex((i) => i === max);
  // const _colors = useMemo(() => ["#C9B9EB80", "#C9B9EB80", "#C9B9EB80", "#C9B9EB80", "#C9B9EB80"], []);
  // useEffect(() => {
  // _colors[maxIndex] = "#03A6CF";
  // if (data) {
  //   setSeries([
  //     {
  //       data: [data?.user, data?.association],
  //       // data: [data?.user, data?.association, data?.skilledAssociation, data?.company, data?.setad, data?.base],
  //     },
  //   ]);
  // } else {
  //   setSeries([
  //     {
  //       data: [0, 0, 0, 0, 0, 0],
  //     },
  //   ]);
  // }
  // }, [_colors, maxIndex, data]);

  const [options] = useState({
    chart: {
      type: "bar",
      fontFamily: "Poppins",
      events: {
        dataPointSelection: () => {},
      },
    },
    colors: ["#03A6CF"],
    // responsive: [
    //   {
    //     options: {
    //       chart: {
    //         width: 550,
    //       },
    //       legend: {
    //         show: false,
    //         showForSingleSeries: false,
    //       },
    //     },
    //   },
    // ],
    plotOptions: {
      bar: {
        columnWidth: 32,
      },
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex][dataPointIndex];
        return `
        <div class="chart-tooltip">
          <p>${categories[dataPointIndex]} : ${value}</p>
        </div>`;
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      xaxis: {
        type: "category",
        lines: {
          show: true,
        },
      },
      show: true,
      borderColor: "#ECECEC",
      strokeDashArray: 0,
      position: "back",
      clipMarkers: true,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: ["#484848"],
          fontFamily: "Poppins",
          fontSize: size.width < 480 ? "12px" : "8px",
          fontWeight: "600",
        },
      },
    },
    yaxis: {
      min: 0,
      max: total,
      //خط پایین رو کامنت کردم واسه اینکه وقتی عدد توتال زیاد میشد اعداد تو هم میرفتن
      // tickAmount: total,
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
  });
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={380} />
    </div>
  );
}
