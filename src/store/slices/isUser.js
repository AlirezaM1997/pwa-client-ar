import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isUser: true,
};
function isUser(state, action) {
  state.isUser = action.payload.isUser;
}
export const isUserSlice = createSlice({
  name: "isUser",
  initialState,
  reducers: {
    isUser,
  },
});
export const { isUser: isUserAction } =
  isUserSlice.actions;
export default isUserSlice.reducer;
