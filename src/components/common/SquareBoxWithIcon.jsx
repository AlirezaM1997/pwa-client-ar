export default function SquareBoxWithIcon({ icon, size, classNames, ...restProps }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex justify-center items-center ${classNames}`}
      {...restProps}
    >
      {icon}
    </div>
  );
}
