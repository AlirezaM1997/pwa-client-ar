import Image from "next/legacy/image";
import { useTranslation } from "react-i18next";

export default function NoResult({ showInPage = false, classNames = "mt-[120px]" }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={`flex items-center justify-center flex-col text-center px-4 ${classNames}`}>
        <div
          className={`relative w-[131px] h-[136px] ${
            showInPage ? "lg:h-[205px] lg:w-[198px]" : ""
          }`}
        >
          <Image src={"/assets/svg/notResult.svg"} layout="fill" alt="not-result" />
        </div>
        <h1 className={`heading pt-6 pb-1 text-black ${showInPage ? "lg:pt-[32px] lg:pb-0 " : ""}`}>
          {t("notResultTitle")}
        </h1>
      </div>
    </>
  );
}
