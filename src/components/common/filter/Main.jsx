import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { ArrowLeft2, ArrowRight2, Trash } from "iconsax-react";
//COMPONENT
import Subject from "./Subject";
import Time from "@components/common/filter/Time";
import Audience from "@components/common/Audience";
import Status from "@components/common/filter/Status";
import BackButton from "@components/common/BackButton";
import ParticipationStatus from "./ParticipationStatus";
import BottomSheet from "@components/common/BottomSheet";
import CustomButton from "@components/kit/button/CustomButton";
import CustomTransitionModal from "@components/kit/modal/CustomTransitionModal";
import Group from "./Group";

const Score = dynamic(() => import("@components/common/filter/Score"), { ssr: false });
const Requirement = dynamic(() => import("@components/common/filter/Requirement"), { ssr: false });

export default function FiltersModal({
  t,
  tHome,
  open,
  setOpen,
  initialParams,
  isInMap = false,
  isInParticipation = false,
  firstUrl = "/search",
  isRequest = false,
}) {
  //VARIABLE
  const router = useRouter();
  const size = useWindowSize();
  const isMobile = size.width < 960;
  const lang = getCookie("NEXT_LOCALE");

  const [openStatus, setOpenStatus] = useState(false);
  const [openScore, setOpenScore] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [openTargetCommunity, setOpenTargetCommunity] = useState(false);
  const [openRequirements, setOpenRequirements] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [openSubjects, setOpenSubjects] = useState(false);

  const innerModalIsopen =
    openStatus || openScore || openTargetCommunity || openRequirements || openTime || openSubjects;

  const [group, setGroup] = useState([]);
  const [status, setStatus] = useState([]);
  const [score, setScore] = useState([]);
  const [audience, setAudience] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [subjects, setSubjects] = useState([]);

  //FUNCTIONS
  useEffect(() => {
    setGroup(router.query?.group ? router.query.group.split(",") : []);
    setStatus(router.query?.status ? router.query.status.split(",") : []);
    setScore(router.query?.score ? router.query.score.split("-") : []);
    setAudience(router.query?.audience ? router.query.audience.split("-") : []);
    setRequirements(router.query?.requirements ? router.query.requirements.split(",") : []);
    setMinDate(router.query?.minDate ? router.query?.minDate : null);
    setMaxDate(router.query?.maxDate ? router.query?.maxDate : null);
    setSubjects(router.query?.subjects ? router.query?.subjects.split(",") : []);
  }, [router.query]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
  }, [open]);

  const confirmFilter = () => {
    if (group.length !== 0) {
      router.query.group = group.reduce((acc, curr) => {
        if (acc === "") acc += curr;
        else acc += "," + curr;
        return acc;
      }, "");
    } else {
      router.query.group = [];
    }
    if (status.length !== 0) {
      router.query.status = status.reduce((acc, curr) => {
        if (acc === "") acc += curr;
        else acc += "," + curr;
        return acc;
      }, "");
    } else {
      router.query.status = [];
    }
    if (score.length !== 0) {
      router.query.score = `${score[0]}-${score[1]}`;
    } else {
      router.query.score = [];
    }
    if (audience.length !== 0) {
      router.query.audience = `${audience[0]}-${audience[1]}-${audience[2]}`;
    } else {
      router.query.audience = [];
    }
    if (requirements.length !== 0) {
      router.query.requirements = requirements.reduce((acc, curr) => {
        if (acc === "") acc += curr;
        else acc += "," + curr;
        return acc;
      }, "");
    } else {
      router.query.requirements = [];
    }
    if (subjects.length !== 0) {
      router.query.subjects = subjects.reduce((acc, curr) => {
        if (acc === "") acc += isInMap ? curr.id : curr;
        else acc += "," + isInMap ? curr.id : curr;
        return acc;
      }, "");
    } else {
      router.query.subjects = [];
    }
    if (minDate) {
      router.query.minDate = minDate;
    } else {
      router.query.minDate = [];
    }
    if (maxDate) {
      router.query.maxDate = maxDate;
    } else {
      router.query.maxDate = [];
    }
    if (isInParticipation) router.pathname = firstUrl;
    router.query.otherFilter = [];
    router.replace(router, undefined, { shallow: true });
    document.body.style.overflow = "unset";
    setOpen(false);
  };

  const deleteFilter = () => {
    setGroup([]);
    setStatus([]);
    setScore([]);
    setAudience([]);
    setRequirements([]);
    setMinDate(null);
    setMaxDate(null);
    if (isInMap) {
      setSubjects([]);
    }
  };

  const handleBackBtn = () => {
    router.query.otherFilter = [];
    // router.replace(
    //   {
    //     pathname: firstUrl,
    //     query: initialParams,
    //   },
    //   undefined,
    //   { shallow: true }
    // );
    router.back();
    document.body.style.overflow = "unset";
    setOpen(false);
  };

  const FilterItem = ({ title, func, isTheLast, isActive }) => {
    return (
      <button
        className={`w-full flex items-center justify-between py-[21px] gap-x-2 ${
          !isTheLast ? "border-b-[1px] border-gray5" : ""
        }`}
        onClick={func}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[13px] leading-[20px] font-medium lg:text-[18px] lg:leading-[26px] lg:font-normal text-gray1">
            {title}
          </span>
          {isActive && <span className=" rounded-full w-2 h-2 bg-main2"></span>}
        </div>
        {["Ar", "ar"].includes(lang) ? <ArrowLeft2 size={16} /> : <ArrowRight2 size={16} />}
      </button>
    );
  };

  const handleCloseModalWithBackButton = () => {
    if (open) {
      document.body.style.overflow = "unset";
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", handleCloseModalWithBackButton);
    return () => window.removeEventListener("popstate", handleCloseModalWithBackButton);
  });

  return (
    <>
      <div
        className={`${
          open ? "block" : "hidden"
        } fixed w-full top-0 lg:top-[123px] bottom-0 right-0 overflow-y-auto overflow-x-hidden ${
          innerModalIsopen ? "z-[99999]" : "z-[10001]"
        } bg-white `}
      >
        <section
          className={`bg-white w-full h-full max-w-[1320px] 2xl:mx-auto flex flex-col justify-between pb-[21px] ${
            isMobile ? "animate-comeFromDown" : ""
          } `}
        >
          <div>
            <header className="w-full flex items-center justify-between py-[20px] bg-white z-10 lg:pt-[59px] lg:pb-[40px]">
              <div className="px-4 lg:px-[30px] z-10 flex items-center justify-between ">
                <BackButton
                  onClick={() => handleBackBtn()}
                  dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
                  width={isMobile ? "w-[32px]" : "w-[36px]"}
                  height={isMobile ? "h-[32px]" : "h-[36px]"}
                />
              </div>
              <p className="text-[15px] font-semibold w-full text-center lg:text-[18px] lg:leading-[20px]">
                {t("filters")}
              </p>
              <div className="px-4 lg:px-[30px]">
                <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px]"></div>
              </div>
            </header>
            <div
              className={`pt-[0px] flex justify-end px-4 lg:px-[30px] ${
                status?.length !== 0 ||
                score?.length !== 0 ||
                audience?.length !== 0 ||
                requirements?.length !== 0 ||
                minDate ||
                maxDate ||
                (isInMap && subjects?.length !== 0)
                  ? "block"
                  : "hidden"
              }`}
            >
              <CustomButton
                title={t("deleteAll")}
                bgColor={"bg-[#FCF1F1]"}
                textColor={"text-danger"}
                size={"XS"}
                paddingX={"px-[10px]"}
                onClick={() => deleteFilter(true)}
                icon={<Trash size={16} />}
                isIconLeftSide={false}
              />
            </div>

            <div className={`px-4 lg:px-[30px] `}>
              {!isRequest && (
                <>
                  {isInMap && (
                    <FilterItem
                      title={t("group")}
                      isTheLast={false}
                      func={() => setOpenGroup(true)}
                      isActive={group?.length !== 0 ? true : false}
                    />
                  )}
                  <FilterItem
                    title={t("statusHeader")}
                    isTheLast={false}
                    func={() => setOpenStatus(true)}
                    isActive={status?.length !== 0 ? true : false}
                  />
                  {!isInParticipation && (
                    <>
                      <FilterItem
                        title={t("score")}
                        isTheLast={false}
                        func={() => setOpenScore(true)}
                        isActive={score?.length !== 0 ? true : false}
                      />
                      <FilterItem
                        title={t("targetCommunity")}
                        isTheLast={false}
                        func={() => setOpenTargetCommunity(true)}
                        isActive={audience?.length !== 0 ? true : false}
                      />
                    </>
                  )}
                </>
              )}
              <FilterItem
                title={!isInParticipation ? t("requiredServices") : t("participationType")}
                isTheLast={false}
                func={() => setOpenRequirements(true)}
                isActive={requirements?.length !== 0 ? true : false}
              />
              <FilterItem
                title={t("period")}
                isTheLast={isInMap ? false : true}
                func={() => setOpenTime(true)}
                isActive={minDate || maxDate ? true : false}
              />
              {isInMap && (
                <FilterItem
                  title={t("subject")}
                  isTheLast={true}
                  func={() => setOpenSubjects(true)}
                  isActive={subjects?.length !== 0 ? true : false}
                />
              )}
            </div>
          </div>
          <div className="px-4 lg:px-[30px]">
            <CustomButton
              title={t("showResult")}
              styleType="Primary"
              size={"S"}
              textColor={"text-white"}
              onClick={() => confirmFilter()}
              isFullWidth={true}
            />
          </div>
        </section>

        {isMobile ? (
          <>
            <BottomSheet open={openStatus} setOpen={setOpenStatus}>
              {isInParticipation ? (
                <ParticipationStatus
                  t={t}
                  tHome={tHome}
                  setOpen={setOpenStatus}
                  status={status}
                  setStatus={setStatus}
                />
              ) : (
                <Status
                  t={t}
                  tHome={tHome}
                  setOpen={setOpenStatus}
                  status={status}
                  setStatus={setStatus}
                />
              )}
            </BottomSheet>

            <BottomSheet open={openGroup} setOpen={setOpenGroup}>
              <Group t={t} tHome={tHome} setOpen={setOpenGroup} group={group} setGroup={setGroup} />
            </BottomSheet>

            <BottomSheet open={openScore} setOpen={setOpenScore}>
              <Score t={t} tHome={tHome} setOpen={setOpenScore} score={score} setScore={setScore} />
            </BottomSheet>

            <BottomSheet open={openTargetCommunity} setOpen={setOpenTargetCommunity}>
              <Audience
                t={t}
                setOpen={setOpenTargetCommunity}
                audience={audience}
                setAudience={setAudience}
              />
            </BottomSheet>

            <BottomSheet open={openRequirements} setOpen={setOpenRequirements}>
              <Requirement
                t={t}
                tHome={tHome}
                setOpen={setOpenRequirements}
                setRequirements={setRequirements}
                requirements={requirements}
                isInParticipation={isInParticipation}
              />
            </BottomSheet>

            <BottomSheet open={openTime} setOpen={setOpenTime}>
              <Time
                t={t}
                tHome={tHome}
                setOpen={setOpenTime}
                setMinDate={setMinDate}
                setMaxDate={setMaxDate}
                maxDate={maxDate}
                minDate={minDate}
              />
            </BottomSheet>

            <BottomSheet open={openSubjects} setOpen={setOpenSubjects}>
              <Subject
                t={t}
                setOpenSubject={setOpenSubjects}
                setSubjects={setSubjects}
                isInModal={isInMap}
              />
            </BottomSheet>
          </>
        ) : (
          <>
            <CustomTransitionModal
              open={openStatus}
              close={() => setOpenStatus(false)}
              width="546px"
            >
              {isInParticipation ? (
                <ParticipationStatus
                  t={t}
                  tHome={tHome}
                  setOpen={setOpenStatus}
                  status={status}
                  setStatus={setStatus}
                />
              ) : (
                <Status
                  t={t}
                  tHome={tHome}
                  setOpen={setOpenStatus}
                  status={status}
                  setStatus={setStatus}
                />
              )}
            </CustomTransitionModal>

            <CustomTransitionModal open={openGroup} close={() => setOpenGroup(false)} width="546px">
              <Group t={t} tHome={tHome} setOpen={setOpenGroup} group={group} setGroup={setGroup} />
            </CustomTransitionModal>

            <CustomTransitionModal open={openScore} close={() => setOpenScore(false)} width="546px">
              <Score t={t} tHome={tHome} setOpen={setOpenScore} score={score} setScore={setScore} />
            </CustomTransitionModal>

            <CustomTransitionModal
              open={openTargetCommunity}
              close={() => setOpenTargetCommunity(false)}
              width="546px"
            >
              <Audience
                t={t}
                setOpen={setOpenTargetCommunity}
                audience={audience}
                setAudience={setAudience}
              />
            </CustomTransitionModal>

            <CustomTransitionModal
              open={openRequirements}
              close={() => setOpenRequirements(false)}
              width="546px"
            >
              <Requirement
                t={t}
                tHome={tHome}
                setOpen={setOpenRequirements}
                setRequirements={setRequirements}
                requirements={requirements}
                isInParticipation={isInParticipation}
              />
            </CustomTransitionModal>

            <CustomTransitionModal open={openTime} close={() => setOpenTime(false)} width="350px">
              <Time
                t={t}
                tHome={tHome}
                setOpen={setOpenTime}
                setMinDate={setMinDate}
                setMaxDate={setMaxDate}
                maxDate={maxDate}
                minDate={minDate}
              />
            </CustomTransitionModal>

            <CustomTransitionModal
              open={openSubjects}
              close={() => setOpenSubjects(false)}
              width="max-content"
            >
              <Subject
                t={t}
                setOpenSubject={setOpenSubjects}
                setSubjects={setSubjects}
                isInModal={isInMap}
              />
            </CustomTransitionModal>
          </>
        )}
      </div>
    </>
  );
}
