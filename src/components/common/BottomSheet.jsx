import Sheet from "react-modal-sheet";
import { getCookie } from "cookies-next";

export default function BottomSheet({
  open,
  setOpen,
  onCloseEnd = () => null,
  children,
  disableDrag,
  backgroundColor = "rgba(0, 0, 0, 0.2)",
}) {
  const lang = getCookie("NEXT_LOCALE");
  return (
    <>
      <Sheet
        isOpen={open}
        disableDrag={disableDrag}
        onClose={() => setOpen(false)}
        onCloseEnd={onCloseEnd}
      >
        <Sheet.Container>
          <Sheet.Header />
          <div
            dir={lang == "ar" ? "rtl" : "ltr"}
            className={`${lang == "ar" ? "font-Dana" : "font-Poppins"} overflow-y-auto`}
          >
            <Sheet.Content>{children}</Sheet.Content>
          </div>
        </Sheet.Container>
        <Sheet.Backdrop
          style={{ background: backgroundColor }}
          onTap={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}
