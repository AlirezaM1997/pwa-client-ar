import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: "",
  refreshHash: "",
  _id: "",
};
function token(state, action) {
  state.token = action.payload.token;
  state.refreshHash = action.payload.refreshHash;
  state._id = action.payload._id;
}
export const tokenSlice = createSlice({
  name: "Token",
  initialState,
  reducers: {
    token,
  },
});
export const { token: tokenAction } = tokenSlice.actions;
export default tokenSlice.reducer;
