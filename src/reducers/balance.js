import * as actions from "../actions";

const initialState = [
  {
    ACCOUNT: 0,
    DESCRIPTION: "",
    DEBIT: 0,
    CREDIT: 0,
    BALANCE: 0,
  },
];

export default function balance(state = initialState, action) {
  switch (action.type) {
    case actions.SET_USER_ENTRY:
      return action.payload;

    default:
      return state;
  }
}
