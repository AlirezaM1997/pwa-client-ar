import React from "react";
import PropTypes from "prop-types";

const Skeleton = ({
  animation,
  circle,
  height,
  width,
  borderRadius,
  style,
  className,
  children,
}) => {
  const skeletonClass = `bg-gradient-to-r from-gray-300 via-gray-300 to-gray-300 animate ${animation} ${
    circle ? "rounded-full" : ""
  } ${className || ""}`;
  return (
    <div
      className={skeletonClass}
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : borderRadius,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

Skeleton.propTypes = {
  animation: PropTypes.string,
  circle: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
};

Skeleton.defaultProps = {
  animation: "animate-pulse",
  circle: false,
  height: "100px",
  width: "100%",
  borderRadius: "4px",
  className: "",
  style: {},
};

export default Skeleton;
