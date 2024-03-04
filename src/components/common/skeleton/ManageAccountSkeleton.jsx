import Skeleton from "@components/kit/skeleton/Main";
import { useWindowSize } from "@uidotdev/usehooks";

function ManageAccountSkeleton() {
  const size = useWindowSize();
  return (
    <div className={`p-4 lg:p-[25px]`}>
      <ul className="w-full max-h-[500px] overflow-y-auto mb-5">
        {[1, 2].map((item) => (
          <li
            key={item}
            className="flex items-center justify-between mb-2 p-2 rounded-lg min-h-[84px]"
          >
            <div className={`flex items-center`}>
              <Skeleton circle height={25} width={25} />
              <label className="flex items-center ltr:pl-[18px] rtl:pr-[18px]">
                <Skeleton circle height={40} width={40} />
                <div className="mr-[9px] ltr:ml-[9px]">
                  <div className={`flex items-center lg:gap-x-6 ${size.width < 960 && "my-1"}`}>
                    <Skeleton height={20} width={80} />
                    <Skeleton
                      height={26}
                      width={55}
                      className="py-[2px] px-2 w-fit rounded-lg hidden lg:block"
                    ></Skeleton>
                  </div>
                  <Skeleton height={15} width={80} dir="ltr" />
                </div>
              </label>
            </div>
          </li>
        ))}
      </ul>
      <Skeleton height={40} borderRadius={8} />
    </div>
  );
}

export default ManageAccountSkeleton;
