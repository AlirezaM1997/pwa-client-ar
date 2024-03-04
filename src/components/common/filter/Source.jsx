import { useRouter } from "next/router";
import { useEffect, useState } from "react";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function Source({ t, setOpen, search }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(router.query.source);
  }, [router.query]);

  const confirm = () => {
    setOpen(false);
    router.push(
      {
        pathname: "/search",
        query: {
          source: selected,
          sort: selected === "project" || selected === "request" ? "LATEST" : "HIGHEST_SCORE",
          search,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="flex flex-col px-4 pb-3 lg:p-[25px]">
      <p className="text-[16px] font-bold">{t("grouping")}</p>
      <p className="mt-3 text-black leading-[20px] text-[14px] font-normal ">{t("sortDec")}</p>
      <div className={`flex flex-col mt-3 mb-4`}>
        <div className={`flex py-[8px] inputTypeRadio`}>
          <input
            type="radio"
            name="project-itemType"
            value="project"
            id="radio"
            checked={selected === "project"}
            onChange={(e) => setSelected(e.target.value)}
            className="w-5 h-5 mt-1"
          />
          <p className="px-2 text-[16px] font-normal  text-gray1">{t("projects")}</p>
        </div>
        {!router.query?.fromMap && (
          <div className={`flex py-[8px] inputTypeRadio`}>
            <input
              type="radio"
              name="request-itemType"
              value="request"
              id="radio"
              checked={selected === "request"}
              onChange={(e) => setSelected(e.target.value)}
              className="w-5 h-5 mt-1"
            />
            <p className="px-2 text-[16px] font-normal  text-gray1">{t("requests")}</p>
          </div>
        )}
        {!router.query?.fromMap && (
          <div className={`flex  py-[8px] inputTypeRadio`}>
            <input
              type="radio"
              name="collections-itemType"
              value="collections"
              id="collections"
              checked={selected === "collections"}
              onChange={(e) => setSelected(e.target.value)}
              className="w-5 h-5 mt-1"
            />
            <p className="px-2 text-[16px] font-normal  text-gray1">{t("associations")}</p>
          </div>
        )}
      </div>
      <CustomButton
        title={t("showResult")}
        styleType="Primary"
        size={"S"}
        textColor={"text-white"}
        onClick={() => confirm()}
        isFullWidth={true}
      />
    </div>
  );
}
