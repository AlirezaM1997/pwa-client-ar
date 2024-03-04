import Head from "next/head";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { LanguageSquare } from "iconsax-react";
//COMPONENT
import HeaderSkeleton from "./HeaderSkeleton";
import Skeleton from "@components/kit/skeleton/Main";

export default function MyProfilePageSettingSkeleton() {
  return (
    <>
      <section>
        <HeaderSkeleton width="45%" hasBackButton />
        <main className="max-w-[1320px] 2xl:mx-auto">
          <Skeleton height={36} className="mb-5" />
          <div className="px-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center ltr:justify-start mb-5">
                <Skeleton height={24} width={24} circle className="ltr:mr-3 rtl:ml-3 " />
                <div className="flex items-center justify-between w-full">
                  <Skeleton height={24} />
                  <Skeleton height={24} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </section>
    </>
  );
}
