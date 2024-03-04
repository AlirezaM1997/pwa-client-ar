// this code store data of page that from it go to login page or login modal.

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  url: "/",
  formData: null,
};

function landingPageFunc(state, action) {
  return {
    ...state,
    ...action.payload,
  };
}

export const landingPageSlice = createSlice({
  name: "landingPageSlice",
  initialState,
  reducers: {
    landingPageFunc,
  },
});
export const { landingPageFunc: landingPageAction } = landingPageSlice.actions;
export default landingPageSlice.reducer;
