import { useState } from "react";
import { getCookie } from "cookies-next";
import { ArrowLeft, ArrowRight } from "iconsax-react";
// COMPONENT
import Requests from "./Requests";
import Projects from "./Projects";
import SearchInput from "@components/kit/Input/SearchInput";
import CustomButton from "@components/kit/button/CustomButton";

export default function Favorites({ t, isUser }) {
  const lang = getCookie("NEXT_LOCALE");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("project");

  return (
    <>
      <section className="w-full pb-[130px] h-auto pt-5 2xl:w-[1320px] 2xl:m-auto">
        <header className="w-full fixed top-0 pt-5 lg:sticky bg-white z-10 pb-[15px] px-4">
          <div className="mt-[22px] mb-3">
            <SearchInput
              icon={
                lang === "en" ? (
                  <ArrowLeft color="#7B808C" size={16} />
                ) : (
                  <ArrowRight color="#7B808C" size={16} />
                )
              }
              buttonOnClick={() => history.back()}
              value={search}
              setValue={setSearch}
              isIconLeft={true}
            />
          </div>
          <div className="chipsFilter flex w-full z-[1001] mt-4">
            <div className="mx-1">
              <CustomButton
                title={t("projects")}
                siza={"XS"}
                styleType={tab === "project" ? "Primary" : "Secondary"}
                bgColor={tab === "project" ? "bg-[#03A6CF]" : "bg-white"}
                textColor={tab === "project" ? "text-white" : "text-gray4"}
                borderColor={tab === "project" ? "border-main2" : "border-gray4"}
                paddingX={"px-[14px]"}
                onClick={() => setTab("project")}
              />
            </div>
            <div className="mx-1">
              <CustomButton
                title={t("requests")}
                siza={"XS"}
                styleType={tab === "request" ? "Primary" : "Secondary"}
                bgColor={tab === "request" ? "bg-[#03A6CF]" : "bg-white"}
                textColor={tab === "request" ? "text-white" : "text-gray4"}
                borderColor={tab === "request" ? "border-main2" : "border-gray4"}
                paddingX={"px-[14px]"}
                onClick={() => setTab("request")}
              />
            </div>
          </div>
        </header>

        <div className="px-[18px] pt-[130px] lg:pt-0">
          {tab === "project" ? <Projects t={t} search={search} /> : null}

          {tab === "request" ? <Requests t={t} search={search} /> : null}
        </div>
      </section>
    </>
  );
}
