import HeaderSkeleton from "./HeaderSkeleton";
import { useWindowSize } from "@uidotdev/usehooks";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";
import DepositSectionSkeleton from "./DepositSectionSkeleton";

export default function WalletPageSkeleton() {
  const size = useWindowSize();
  return (
    <>
      {size.width < 960 && <HeaderSkeleton />}
      <main className=" lg:grid lg:grid-cols-[420px_auto] max-w-[1320px] 2xl:mx-auto lg:px-[30px] lg:mt-[50px] lg:pb-[200px] lg:gap-x-5">
        <section>
          <header className="lg:border-[1px] lg:border-gray5 lg:rounded-xl px-5 lg:px-0 mb-[30px] lg:mb-5 pt-[18px]">
            <div className="flex items-center gap-x-[10px] lg:pb-3 lg:border-b-[1px] lg:border-gray5 lg:px-5">
              <div className="relative w-[45px] h-[45px] lg:w-[65px] lg:h-[65px] rounded-full">
                <Skeleton
                  height={size.width > 960 ? 65 : 45}
                  width={size.width > 960 ? 65 : 45}
                  circle
                />
              </div>
              <div className="w-full flex flex-col gap-1 my-1">
                <Skeleton height={40} />
                <Skeleton height={20} />
              </div>
            </div>
            <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:px-5 lg:py-4">
              <Skeleton height={40} />
            </div>
          </header>
          <section className="grid grid-cols-4 gap-x-[28px] px-4 lg:px-0 lg:flex lg:flex-col lg:rounded-xl lg:border-[1px] lg:border-gray5">
            {[1, 2, 3, 4].map((item) => (
              <div
                className="flex flex-col lg:flex-row lg:justify-between items-center lg:px-[18px] lg:py-3"
                key={item}
              >
                <div className="flex items-center flex-col lg:flex-row lg:gap-x-4 w-full">
                  <Skeleton
                    width={50}
                    height={45}
                    circle
                    className="flex items-center justify-center my-1"
                  />
                  <Skeleton height={40} width={150} />
                </div>
              </div>
            ))}
          </section>
        </section>
        {size.width > 960 && (
          <section className="border-[1px] border-gray5 rounded-xl px-6 pt-6 pb-5 relative">
            <DepositSectionSkeleton />
          </section>
        )}
      </main>
    </>
  );
}
