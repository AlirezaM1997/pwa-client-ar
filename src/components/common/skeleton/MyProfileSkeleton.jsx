//COMPONENT
import Skeleton from "@components/kit/skeleton/Main";
export default function MyProfileSkeleton() {
  return (
    <>
      <header className="max-w-[1320px] 2xl:mx-auto">
        <Skeleton className="pt-[18px] px-4 bg-default w-full h-[115px] relative flex justify-between ">
          <Skeleton circle width={95} height={95} className="absolute top-[62px]" />
        </Skeleton>
        <div className="flex flex-col px-4">
          <div className="flex justify-end pt-3 ">
            <Skeleton height={37} width={148} />
          </div>
          <div className="py-[14px] flex flex-row items-center gap-2">
            <Skeleton height={15} width="25%" />
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center mx-[2px]">
                <Skeleton height={16} width={16} circle />
              </div>
            ))}
          </div>

          <Skeleton width="25%" height={10} className="my-[2px]" />

          <div className="flex items-center mt-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} width={100} height={15} className="mx-[2px]" />
            ))}
          </div>
        </div>
      </header>
      <main className="flex flex-col mt-[38px] px-4 pb-[100px] max-w-[1320px] 2xl:mx-auto">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="flex items-center mb-[35px] cursor-pointer">
            <Skeleton
              width={38}
              height={38}
              className="flex items-center justify-center ltr:mr-[10px] rtl:ml-[10px]"
            />
            <div className="flex flex-col w-full ">
              <Skeleton height={10} width="22%" className="mb-[5px]" />
              <Skeleton height={14} width="35%" />
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
