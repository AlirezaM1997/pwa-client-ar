import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
//HOOK
import { useGetRootSubjects } from "@hooks/useGetRootSubjects";
//COMPONENT
import Loading from "@components/kit/loading/Loading";
import CustomButton from "@components/kit/button/CustomButton";

export default function Subject({ setOpenSubject, t, setSubjects, isInModal = false }) {
  //VARIABLE
  const size = useWindowSize();
  const router = useRouter();
  const [selectedItemsID, setSelectedItemsID] = useState(null);
  const { loading, data } = useGetRootSubjects();

  //FUNCTION
  useEffect(() => {
    if (router.query?.subjects) {
      const res = router.query?.subjects.split(",").map((data) => {
        return { id: data };
      });
      setSelectedItemsID(res);
    } else {
      setSelectedItemsID([]);
    }
  }, [router.query]);

  const confirm = () => {
    if (isInModal) {
      setSubjects(selectedItemsID);
    } else {
      if (selectedItemsID?.length > 0) {
        router.query.subjects = selectedItemsID.reduce((acc, curr) => {
          if (acc === "") acc += curr.id;
          else acc += "," + curr.id;
          return acc;
        }, "");
      } else {
        router.query.subjects = [];
      }
      router.push(router, undefined, { shallow: true });
    }
  };

  const handleCheckBox = (e, item) => {
    if (e.target.checked) {
      setSelectedItemsID([...selectedItemsID, { id: item._id, name: item.name }]);
    } else {
      setSelectedItemsID(selectedItemsID.filter((i) => i.id !== item._id));
    }
  };

  if (loading || !selectedItemsID)
    return (
      <Loading loadingHeight="350px" loadingWidth={size.width < 960 ? "w-full" : "w-[617px]"} />
    );

  return (
    <div id="subjectFilterBottomSheet">
      <div className="px-4 lg:p-[25px]">
        <p className="titleInput mb-6 lg:mb-[23px] lg:pb-[28px] lg:text-[18px] lg:leading-[20px] lg:border-b lg:border-gray5">
          {t("selectSubject")}
        </p>
        <div className="flex flex-col px-4 h-[500px] overflow-y-auto lg:h-[384px] lg:px-0 lg:grid lg:grid-cols-2 lg:gap-x-[100px]">
          {data?.get_root_subjects.map((item, index) => (
            <div
              className="flex items-center py-[12px] gap-x-[10px] lg:pt-0 lg:pb-[18px]"
              key={index + "subjects"}
            >
              <input
                id={index * 3 + "subjects"}
                type="checkbox"
                onChange={(e) => handleCheckBox(e, item)}
                checked={selectedItemsID?.filter((i) => i.id == item._id).length !== 0}
                className="lg:!w-[22px] lg:!h-[22px]"
              />
              <label htmlFor={index * 3 + "subjects"} className="text-gray1 lg:text-[16px] ">
                {item.name}
              </label>
            </div>
          ))}
        </div>
        <div className="pb-[18px] pt-5 lg:pt-3 lg:pb-0">
          <CustomButton
            title={t("confirm")}
            styleType="Primary"
            size="S"
            textColor={"text-white"}
            onClick={() => {
              confirm();
              setOpenSubject(false);
            }}
            isFullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
