import Head from "next/head";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";
import FinancialParticipationSkeleton from "./FinancialParticipationSkeleton";

function ParticipationPageSkeleton() {
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  return (
    <>
      <Head>
        <title>page-title</title>
      </Head>
      <section className="2xl:w-[1320px] 2xl:mx-auto ">
        <div className="flex justify-between px-4 pt-5 lg:justify-end">
          <div className="rounded-full w-8 h-8 flex items-center justify-center lg:hidden">
            {lang === "en" ? (
              <Skeleton height={24} width={24} circle />
            ) : (
              <Skeleton height={24} width={24} circle />
            )}
          </div>
          <Skeleton className="lg:hidden" height={32} width={250} />
          <div className="rounded-full flex items-center justify-center cursor-pointer">
            <Skeleton height={24} width={24} circle />
          </div>
        </div>
        <header className="px-4 mt-[30px] w-full">
          <div className="border-b-[1px] lg:border-b-[3px] border-gray6 relative py-[8px] lg:py-[16px] px-1 flex justify-between gap-x-6 chipsFilter">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton height={20} width={100} key={item} />
            ))}
          </div>
        </header>
        <main className="flex flex-col justify-center items-center w-full">
          {router.query.tab == 1 && <FinancialParticipationSkeleton />}
        </main>
      </section>
    </>
  );
}

export default ParticipationPageSkeleton;
