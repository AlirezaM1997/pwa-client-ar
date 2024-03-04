import ReactApexChart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { getCookie } from "cookies-next";

export default function LineChart({ data, categories }) {
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const [series, setSeries] = useState([
    {
      data,
    },
  ]);

  useEffect(() => {}, []);
  const [options] = useState({
    chart: {
      height: 380,
      fontFamily: "Poppins",
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex][dataPointIndex];
        return `
              <div class="chart-tooltip">
                <p>${categories[dataPointIndex]} : ${value}</p>
              </div>
              `;
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      colors: ["#03A6CF"],
      width: 2,
      dashArray: 0,
    },
    markers: {
      size: 3,
      colors: ["#03A6CF"],
      strokeWidth: 0,
      fillOpacity: 1,
      shape: "circle",
      radius: 2,
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
      type: "category",
      categories,
      labels: {
        show: true,
        rotate: lang == "ar" ? 90 : -90,
        rotateAlways: true,
        minHeight: 100,
        maxHeight: 180,
        style: {
          colors: "#4F4F4F",
          fontFamily: "Poppins",
          fontSize: size.width < 480 ? "12px" : "8px",
          fontWeight: "400",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
    // colors: ["#03A6CF"]
  });

  return (
    <div id="chart" className="mt-[62px]">
      <ReactApexChart options={options} series={series} type="line" height={380} />
    </div>
  );
}
