import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import tokenReducer from "./slices/token";
import isUserReducer from "./slices/isUser";
import logOutReducer from "./slices/logout";
import accountsReducer from "./slices/accounts";
import messagesReducer from "./slices/message";
import landingPageReducer from "./slices/landingPage";

const appReducer = combineReducers({
  token: tokenReducer,
  isUser: isUserReducer,
  logOut: logOutReducer,
  accounts: accountsReducer,
  message: messagesReducer,
  landingPage: landingPageReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "logOut/logOut") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
