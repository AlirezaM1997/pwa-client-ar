import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  logOut: false,
};
function logOut(state, action) {
  state.logOut = action.payload;
}
export const logOutSlice = createSlice({
  name: "logOut",
  initialState,
  reducers: {
    logOut,
  },
});
export const { logOut: logOutAction } =
  logOutSlice.actions;
export default logOutSlice.reducer;
