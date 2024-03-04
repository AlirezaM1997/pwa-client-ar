import { Fragment, useRef } from "react";
import { getCookie } from "cookies-next";
import { CloseCircle } from "iconsax-react";
import { Dialog, Transition } from "@headlessui/react";

export default function CustomTransitionModal({
  open,
  close,
  width = "450px",
  children,
  hasCloseBtn = true,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const elementRef = useRef();
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className="relative z-[99999998]" onClose={close} initialFocus={elementRef}>
          <div
            className="fixed h-screen z-[99999998] inset-0 backdrop-blur-[2px] bg-[#31313133]"
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 overflow-y-auto z-[99999999]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex min-h-full items-center justify-center p-4 ${
                lang == "ar" ? "font-Dana" : "font-Poppins"
              }`}
              dir={lang == "ar" ? "rtl" : "ltr"}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  style={{ width }}
                  className="transform rounded-[20px] bg-white transition-all"
                >
                  {hasCloseBtn && (
                    <span
                      onClick={close}
                      ref={elementRef}
                      className={` absolute cursor-pointer ${
                        lang == "ar" ? "left-4" : "right-4"
                      } top-4`}
                    >
                      <CloseCircle color="#2E2E2E" size={22} />
                    </span>
                  )}
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
