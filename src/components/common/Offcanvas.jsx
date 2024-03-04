export default function Offcanvas(props) {
  return (
    <>
      <div
        id="menu"
        className={`${props.width} absolute top-0 z-[10000] ${
          props.isOpen ? "ml-0" : props.margin
        }  h-full bg-white duration-700`}
      >
        {props.children}
      </div>
    </>
  );
}
