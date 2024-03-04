import cx from "classnames";
import Head from "next/head";
import toast from "react-hot-toast";
import { Send } from "iconsax-react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useLazyQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { landingPageAction } from "@store/slices/landingPage";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { COMMENT } from "@services/gql/mutation/COMMENT";
import { GET_COMMENTS } from "@services/gql/query/GET_COMMENTS";
import { GET_SINGLE_COMMENT } from "@services/gql/query/GET_SINGLE_COMMENT";
//COMPONENT
import Header from "@components/common/Header";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import dynamic from "next/dynamic";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const CommentCard = dynamic(() => import("@components/common/CommentCard"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

const limit_item = 10;

export default function ReplyCommentPage() {
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const dir = lang == "ar" ? "rtl" : "ltr";
  const textRef = useRef(null);
  const router = useRouter();
  const commentId = router?.query?.id;
  const [text, setText] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage] = useState(0);
  const [comments, setComments] = useState([]);
  const [sendDisabled, setSendDisabled] = useState(false);
  const dispatch = useDispatch();
  const initialFormData = useSelector((state) => state.landingPage.formData);
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);
  const currentUser = accounts.filter((i) => i._id === token?._id);
  const [comment_mutation] = useMutation(COMMENT);

  const {
    loading: singleLoading,
    error: singleError,
    data: singleComment,
  } = useQuery(GET_SINGLE_COMMENT, {
    variables: {
      commentId: commentId,
    },
    fetchPolicy: "no-cache",
  });

  const [getReplyComments, { error, loading, data, fetchMore }] = useLazyQuery(GET_COMMENTS, {
    variables: {
      targetType: "COMMENT",
      targetId: `${commentId}`,
      page: 0,
      limit: limit_item,
    },
    fetchPolicy: "no-cache",
  });

  const addToComments = (newCommnets = [], addTopOfList = false) => {
    //setTofires is true when new comment create in commentForm
    if (addTopOfList) {
      setComments([newCommnets, ...comments]);
    } else {
      setComments([...comments, ...newCommnets]);
    }
  };

  useEffect(() => {
    setText(initialFormData?.text);
    if (token?._id && currentUser[0]?.name) {
      dispatch(
        landingPageAction({
          formData: null,
        })
      );
    }
  }, []);

  useEffect(() => {
    getReplyComments().then(({ data }) => {
      addToComments(data?.get_comments.result);
      setPage(1);
    });
  }, []);

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        addToComments(data.get_comments.result);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  const goToLoginPage = () => {
    dispatch(
      landingPageAction({
        url: router.asPath,
        formData: {
          text,
        },
      })
    );
    setShowLogin(true);
  };

  const sendComments = async () => {
    try {
      setSendDisabled(true);
      const {
        data: { comment },
      } = await comment_mutation({
        variables: {
          data: {
            text,
            targetType: "COMMENT",
            targetId: commentId,
            pros: [],
            cons: [],
          },
        },
      });
      if (comment.result.status === 200) {
        setText("");
        toast.custom(() => <Toast text={t("successfulCommentToast")} />);
        addToComments(comment.data, true);
        if (textRef) textRef.current.style.height = "22px";
        setTimeout(() => setSendDisabled(false), 1000);
      }
    } catch (error) {
      setSendDisabled(false);
      if (error.message === "Token required" || error.message === "Authorization failed") {
        goToLoginPage();
      }
    }
  };

  const total = data?.get_comments?.total ?? 0;
  const hasMore = limit_item * page < total;
  const oneComments = comments.length === 1;

  if (error || singleError) return <h5>{error?.message}</h5>;
  if (loading || singleLoading || !singleComment) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>{t("comments")}</title>
      </Head>
      <Header
        onClick={() => {
          toast.remove();
          router.back();
        }}
        title={t("comments")}
      />
      <section className="pt-[4px] pb-[160px] lg:pb-[160px]">
        <div className="px-4">
          <CommentCard
            showAsReply={true}
            data={singleComment?.get_single_comment}
            classNames="mb-[30px]"
          />
          <InfiniteScroll
            dataLength={comments?.length ?? 0}
            hasMore={hasMore}
            next={fetchingMore}
            style={{ overflow: "unset" }}
          >
            {comments.map((item, index) => {
              return (
                <CommentCard
                  showAsReply={true}
                  key={index}
                  data={item}
                  classNames={oneComments ? "mb-[86px]" : "mb-[30px]"}
                />
              );
            })}
          </InfiniteScroll>
        </div>
        <div className="flex px-4 py-[15px] bg-white border-[#f1efef] rounded-lg lg:rounded-none fixed bottom-0 w-full">
          <div className="w-full flex-row flex justify-center items-end py-3 rounded-[28px] border-[1px] bg-gray6 border-gray5 outline-none px-[10px]">
            <textarea
              type="text"
              dir={dir}
              className="w-full text-[14px] outline-none font-normal py-0 rtl:pl-0 ltr:text-left ltr:pr-0 rtl:text-right mx-2 leading-[22px] max-h-[126px] h-[24px] bg-gray6 placeholder:text-gray4 border-none focus:outline-none focus:border-none focus:shadow-none"
              value={text}
              ref={textRef}
              onChange={(e) => {
                setText(e.target.value.replace(/^\s+/, ""));
                e.target.style.height = "22px";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              autoComplete="off"
              maxLength={1000}
              placeholder={token?.token ? t("writeYourComments") : t("login.loginHint")}
              disabled={sendDisabled || !token?.token}
            />
            <Send
              size="20"
              color={!sendDisabled ? "#ACACAF" : "black"} //gray4
              variant="Bold"
              onClick={() => {
                token?.token ? (!sendDisabled && text ? sendComments() : null) : goToLoginPage();
              }}
              className={cx({ "transform rotate-180": dir === "rtl" })}
            />
          </div>
        </div>
      </section>
      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} landingRoute={router.asPath} />
        </ModalScreen>
      )}
    </>
  );
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  });
}
