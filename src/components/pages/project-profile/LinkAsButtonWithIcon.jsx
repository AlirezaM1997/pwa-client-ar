import cx from "classnames";
import Link from "next/link";

const LinkAsButtonWithIcon = ({
  href = "#",
  text,
  icon,
  classNames,
  disabled = false,
  ...restProps
}) => {
  return (
    <Link
      href={href}
      className={`block w-max h-max ${disabled ? "pointer-events-none" : ""}`}
      prefetch={false}
    >
      <div
        className={cx(
          `flex flex-row justify-center items-center rounded-lg h-max w-max cursor-pointer ${classNames}`,
          { "!text-gray4 cursor-default": disabled }
        )}
        {...restProps}
      >
        <span>{text}</span>
        {icon}
      </div>
    </Link>
  );
};
export default LinkAsButtonWithIcon;
