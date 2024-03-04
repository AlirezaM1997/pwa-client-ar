import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function DonutChart({ label, data, total }) {
  const [series, setSeries] = useState([44, 55, 13, 33]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setSeries(data?.map((i) => i.count / total));
    setOptions({
      chart: {
        width: 200,
        type: "donut",
      },
      plotOptions: {
        pie: {
          customScale: 1,
          donut: {
            size: "88%",
            labels: {
              show: true,
              name: {
                fontSize: "8px",
                fontFamily: "Dana",
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
                  return total ? total : 0;
                },
              },
              total: {
                show: true,
                fontWeight: 500,
                fontFamily: "Dana",
                formatter: function () {
                  return total;
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false,
              showForSingleSeries: true,
            },
          },
        },
      ],
      legend: {
        show: false,
        position: "center",
        offsetY: 0,
        height: 200,
      },
      colors: [
        "#FE774E",
        "#03A6CF",
        "#7F3DFF",
        "#E5C413",
        "#E92828",
        "#D307A6",
        "#0EB26E",
        "#FE774E",
        "#95B3FF",
        "#2984FF",
      ],
    });
  }, [data, total, label]);

  return (
    <div className="flex justify-center">
      <div className="chart-wrap">
        <div id="chart">
          <ReactApexChart
            options={options}
            key={Math.random()}
            series={series}
            type="donut"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
