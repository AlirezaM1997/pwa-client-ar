import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  accounts: [],
};
function accounts(state, action) {
  state.accounts = action.payload.accounts;
}
export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    accounts,
  },
});
export const { accounts: accountsAction } = accountsSlice.actions;
export default accountsSlice.reducer;
