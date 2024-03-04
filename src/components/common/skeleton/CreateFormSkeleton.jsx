import { useWindowSize } from "@uidotdev/usehooks";
// COMPONENT
import HeaderSkeleton from "./HeaderSkeleton";
import Skeleton from "@components/kit/skeleton/Main";

function CreateFormSkeleton() {
  const size = useWindowSize();
  const isMobile = size.width < 960;
  return (
    <section className="createP relative 2xl:w-[1320px] 2xl: m-auto">
      <HeaderSkeleton width={isMobile ? "25%" : ""} hasBackButton={isMobile} />
      <>
        <header className="px-4 lg:px-[30px] lg:pt-[4px] mb-[32px] lg:mb-[56px]">
          <div>
            <Skeleton height={44} className="mb-1" />
            <Skeleton height={40} />
          </div>
        </header>
        <main className="px-4 lg:px-[30px] scrollbar-hide pb-[76px]">
          <div className="mb-[25px] lg:mb-[41px]">
            <Skeleton width={150} height={20} className="my-1" />
            <Skeleton height={52} />
          </div>
          <div className={isMobile ? "" : "grid grid-cols-2 gap-[41px] mb-[50px]"}>
            <div className="flex flex-col gap-[2px] min-h-[317px]">
              <Skeleton height={22} className="mb-[10px]" width="50%" />
              <Skeleton height={258} />
            </div>
            <div className="flex flex-col gap-[2px] min-h-[317px]">
              <Skeleton height={20} width="50%" className="mb-[10px]" />
              <Skeleton height={258} />
            </div>
          </div>
          <div
            className="mt-[30px] lg:mt-[56px]"
            style={{
              position: "sticky",
              bottom: "0px",
              paddingBottom: "18px",
              width: "100%",
            }}
          >
            <Skeleton height={40} borderRadius={4} />
          </div>
        </main>
      </>
    </section>
  );
}

export default CreateFormSkeleton;
