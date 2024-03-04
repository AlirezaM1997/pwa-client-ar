import React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getPercentage } from "@functions/getPercentage";

export default function RadialBarChart({ data, label }) {
  const [series, setSeries] = useState([]);
  const [total, setTotal] = useState(null);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setSeries([]);
    setTotal(data?.total);
    setOptions({
      chart: {
        height: 300,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 5,
            size: "40%",
          },
          dataLabels: {
            name: {
              fontSize: "8px",
              fontFamily: "Poppins",
              offsetY: 20,
              color: "#2E2E2E",
              formatter: function () {
                return label;
              },
            },
            value: {
              color: "#2E2E2E",
              fontFamily: "Dana",
              offsetY: -30,
              fontSize: "24px",
              fontWeight: 600,
              formatter: function () {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return total ? total : 0;
              },
            },
            total: {
              show: true,
              fontWeight: 500,
              label: "Total",
              fontFamily: "Dana",
              formatter: function () {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return total ? total : 0;
              },
            },
          },
        },
      },
      stroke: {
        lineCap: "round",
      },
      colors: ["#7F3DFF", "#E92828", "#E5C413", "#03A6CF", "#D307A6", "#0EB26E"],
    });
    setSeries([
      getPercentage(data?.financial, data?.total),
      getPercentage(data?.moral, data?.total),
      getPercentage(data?.ideas, data?.total),
      getPercentage(data?.capacity, data?.total),
      getPercentage(data?.presence, data?.total),
      getPercentage(data?.skill, data?.total),
    ]);
  }, [data, total, label]);

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        key={Math.random()}
        series={series}
        type="radialBar"
        height={300}
      />
    </div>
  );
}
