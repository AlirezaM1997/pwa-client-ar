import Skeleton from "@components/kit/skeleton/Main";

function FinancialParticipationSkeleton() {
  return (
    <>
      <section className="w-full px-4 pt-4 pb-[120px] 2xl:max-w-[1320px] 2xl:mx-auto">
        <header className="lg:hidden">
          <div className="pt-[14px] flex justify-center">
            <Skeleton height={32} width={250} />
          </div>
        </header>
        <section className="lg:flex lg:items-center lg:gap-x-[30px] xl:gap-x-[60px] 2xl:gap-x-[70px] lg:mt-[55px]">
          <div className="w-full h-[620px] relative hidden mx-auto lg:flex justify-center align-center">
            <Skeleton circle height={480} width={480} className="mt-[115px]" />
          </div>
          <main className="flex flex-col items-center w-full lg:w-[75%]">
            <div className="w-[300px] h-[300px] relative mx-auto my-1 lg:hidden">
              <Skeleton circle height={300} />
            </div>
            <div className="w-full rtl:text-right mb-16 hidden lg:block">
              <div className="flex ltr:flex-col rtl:flex-col-reverse gap-1">
                <Skeleton height={65} />
                <Skeleton height={65} />
              </div>
            </div>

            <Skeleton className="mb-3" height={24} />

            <div className="relative w-full">
              <Skeleton className="mb-3" height={52} />
            </div>
            <div className="w-full mt-4 flex justify-center">
              <div className="flex w-full items-center justify-between lg:justify-center lg:gap-x-[30px]">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    height={48}
                    width={95}
                    className="rounded-lg px-[6px] lg:px-[12px] py-1"
                  />
                ))}
              </div>
            </div>

            <div className="px-4 lg:px-0 w-full fixed lg:static bottom-0 lg:mt-[30px] pb-5 pt-3 lg:pb-0 lg:pt-0 flex justify-center">
              <Skeleton height={48} width="84%" />
            </div>
          </main>
        </section>
      </section>
    </>
  );
}

export default FinancialParticipationSkeleton;
