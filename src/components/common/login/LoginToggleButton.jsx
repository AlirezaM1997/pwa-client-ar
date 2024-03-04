import { useTranslation } from "next-i18next";

export default function LoginToggleButton(props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full rounded-lg bg-gray6 flex mt-[30px] px-[6px] py-1">
        {props.user ? (
          <>
            <button
              className={`w-full bg-white text-[14px] leading-[22px] font-bold py-[9px] flex justify-center items-center rounded-[8px] text-gray1`}
              onClick={() => {
                props.setUser(true);
                props.setAssociation(false);
              }}
            >
              {t("user")}
            </button>
            <button
              className={`w-full bg-gray6 text-[14px] leading-[22px] font-bold py-[9px] flex justify-center items-center rounded-[8px] text-gray1`}
              onClick={() => {
                props.setUser(false);
                props.setAssociation(true);
              }}
            >
              {t("association")}
            </button>
          </>
        ) : null}
        {props.association ? (
          <>
            <button
              className={`w-full bg-gray6 text-[14px] leading-[22px] font-bold py-[9px] flex justify-center items-center rounded-[8px] text-gray1`}
              onClick={() => {
                props.setUser(true);
                props.setAssociation(false);
              }}
            >
              {t("user")}
            </button>
            <button
              className={`w-full bg-white text-[14px] leading-[22px] font-bold py-[9px] flex justify-center items-center rounded-[8px] text-gray1`}
              onClick={() => {
                props.setUser(false);
                props.setAssociation(true);
              }}
            >
              {t("association")}
            </button>
          </>
        ) : null}
      </div>
    </>
  );
}
