import Image from "next/legacy/image";
import { Heart } from "iconsax-react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
// GQL
import { LIKE_PROJECT } from "@services/gql/mutation/LIKE_PROJECT";
// COMPONENT
import SquareBoxWithIcon from "@components/common/SquareBoxWithIcon";

export const LikeButton = ({
  likeCount = 0,
  haveILiked = false,
  refetch,
  id,
  iconMode = "small",
  size,
}) => {
  const isInLike = useRef(false);
  const [like, setLike] = useState(false);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const [likeProject] = useMutation(LIKE_PROJECT);

  useEffect(() => {
    haveILiked ? setLike(true) : null;
    likeCount ? setCount(likeCount) : null;
  }, [haveILiked, likeCount]);

  const sendRequest = async () => {
    const variables = {
      projectId: id,
    };

    const likeMutation = likeProject;
    const likeMutationData = "like_project";
    try {
      const {
        data: {
          [likeMutationData]: { status },
        },
      } = await likeMutation({ variables });
      if (status === 200 && refetch) refetch();
      if (status !== 200) {
        setLike(haveILiked);
        setCount(likeCount);
        alert("متاسفانه لایک شما ثبت نشد");
      }
    } catch (error) {
      setLike(haveILiked);
      setCount(likeCount);
      alert("متاسفانه لایک شما ثبت نشد");
      console.log("its ERROR", error);

      if (error.message === "Authorization failed" || error.message === "Token required") {
        router.push("/login", undefined, { shallow: true });
      }
    }
  };

  const onChangeLike = (liked) => {
    clearTimeout(isInLike.current);
    setLike(!liked);
    setCount(liked === true ? count - 1 : count + 1);
    isInLike.current = setTimeout(() => {
      if (isInLike) sendRequest();
    }, 1000);
  };

  if (iconMode === "small") {
    return (
      <button
        className="flex flex-col items-center border-[1px] border-gray1 rounded-lg px-[10px] py-[3px]  mx-1 "
        onClick={() => onChangeLike(like)}
      >
        <Image
          src={like ? "/assets/images/heartOn.png" : "/assets/images/heartOff.png"}
          width={18}
          height={17}
          alt={"heart"}
        ></Image>

        <p className="text-[9px] ">{count}</p>
      </button>
    );
  } else if (iconMode === "medium") {
    return (
      <button className="flex flex-col items-center mx-1 " onClick={() => onChangeLike(like)}>
        <Image
          src={like ? "/assets/images/heartOn.png" : "/assets/images/heartOff.png"}
          width={19}
          height={18}
          alt={"heart"}
        ></Image>
      </button>
    );
  } else {
    return (
      <SquareBoxWithIcon
        size={size}
        classNames="flex-col justify-center bg-main7 rounded-full cursor-pointer"
        onClick={() => onChangeLike(like)}
        icon={
          <>
            <Heart
              size="11"
              color={like ? "danger" : "#03A7CC"}
              variant={like ? "Bold" : "Linear"}
            />
            <span className="text-[6px] text-gray1">{count}</span>
          </>
        }
      />
    );
  }
};
