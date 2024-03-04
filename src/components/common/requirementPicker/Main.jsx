import { Plus } from "@lib/svg";
import Select from "react-select";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import cloneDeep from "@functions/cloneDeep";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
//COMPONENT
import Header from "@components/common/Header";
import CustomButton from "@components/kit/button/CustomButton";
//COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const RequirementCard = dynamic(() => import("./RequirementCard"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const Moral = dynamic(() => import("@components/common/requirementPicker/Moral"), { ssr: false });
const Ideas = dynamic(() => import("@components/common/requirementPicker/Ideas"), { ssr: false });
const Skill = dynamic(() => import("@components/common/requirementPicker/Skill"), { ssr: false });
const Capacity = dynamic(() => import("@components/common/requirementPicker/Capacity"), {
  ssr: false,
});
const Financial = dynamic(() => import("@components/common/requirementPicker/Financial"), {
  ssr: false,
});
const Pressence = dynamic(() => import("@components/common/requirementPicker/Pressence"), {
  ssr: false,
});

export default function RequirementPicker({
  open,
  setOpen,
  requirements,
  setRequirements,
  editMode,
  setDeletedRequirements,
  deletedRequirements,
}) {
  //VARIABLE
  const { t } = useTranslation();
  const rootCategory = [
    {
      value: "FINANCIAL",
      label: t("requirements.financial"),
    },
    {
      value: "MORAL",
      label: t("requirements.moral"),
    },
    {
      value: "IDEAS",
      label: t("requirements.ideas"),
    },
    {
      value: "PRESSENCE",
      label: t("requirements.pressence"),
    },
    {
      value: "CAPACITY",
      label: t("requirements.capacity"),
    },
    {
      value: "SKILL",
      label: t("requirements.skill"),
    },
  ];
  const size = useWindowSize();
  const isMobile = size.width < 960;
  const [temporaryRequirements, setTemporaryRequirements] = useState([]);
  const [temporaryDeletedRequirements, setTemporaryDeletedRequirements] = useState([]);
  const [openAddRequirement, setOpenAddRequirement] = useState(false);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [openFinancial, setOpenFinancial] = useState(false);
  const [openMoral, setOpenMoral] = useState(false);
  const [openIdeas, setOpenIdeas] = useState(false);
  const [openPressence, setOpenPressence] = useState(false);
  const [openCapacity, setOpenCapacity] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [financial, setFinancial] = useState(
    requirements
      .filter((i) => i.type === "FINANCIAL")
      .map((i) => ({
        amount: i.amount,
      }))
  );
  const [moral, setMoral] = useState(
    requirements
      .filter((i) => i.type === "MORAL")
      .map((i) => ({
        description: i.description,
      }))
  );
  const [ideas, setIdeas] = useState(
    requirements
      .filter((i) => i.type === "IDEAS")
      .map((i) => ({
        description: i.description,
      }))
  );
  const [pressence, setPressence] = useState(
    requirements.filter((i) => i.type === "PRESSENCE").map((i) => ({}))
  );
  const [capacity, setCapacity] = useState(
    requirements
      .filter((i) => i.type === "CAPACITY")
      .map((i) => ({
        description: i.description,
      }))
  );
  const [skill, setSkill] = useState(
    requirements
      .filter((i) => i.type === "CAPACITY")
      .map((i) => ({
        description: i.description,
      }))
  );

  //FUNCTION
  const showRequirementItems = (e) => {
    setOpenAddRequirement(false);
    if (e === "FINANCIAL") {
      if (
        temporaryRequirements.filter((i) => i.type === "FINANCIAL" && i.flag !== "DELETE")
          .length === 0
      ) {
        setOpenFinancial(true);
      } else {
        toast.custom(() => <Toast text={t("errorFinancialRequirement")} status="ERROR" />);
      }
    } else {
      setOpenFinancial(false);
    }
    if (e === "MORAL") {
      setOpenMoral(true);
    } else {
      setOpenMoral(false);
    }
    if (e === "IDEAS") {
      setOpenIdeas(true);
    } else {
      setOpenIdeas(false);
    }
    if (e === "PRESSENCE") {
      if (
        temporaryRequirements.filter((i) => i.type === "PRESSENCE" && i.flag !== "DELETE")
          .length === 0
      ) {
        setOpenPressence(true);
      } else {
        toast.custom(() => <Toast text={t("errorInPersonRequirement")} status="ERROR" />);
      }
    } else {
      setOpenPressence(false);
    }
    if (e === "CAPACITY") {
      setOpenCapacity(true);
    } else {
      setOpenCapacity(false);
    }
    if (e === "SKILL") {
      setOpenSkill(true);
    } else {
      setOpenSkill(false);
    }
  };

  const confirmRequirements = () => {
    setRequirements(temporaryRequirements);
    setDeletedRequirements(temporaryDeletedRequirements);
    setOpen(false);
    document.body.style.overflow = "unset";
  };
  const submitFinancial = () => {
    setOpenFinancial(false);
    if (editModeIndex != null) {
      const _requirements = cloneDeep(temporaryRequirements);
      if (temporaryRequirements[editModeIndex]._id) {
        setTemporaryDeletedRequirements((prev) => [...prev, temporaryRequirements[editModeIndex]]);
      }
      _requirements[editModeIndex].amount = financial.amount;
      _requirements[editModeIndex].flag = "NEW";
      setTemporaryRequirements(_requirements);
      setEditModeIndex(null);
    } else {
      setTemporaryRequirements((prev) => [
        ...prev,
        {
          type: "FINANCIAL",
          amount: financial.amount,
          flag: "NEW",
        },
      ]);
    }
    setFinancial({ amount: "" });
  };

  const submitMoral = () => {
    if (moral.description) {
      setOpenMoral(false);
      if (editModeIndex != null) {
        const _requirements = cloneDeep(temporaryRequirements);
        if (temporaryRequirements[editModeIndex]._id) {
          setTemporaryDeletedRequirements((prev) => [
            ...prev,
            temporaryRequirements[editModeIndex],
          ]);
        }
        _requirements[editModeIndex].description = moral.description;
        _requirements[editModeIndex].flag = "NEW";
        setTemporaryRequirements(_requirements);
        setEditModeIndex(null);
      } else {
        setTemporaryRequirements((prev) => [
          ...prev,
          {
            type: "MORAL",
            description: moral?.description,
            flag: "NEW",
          },
        ]);
      }
      setMoral({ description: "" });
    }
  };

  const submitIdeas = () => {
    if (ideas.description) {
      setOpenIdeas(false);
      if (editModeIndex != null) {
        const _requirements = cloneDeep(temporaryRequirements);
        if (temporaryRequirements[editModeIndex]._id) {
          setTemporaryDeletedRequirements((prev) => [
            ...prev,
            temporaryRequirements[editModeIndex],
          ]);
        }
        _requirements[editModeIndex].description = ideas.description;
        _requirements[editModeIndex].flag = "NEW";
        setTemporaryRequirements(_requirements);
        setEditModeIndex(null);
      } else {
        setTemporaryRequirements((prev) => [
          ...prev,
          {
            type: "IDEAS",
            description: ideas?.description,
            flag: "NEW",
          },
        ]);
      }
      setIdeas({ description: "" });
    }
  };

  const submitCapacity = () => {
    if (capacity.description) {
      setOpenCapacity(false);
      if (editModeIndex != null) {
        const _requirements = cloneDeep(temporaryRequirements);
        if (temporaryRequirements[editModeIndex]._id) {
          setTemporaryDeletedRequirements((prev) => [
            ...prev,
            temporaryRequirements[editModeIndex],
          ]);
        }
        _requirements[editModeIndex].description = capacity.description;
        _requirements[editModeIndex].flag = "NEW";
        setTemporaryRequirements(_requirements);
        setEditModeIndex(null);
      } else {
        setTemporaryRequirements((prev) => [
          ...prev,
          {
            type: "CAPACITY",
            description: capacity?.description,
            flag: "NEW",
          },
        ]);
      }
      setCapacity({ description: "" });
    }
  };

  const submitPressence = () => {
    if (pressence.description) {
      setOpenPressence(false);
      if (editModeIndex != null) {
        const _requirements = cloneDeep(temporaryRequirements);
        if (temporaryRequirements[editModeIndex]._id) {
          setTemporaryDeletedRequirements((prev) => [
            ...prev,
            temporaryRequirements[editModeIndex],
          ]);
        }
        _requirements[editModeIndex].description = pressence.description;
        _requirements[editModeIndex].flag = "NEW";
        setTemporaryRequirements(_requirements);
        setEditModeIndex(null);
      } else {
        setTemporaryRequirements((prev) => [
          ...prev,
          {
            type: "PRESSENCE",
            description: pressence.description,
            flag: "NEW",
          },
        ]);
      }
      setPressence({ description: "" });
    }
  };

  const submitSkill = () => {
    if (skill.description) {
      setOpenSkill(false);
      if (editModeIndex != null) {
        const _requirements = cloneDeep(temporaryRequirements);
        if (temporaryRequirements[editModeIndex]._id) {
          setTemporaryDeletedRequirements((prev) => [
            ...prev,
            temporaryRequirements[editModeIndex],
          ]);
        }
        _requirements[editModeIndex].description = skill.description;
        _requirements[editModeIndex].flag = "NEW";
        setTemporaryRequirements(_requirements);
        setEditModeIndex(null);
      } else {
        setTemporaryRequirements((prev) => [
          ...prev,
          {
            type: "SKILL",
            description: skill?.description,
            flag: "NEW",
          },
        ]);
      }
      setSkill({ description: "" });
    }
  };

  useEffect(() => {
    setTemporaryRequirements(requirements);
    setTemporaryDeletedRequirements(deletedRequirements);
  }, [open]);

  useEffect(() => {
    if (!openFinancial) {
      setFinancial({ amount: "" });
    }
    if (!openCapacity) {
      setCapacity({ description: "" });
    }
    if (!openIdeas) {
      setIdeas({ description: "" });
    }
    if (!openMoral) {
      setMoral({ description: "" });
    }
    if (!openPressence) {
      setPressence({ description: "" });
    }
    if (!openSkill) {
      setSkill({ description: "" });
    }
    if (
      !openFinancial &&
      !openCapacity &&
      !openIdeas &&
      !openMoral &&
      !openPressence &&
      !openSkill
    ) {
      setEditModeIndex(null);
    }
  }, [openFinancial, openCapacity, openIdeas, openMoral, openPressence, openSkill]);

  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed w-full 2xl:w-[1320px] 2xl:m-auto h-screen z-[99999] top-0 right-0 left-0 overflow-y-auto overflow-x-clip bg-white `}
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white w-full max-h-max min-h-full overflow-y-auto relative 2xl:w-[1320px] 2xl:m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="w-full h-full">
          <Header
            onClick={() => {
              toast.remove();
              setOpen(false);
              document.body.style.overflow = "unset";
            }}
            classNames="lg:my-0 lg:py-[43px]"
            title={t("requirementPicker.requirements")}
          />
          <main className="pt-[19px] px-[17px] lg:px-[30px]">
            <h1 className="heading ">{t("requirementPicker.selectRequirements")}</h1>
            <p className="text-[14px] leading-[26px] font-normal mt-[2px] pb-[30px] text-gray4">
              {t("requirementPicker.requirementsList")}
            </p>
            {temporaryRequirements.length > 0 && (
              <div className="mb-[157px] lg:mb-[288px]">
                {temporaryRequirements
                  ?.filter((_i) => _i.flag !== "DELETE")
                  .map((item, j) => (
                    <RequirementCard
                      key={j}
                      item={item}
                      index={j}
                      t={t}
                      temporaryRequirements={temporaryRequirements}
                      setTemporaryRequirements={setTemporaryRequirements}
                      editMode={editMode}
                      setTemporaryDeletedRequirements={setTemporaryDeletedRequirements}
                      setOpenSkill={setOpenSkill}
                      setOpenCapacity={setOpenCapacity}
                      setOpenPressence={setOpenPressence}
                      setOpenIdeas={setOpenIdeas}
                      setOpenMoral={setOpenMoral}
                      setOpenFinancial={setOpenFinancial}
                      setSkill={setSkill}
                      setCapacity={setCapacity}
                      setPressence={setPressence}
                      setIdeas={setIdeas}
                      setMoral={setMoral}
                      setFinancial={setFinancial}
                      setEditModeIndex={setEditModeIndex}
                    />
                  ))}
              </div>
            )}
          </main>
          <div className="w-full fixed bottom-0 px-[17px] lg:px-[30px] 2xl:w-[1320px]">
            <button
              onClick={() => setOpenAddRequirement(true)}
              className="mb-[19px] w-[52px] h-[52px] lg:w-[58px] lg:h-[58px] bg-main2 rounded-full flex justify-center items-center"
            >
              <div className="w-[22px] h-[22px] rounded-full flex justify-center items-center bg-white">
                <Plus w={12.5} h={12.5} color="#03A6CF" />
              </div>
            </button>
            <div className="bg-white p-[18px] shadow-inner border-none">
              <CustomButton
                onClick={confirmRequirements}
                title={t("confirm")}
                isFullWidth={true}
                isDisabled={
                  temporaryRequirements.length === 0 && temporaryDeletedRequirements.length === 0
                }
                isPointerEventsNone={
                  temporaryRequirements.length === 0 && temporaryDeletedRequirements.length === 0
                }
                size={isMobile ? "S" : "M"}
              />
            </div>
          </div>
        </section>
        <BottomSheet
          open={openAddRequirement}
          setOpen={setOpenAddRequirement}
          backgroundColor="transparent"
        >
          <div className="px-[17px] pb-[270px]">
            <h1 className="heading mt-[2px] mb-[30px]">
              {t("requirementPicker.selectRequirements")}
            </h1>
            {/* <p className="text-[14px] leading-[26px] font-normal mt-[2px] mb-[30px] text-gray4">{t("choseSubjects.dHeader")}</p> */}
            <Select
              menuPlacement="bottom"
              id="requirementSelect"
              instanceId="requirementSelect"
              placeholder={t("requirementPicker.selectYourRequirement")}
              options={rootCategory}
              onChange={(e) => showRequirementItems(e.value)}
              isSearchable={false}
            />
          </div>
        </BottomSheet>
        <BottomSheet open={openFinancial} setOpen={setOpenFinancial} backgroundColor="transparent">
          <div className="px-[17px] pb-[48px]">
            <Financial
              t={t}
              setFinancial={setFinancial}
              financial={financial}
              submitFinancial={submitFinancial}
            />
            <div className="mt-[40px]">
              <CustomButton
                onClick={() => submitFinancial()}
                title={t("ok")}
                isFullWidth={true}
                size="S"
                isDisabled={
                  !financial.amount || financial.amount < 10000 || financial.amount > 10000000000
                }
                isPointerEventsNone={
                  !financial.amount || financial.amount < 10000 || financial.amount > 10000000000
                }
              />
            </div>
          </div>
        </BottomSheet>
        <BottomSheet open={openMoral} setOpen={setOpenMoral} backgroundColor="transparent">
          <div className="px-[17px] pb-[48px]">
            <Moral
              t={t}
              setMoral={setMoral}
              moral={moral}
              isParticipation={false}
              submitMoral={submitMoral}
            />
            <div className="mt-[40px]">
              <CustomButton
                onClick={() => submitMoral()}
                title={t("ok")}
                isFullWidth={true}
                size="S"
                isDisabled={moral?.description?.length === 0}
                isPointerEventsNone={moral?.description?.length === 0}
              />
            </div>
          </div>
        </BottomSheet>
        <BottomSheet open={openIdeas} setOpen={setOpenIdeas} backgroundColor="transparent">
          <div className="px-[17px] pb-[48px]">
            <Ideas
              t={t}
              setIdeas={setIdeas}
              ideas={ideas}
              isParticipation={false}
              submitIdeas={submitIdeas}
            />
            <div className="mt-[40px]">
              <CustomButton
                onClick={() => submitIdeas()}
                title={t("ok")}
                isFullWidth={true}
                size="S"
                isDisabled={ideas?.description?.length === 0}
                isPointerEventsNone={ideas?.description?.length === 0}
              />
            </div>
          </div>
        </BottomSheet>
        <BottomSheet open={openCapacity} setOpen={setOpenCapacity} backgroundColor="transparent">
          <div className="px-[17px] pb-[48px]">
            <Capacity
              t={t}
              setCapacity={setCapacity}
              capacity={capacity}
              isParticipation={false}
              submitCapacity={submitCapacity}
            />
            <div className="mt-[40px]">
              <CustomButton
                onClick={() => submitCapacity()}
                title={t("ok")}
                isFullWidth={true}
                size="S"
                isDisabled={capacity?.description?.length === 0}
                isPointerEventsNone={capacity?.description?.length === 0}
              />
            </div>
          </div>
        </BottomSheet>
        <BottomSheet open={openPressence} setOpen={setOpenPressence} backgroundColor="transparent">
          <div className="px-[17px] pb-[48px]">
            <Pressence
              t={t}
              setPressence={setPressence}
              pressence={pressence}
              isParticipation={false}
              submitPressence={submitPressence}
            />
            <div className="mt-[40px]">
              <CustomButton
                onClick={() => submitPressence()}
                title={t("ok")}
                isFullWidth={true}
                size="S"
                isDisabled={pressence?.description?.length === 0}
                isPointerEventsNone={pressence?.description?.length === 0}
              />
            </div>
          </div>
        </BottomSheet>
        <BottomSheet open={openSkill} setOpen={setOpenSkill} backgroundColor="transparent">
          <div className="px-[17px] pb-[48px]">
            <Skill
              t={t}
              setSkill={setSkill}
              skill={skill}
              isParticipation={false}
              submitSkill={submitSkill}
            />
            <div className="mt-[40px]">
              <CustomButton
                onClick={() => submitSkill()}
                title={t("ok")}
                isFullWidth={true}
                size="S"
                isDisabled={skill?.description?.length === 0}
                isPointerEventsNone={skill?.description?.length === 0}
              />
            </div>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
