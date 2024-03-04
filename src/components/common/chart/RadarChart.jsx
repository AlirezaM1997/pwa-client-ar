import React from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function RadarChart() {
  const [series] = useState([
    {
      name: "Series 1",
      data: [80, 50, 30, 40, 100, 20, 10, 10, 60],
    },
  ]);
  const [options] = useState({
    chart: {
      height: 350,
      type: "radar",
    },
    xaxis: {
      categories: [
        "عملکرد",
        "عملکرد",
        "عملکرد",
        "عملکرد",
        "عملکرد",
        "عملکرد",
        "عملکرد",
        "عملکرد",
        "عملکرد",
      ],
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      fillOpacity: 0,
      strokeOpacity: 0,
    },
    colors: ["#03A6CF", "#03A6CF", "#c9b9eb66"],
  });

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="radar" height={350} />
    </div>
  );
}
