import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ArrowRight2, Cards, Money, MoneyAdd, ReceiptMinus } from "iconsax-react";
//FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
//GQL
import { USER_ME_BALANCE } from "@services/gql/query/USER_ME_BALANCE";
import { ASSOCIATION_ME_BALANCE } from "@services/gql/query/ASSOCIATION_ME_BALANCE";
//COMPONENT
import Header from "@components/common/Header";
import AccountsSection from "@components/pages/wallet/AccountsSection";
import WalletPageSkeleton from "@components/common/skeleton/WalletPageSkeleton";
// COMPONENT DYNAMIC IMPORT
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const DepositeSection = dynamic(() => import("@components/pages/wallet/DepositeSection"), {
  ssr: false,
});
const WithdrawlSection = dynamic(() => import("@components/pages/wallet/WithdrawlSection"), {
  ssr: false,
});
const TransactionsSection = dynamic(() => import("@components/pages/wallet/TransactionsSection"), {
  ssr: false,
});

export default function WalletPage() {
  //HOOK
  const { t } = useTranslation();
  const { t: tW } = useTranslation("wallet");
  const isUser = useSelector((state) => state.isUser.isUser);
  const router = useRouter();
  const size = useWindowSize();

  //STATE
  const [totalBalance, setTotalBalance] = useState(null);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [openIncrease, setOpenIncrease] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  //FOR_DESKTOP
  const [sectionShowNumber, setSectionShowNumber] = useState(1);

  //GRAPHQL
  const [callUserQuery, _user] = useLazyQuery(USER_ME_BALANCE, { fetchPolicy: "no-cache" });
  const [callAssociationQuery, _association] = useLazyQuery(ASSOCIATION_ME_BALANCE, {
    fetchPolicy: "no-cache",
  });

  //FUNCTION
  useEffect(() => {
    if (isUser) {
      callUserQuery();
    } else {
      callAssociationQuery();
    }
  }, []);

  useEffect(() => {
    if (_user.data) {
      setTotalBalance(_user.data.user_me.balance);
      setName(_user.data.user_me.name);
      setImage(
        _user.data.user_me.image?.length > 0
          ? _user.data.user_me.image
          : "/assets/images/default-user-image.png"
      );
    }
    if (_association.data) {
      setTotalBalance(_association.data.association_me.balance);
      setName(_association.data.association_me.name);
      setImage(
        _association.data.association_me.image?.length > 0
          ? _association.data.association_me.image
          : "/assets/images/default-association-image.png"
      );
    }
  }, [_user.data, _association.data]);

  if (totalBalance == null || redirectLoading) return <WalletPageSkeleton />;
  return (
    <>
      <Head>
        <title>{t("wallet")}</title>
      </Head>
      {size.width < 960 && (
        <Header onClick={() => (window.location.href = "/my-profile")} title={t("wallet")} />
      )}
      <main className=" lg:grid lg:grid-cols-[420px_auto] max-w-[1320px] 2xl:mx-auto lg:px-[30px] lg:mt-[50px] lg:pb-[200px] lg:gap-x-5">
        <section>
          <header className="bg-main2 lg:bg-white lg:border-[1px] lg:border-gray5 lg:rounded-xl px-5 lg:px-0 mb-[30px] lg:mb-5 pt-[18px] text-white lg:text-black">
            <div className="flex items-center gap-x-[10px] lg:pb-3 lg:border-b-[1px] lg:border-gray5 lg:px-5">
              <div className="relative w-[45px] h-[45px] lg:w-[65px] lg:h-[65px] bg-white rounded-full">
                <Image
                  src={image}
                  layout="fill"
                  alt="user_image"
                  className="rounded-full cover-center-img"
                ></Image>
              </div>
              <div>
                <p className="cta3 lg:text-[22px] lg:font-bold lg:leading-[40px]">{`${t(
                  "hi"
                )} ${name}`}</p>
                <p className="caption4 lg:text-[14px] lg:font-normal lg:leading-[20px]">
                  {tW("welToMofid")}
                </p>
              </div>
            </div>
            <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:px-5 lg:py-4">
              <div className="flex justify-center mt-[22px] lg:m-0 text-[36px] font-bold leading-[44px] lg:text-[22px] lg:font-bold lg:leading-[40px] lg:text-main1 gap-x-2">
                <p className="">{moneyFormatter(totalBalance)}</p>
                <p className="text-[20px]">{t("toman")}</p>
              </div>
              <p className="titleInput pb-4 pt-[10px] lg:p-0 text-center lg:text-[22px] lg:font-bold lg:leading-[40px]">
                {tW("totalBalance")}
              </p>
            </div>
          </header>
          <section className="grid grid-cols-4 gap-x-[28px] px-4 lg:px-0 lg:flex lg:flex-col lg:rounded-xl lg:border-[1px] lg:border-gray5">
            <div
              className={`flex flex-col lg:flex-row lg:justify-between items-center cursor-pointer hover:lg:bg-main9 ${
                sectionShowNumber === 1 ? "lg:bg-main9" : ""
              } lg:px-[18px] lg:py-3`}
              onClick={() => (size.width < 960 ? setOpenIncrease(true) : setSectionShowNumber(1))}
            >
              <div className="flex items-center flex-col lg:flex-row lg:gap-x-4">
                <div className="rounded-full bg-main7 w-[60px] h-[60px] flex items-center justify-center">
                  <MoneyAdd size={24} color="#00839E" variant="Bold" />
                </div>
                <h5 className="pt-[6px] lg:pt-0 caption3 lg:text-[16px] lg:font-medium ">
                  {tW("deposit")}
                </h5>
              </div>
              <div className="hidden lg:block rtl:rotate-180">
                <ArrowRight2 />
              </div>
            </div>
            <div
              onClick={() =>
                size.width < 960
                  ? router.push("/wallet/withdrawal", undefined, { shallow: true })
                  : setSectionShowNumber(2)
              }
              className={`flex flex-col lg:flex-row lg:justify-between items-center lg:py-3 cursor-pointer hover:lg:bg-main9 ${
                sectionShowNumber === 2 ? "lg:bg-main9" : ""
              } lg:px-[18px]`}
            >
              <div className="flex items-center flex-col lg:flex-row lg:gap-x-4">
                <div className="rounded-full bg-main7 w-[60px] h-[60px] flex items-center justify-center">
                  <Money size={24} color="#00839E" variant="Bold" />
                </div>
                <h5 className="pt-[6px] lg:pt-0 caption3 lg:text-[16px] lg:font-medium ">
                  {tW("withdrawal")}
                </h5>
              </div>
              <div className="hidden lg:block rtl:rotate-180">
                <ArrowRight2 />
              </div>
            </div>
            <div
              onClick={() =>
                size.width < 960
                  ? router.push("/wallet/accounts", undefined, { shallow: true })
                  : setSectionShowNumber(3)
              }
              className={`flex flex-col lg:flex-row lg:justify-between items-center lg:py-3 cursor-pointer hover:lg:bg-main9 ${
                sectionShowNumber === 3 ? "lg:bg-main9" : ""
              } lg:px-[18px]`}
            >
              <div className="flex items-center flex-col lg:flex-row lg:gap-x-4">
                <div className="rounded-full bg-main7 w-[60px] h-[60px] flex items-center justify-center">
                  <Cards size={24} color="#00839E" variant="Bold" />
                </div>
                <h5 className="pt-[6px] lg:pt-0 caption3 lg:text-[16px] lg:font-medium  whitespace-nowrap">
                  {tW("accounts")}
                </h5>
              </div>
              <div className="hidden lg:block rtl:rotate-180">
                <ArrowRight2 />
              </div>
            </div>
            <div
              onClick={() =>
                size.width < 960
                  ? router.push("/wallet/transactions", undefined, { shallow: true })
                  : setSectionShowNumber(4)
              }
              className={`flex flex-col lg:flex-row lg:justify-between items-center lg:py-3 cursor-pointer hover:lg:bg-main9 ${
                sectionShowNumber === 4 ? "lg:bg-main9" : ""
              } lg:px-[18px]`}
            >
              <div className="flex items-center flex-col lg:flex-row lg:gap-x-4">
                <div className="rounded-full bg-main7 w-[60px] h-[60px] flex items-center justify-center">
                  <ReceiptMinus size={24} color="#00839E" variant="Bold" />
                </div>
                <h5 className="pt-[6px] lg:pt-0 caption3 lg:text-[16px] lg:font-medium ">
                  {tW("transactions")}
                </h5>
              </div>
              <div className="hidden lg:block rtl:rotate-180">
                <ArrowRight2 />
              </div>
            </div>
          </section>
        </section>

        {size.width > 960 && sectionShowNumber === 1 && (
          <section className="border-[1px] border-gray5 rounded-xl px-6 pt-6 pb-5 relative">
            <DepositeSection t={t} tW={tW} setRedirectLoading={setRedirectLoading} />
          </section>
        )}

        {size.width > 960 && sectionShowNumber === 2 && (
          <section className="border-[1px] border-gray5 rounded-xl px-6 pt-6 pb-5 relative">
            <WithdrawlSection t={t} tW={tW} setSectionShowNumber={setSectionShowNumber} />
          </section>
        )}

        {size.width > 960 && sectionShowNumber === 3 && (
          <section className="border-[1px] border-gray5 rounded-xl px-6 pt-6 pb-5 relative">
            <AccountsSection tW={tW} t={t} />
          </section>
        )}

        {size.width > 960 && sectionShowNumber === 4 && (
          <section className="border-[1px] border-gray5 rounded-xl relative overflow-hidden">
            <TransactionsSection t={t} tW={tW} />
          </section>
        )}
      </main>

      <BottomSheet open={openIncrease} setOpen={setOpenIncrease}>
        <DepositeSection t={t} tW={tW} setRedirectLoading={setRedirectLoading} />
      </BottomSheet>
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common", "wallet"])),
    },
  });
}
