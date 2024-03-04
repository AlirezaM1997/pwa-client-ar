import { useEffect } from "react";

function ProgressBar({ value, styles }) {
  useEffect(() => {
    for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
      e.style.setProperty("--value", e.value);
      e.style.setProperty("--min", e.min == "" ? "0" : e.min);
      e.style.setProperty("--max", e.max == "" ? "100" : e.max);
      e.addEventListener("input", () => e.style.setProperty("--value", e.value));
    }
  }, []);
  return (
    <input
      type="range"
      readOnly
      disabled
      value={value}
      style={{ direction: "ltr" }}
      className={`${styles ? styles : ""} styled-slider slider-progress mt-2`}
    />
  );
}

export default ProgressBar;
