import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ArchiveMinus } from "iconsax-react";
// GQL
import { BOOKMARK } from "@services/gql/mutation/BOOKMARK";
import { UNBOOKMARK } from "@services/gql/mutation/UNBOOKMARK";
//COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

const BookMarkButton = ({ haveIBookmarked = false, refetch, id, color = "black", t, type }) => {
  const [bookMark, setBookMark] = useState();
  const router = useRouter();
  const [bookMarkMutation] = useMutation(BOOKMARK);
  const [unBookMarkMutation] = useMutation(UNBOOKMARK);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setBookMark(haveIBookmarked);
  }, []);

  const handleBookMark = async () => {
    const variables = {
      id,
      type,
    };

    try {
      const {
        data: { bookmark },
      } = await bookMarkMutation({ variables });
      if (bookmark.status === 200) {
        refetch && refetch();
        setBookMark(true);
      }
    } catch (error) {
      setBookMark(false);
      if (error.message === "Authorization failed" || error.message === "Token required") {
        router.push("/login", undefined, { shallow: true });
        setCookie("BACK_ROUTE", router.asPath);
      }
    }
  };

  const handleUnBookMark = async () => {
    const variables = {
      id,
      type,
    };

    try {
      const {
        data: { unBookmark },
      } = await unBookMarkMutation({ variables });
      if (unBookmark.status === 200) {
        refetch && refetch();
        setBookMark(false);
      }
    } catch (error) {
      setBookMark(true);
      if (error.message === "Authorization failed" || error.message === "Token required") {
        router.push("/login", undefined, { shallow: true });
      }
    }
  };

  const onChangeBookMark = (bookMark) => {
    if (bookMark) {
      handleUnBookMark();
    } else {
      handleBookMark();
    }
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // setBookMark(!bookMark);
          onChangeBookMark(bookMark);
        }}
      >
        {color === "blue" ? (
          bookMark ? (
            <ArchiveMinus size="15" color="#03A6CF" variant="Bold" />
          ) : (
            <ArchiveMinus size="15" color="#03A6CF" />
          )
        ) : bookMark ? (
          <ArchiveMinus size="15" color="#2E2E2E" variant="Bold" />
        ) : (
          <ArchiveMinus size="15" color="#2E2E2E" />
        )}
      </div>
      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} />
        </ModalScreen>
      )}
    </>
  );
};
export default BookMarkButton;
