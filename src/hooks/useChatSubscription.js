import { useSubscription } from "@apollo/client";
import { setNewMessageAction } from "@store/slices/message";
import { useDispatch } from "react-redux";
import { CHAT_SUB } from "@services/gql/subscription/CHAT_SUB";

export const useChatSubscription = (flag) => {
  const dispatch = useDispatch();

  useSubscription(CHAT_SUB, {
    onData: flag
      ? ({ data }) => {
          try {
            const chat = data?.data?.connect_real_time;
            dispatch(setNewMessageAction(chat));
          } catch (error) {
            console.error(error);
          }
        }
      : () => null,
  });
};
