import { useMutation } from "@apollo/client";
import { useState, useRef, useEffect } from "react";
import { USER_AUTH_STEP_ONE } from "@services/gql/mutation/USER_AUTH_STEP_ONE";
import { ASSOCIATION_AUTH_STEP_ONE } from "@services/gql/mutation/ASSOCIATION_AUTH_STEP_ONE";

export default function Timer({ t, phoneNumber, user, setIncorrectCode }) {
  const [user_mutation] = useMutation(USER_AUTH_STEP_ONE);
  const [association_mutation] = useMutation(ASSOCIATION_AUTH_STEP_ONE);

  const [timer, setTimer] = useState("03:00");
  const Ref = useRef(null);
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };
  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer((minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds));
    }
  };
  const clearTimer = (e) => {
    setTimer("03:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };
  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 180);
    return deadline;
  };
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);
  const onClickReset = () => {
    if (timer === "00:00") {
      setIncorrectCode(false);
      sendRequest();
    }
  };
  const sendRequest = async () => {
    if (user) {
      try {
        const {
          data: { user_auth_stepOne },
        } = await user_mutation({
          variables: {
            phoneNumber,
          },
        });
        if (user_auth_stepOne.status === 200) {
          clearTimer(getDeadTime());
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const {
          data: { association_auth_stepOne },
        } = await association_mutation({
          variables: {
            phoneNumber,
          },
        });
        if (association_auth_stepOne.status == 200) {
          clearTimer(getDeadTime());
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="text-[44px] lg:text-[46px] font-extralight leading-[26px] text-gray1">{timer}</h2>
      <p className="text-[14px] lg:text-[18px] text-gray4 px-[58px] font-normal leading-[26px] pt-[25px] pb-[40px] text-center">
        {t("login.confirmCodeText")}
      </p>
      <button
        className={`text-[14px] lg:text-[16px] font-semibold leading-[26px] ${timer === "00:00" ? "text-main2" : "text-gray4"} `}
        onClick={() => onClickReset()}
      >
        {t("login.resendCode")}
      </button>
    </div>
  );
}
