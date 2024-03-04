/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "blue-500": "#03A6CF", //override blue-500 in progressbar in @material-tailwind/react
      black: "#2E2E2E",
      gray1: "#484848",
      gray2: "#7B808C",
      gray3: "#727272",
      gray4: "#ACACAF",
      gray5: "#E8E8E8",
      gray6: "#F0F0F0",
      gray7: "#DEDEDE",
      gray8: "#F3F3F3",
      main1: "#00839E",
      main2: "#03A6CF",
      main3: "#56C3E0",
      main4: "#70E6FF",
      main5: "#03A6CF80",
      main6: "#56C3E066",
      main7: "#56C3E033",
      main8: "#DDF3F9",
      main9: "#F2FAFF",
      default: "#03A6CF",
      danger: "#CB3A31",
      warning: "#FF8800",
      success: "#43936C",
      info: "#3267E3",
      map: "#CD2863",
    },
    extend: {
      fontFamily: {
        Dana: ["Dana"],
        Poppins: ["Poppins"],
      },
      transitionProperty: {
        height: "height",
        bottom: "bottom",
      },
      keyframes: {
        goUp: {
          "0%": { bottom: "-100%" },
          "100%": { bottom: "0%" },
        },
        upToDown: {
          "0%": { bottom: "100%", right: "50%" },
          "100%": { bottom: "50%", right: "50%" },
        },
        loadingKeyFrame: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        comeFromDown: "goUp 0.5s ease-in-out",
        comeFromUp: "upToDown 0.5s ease-in-out",
        loading: "loadingKeyFrame 1.5s linear infinite",
      },
      backgroundImage: {
        spottedPattern: "radial-gradient(#444cf7 0.65px, #e5e5f7 0.65px)",
      },
    },
    screens: {
      320: "320px",
      360: "360px",
      400: "400px",
      480: "480px",
      1440: "1440px",
      1800: "1800px",
    },
  },
  plugins: [require("@tailwindcss/forms")],
});
