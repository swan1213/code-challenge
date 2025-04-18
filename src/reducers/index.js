import { combineReducers } from "redux";
import accounts from "./accounts";
import journalEntries from "./journal";
import userInput from "./userInput";
import balance from "./balance";

export default combineReducers({
  accounts,
  journalEntries,
  userInput,
  balance,
});
