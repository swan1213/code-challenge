import React, { Component } from "react";
import { connect } from "react-redux";
import { accounts, journal } from "../data";
import * as actions from "../actions";
import * as utils from "../utils";

class InputForm extends Component {
  state = {
    accounts,
    journal,
    userInput: "2000 * * MAY-16 CSV",
  };

  componentDidMount() {
    this.handleSubmit();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userInput !== this.props.userInput) {
      const result = this.filteredJournal();
      this.props.dispatch(actions.setUserEntry(result));
    }
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e && e.preventDefault();

    this.props.dispatch(
      actions.setJournalEntries(utils.parseCSV(this.state.journal))
    );
    this.props.dispatch(
      actions.setAccounts(utils.parseCSV(this.state.accounts))
    );
    this.props.dispatch(
      actions.setUserInput(utils.parseUserInput(this.state.userInput))
    );
    const result = this.filteredJournal();
    this.props.dispatch(actions.setUserEntry(result));
  };

  filteredJournal = () => {
    const { journalEntries, userInput, accounts } = this.props;
    if (!journalEntries || !userInput || !accounts) return;
    const isValidDate = (d) => d instanceof Date && !isNaN(d);

    const startDate = isValidDate(userInput.startPeriod)
      ? userInput.startPeriod
      : utils.stringToDate("JAN-16");

    const endDate = isValidDate(userInput.endPeriod)
      ? userInput.endPeriod
      : utils.stringToDate("DEC-16");

    const mergedByAccount = {};

    journalEntries.forEach((entry) => {
      const accountNum = Number(entry.ACCOUNT);
      const entryDate = new Date(entry.PERIOD);
      const matchedAccount = accounts.find(
        (acc) => Number(acc.ACCOUNT) === accountNum
      );

      if (
        matchedAccount &&
        accountNum >= (userInput.startAccount ? userInput.startAccount : 0) &&
        accountNum <=
          (userInput.endAccount ? userInput.endAccount : Infinity) &&
        entryDate >= startDate &&
        entryDate <= endDate
      ) {
        if (!mergedByAccount[accountNum]) {
          mergedByAccount[accountNum] = {
            ACCOUNT: accountNum,
            DESCRIPTION: matchedAccount ? matchedAccount.LABEL : "",
            DEBIT: 0,
            CREDIT: 0,
            BALANCE: 0,
          };
        }
        mergedByAccount[accountNum].DEBIT += entry.DEBIT;
        mergedByAccount[accountNum].CREDIT += entry.CREDIT;
        mergedByAccount[accountNum].BALANCE += entry.DEBIT - entry.CREDIT;
      }
    });

    return Object.values(mergedByAccount);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="journal">Journal</label>
          <textarea
            className="form-control"
            id="journal"
            rows="3"
            value={this.state.journal}
            onChange={this.handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="accounts">Accounts</label>
          <textarea
            className="form-control"
            id="accounts"
            rows="3"
            value={this.state.accounts}
            onChange={this.handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="userInput">User input</label>
          <input
            type="text"
            className="form-control"
            id="userInput"
            value={this.state.userInput}
            onChange={this.handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  }
}

export default connect((state) => {
  return {
    balance: state.balance,
    accounts: state.accounts,
    journalEntries: state.journalEntries,
    userInput: state.userInput,
  };
})(InputForm);
