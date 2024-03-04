import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
// GQL
import { COMMENT } from "@services/gql/mutation/COMMENT";
// COMPONENT dynamic import
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function CommentForm({
  targetId,
  targetType,
  refetch = "",
  addToComments = null,
  classNames,
}) {
  const router = useRouter();
  const { token } = useSelector((state) => state.token);
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [text, setText] = useState("");
  const [comment_mutation] = useMutation(COMMENT);
  const sendComments = async () => {
    try {
      const {
        data: { comment },
      } = await comment_mutation({
        variables: {
          data: {
            text,
            targetType,
            targetId,
            pros: [],
            cons: [],
          },
        },
      });
      if (comment.result.status === 200) {
        setText("");
        refetch && refetch();
        addToComments(comment.data, true);
      }
    } catch (error) {
      if (error.message === "Token required" || error.message === "Authorization failed") {
        setShowLogin(true);
      }
    }
  };

  return (
    <>
      <section className={classNames + " mb-2 rounded-lg border-[1px] border-gray5"}>
        <textarea
          id="description"
          rows={5}
          className="w-full relative p-[11px] rounded-lg border-none outline-none shadow-none caption2 placeholder:text-gray4 lg:text-[16px]"
          placeholder={token ? t("writeYourComments") + " ..." : t("login.loginHint") + " ..."}
          disabled={!token}
          value={text}
          onChange={(e) => setText(e.target.value.replace(/^\s+/, ""))}
          maxLength={1000}
        />

        <div className="flex justify-end py-[8px] px-[7px] border-t-[1.5px] border-gray6">
          <button
            className="bg-main2 cta2 text-white rounded-[10px] w-[72px] h-[40px] lg:w-[98px] lg:text-[16px]"
            onClick={() => sendComments()}
          >
            {token ? t("send") : t("login.title")}
          </button>
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
