import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as utils from "../utils";

class BalanceOutput extends Component {
  render() {
    if (!this.props.userInput.format) {
      return null;
    }
    const isDefaultEmpty =
      this.props.balance.length === 0 ||
      (this.props.balance.length === 1 && this.props.balance[0].ACCOUNT === 0);
    return (
      <div className="output">
        <p>
          Total Debit: {this.props.totalDebit} Total Credit:{" "}
          {this.props.totalCredit}
          <br />
          Balance from account {this.props.userInput.startAccount ||
            "*"} to {this.props.userInput.endAccount || "*"} from period{" "}
          {utils.dateToString(this.props.userInput.startPeriod)} to{" "}
          {utils.dateToString(this.props.userInput.endPeriod)}
        </p>
        {!isDefaultEmpty && this.props.userInput.format === "CSV" ? (
          <pre>{utils.toCSV(this.props.balance)}</pre>
        ) : null}
        {this.props.userInput.format === "HTML" ? (
          <table className="table">
            <thead>
              <tr>
                <th>ACCOUNT</th>
                <th>DESCRIPTION</th>
                <th>DEBIT</th>
                <th>CREDIT</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {this.props.balance.map((entry, i) => (
                <tr key={i}>
                  <th scope="row">{entry.ACCOUNT}</th>
                  <td>{entry.DESCRIPTION}</td>
                  <td>{entry.DEBIT}</td>
                  <td>{entry.CREDIT}</td>
                  <td>{entry.BALANCE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  }
}
BalanceOutput.propTypes = {
  balance: PropTypes.arrayOf(
    PropTypes.shape({
      ACCOUNT: PropTypes.number.isRequired,
      DESCRIPTION: PropTypes.string.isRequired,
      DEBIT: PropTypes.number.isRequired,
      CREDIT: PropTypes.number.isRequired,
      BALANCE: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalCredit: PropTypes.number.isRequired,
  totalDebit: PropTypes.number.isRequired,
  userInput: PropTypes.shape({
    startAccount: PropTypes.number,
    endAccount: PropTypes.number,
    startPeriod: PropTypes.date,
    endPeriod: PropTypes.date,
    format: PropTypes.string,
  }).isRequired,
};

export default connect((state) => {
  let totalCredit = 0;
  let totalDebit = 0;
  if (Array.isArray(state.balance)) {
    totalCredit = state.balance.reduce((acc, { CREDIT }) => {
      return acc + (typeof CREDIT === "number" ? CREDIT : 0);
    }, 0);

    totalDebit = state.balance.reduce((acc, { DEBIT }) => {
      return acc + (typeof DEBIT === "number" ? DEBIT : 0);
    }, 0);
  }

  return {
    balance: state.balance,
    totalCredit,
    totalDebit,
    userInput: state.userInput,
  };
})(BalanceOutput);
