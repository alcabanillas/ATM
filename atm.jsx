const ATMDeposit = ({ onChange, isValid }) => {
  return (
    <div className="text-center">
        <div className="row">
          <div className="col">
            <input type="number" min="0" onChange={onChange}></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input type="submit" className="btn btn-primary" disabled={!isValid} value="Submit" ></input>
          </div>
        </div>
    </div>
    
  );
};

const Account = ({ addTransaction }) => {
  const [deposit, setDeposit] = React.useState(0); // state of this transaction
  const [totalState, setTotalState] = React.useState(0);
  const [isDeposit, setIsDeposit] = React.useState(true);
  const [validTransaction, setValidTransaction] = React.useState(false);
  const [atmMode, setAtmMode] = React.useState("");

  const choice = ["Deposit", "Withdraw"];

  const handleChange = (event) => {
    if (Number(event.target.value) < 0) {
      setValidTransaction(false);
      return;
    }

    if (!isDeposit && Number(event.target.value) > totalState) {
      setValidTransaction(false);
    } else {
      setValidTransaction(true);
    }

    setDeposit(Number(event.target.value));
  };

  const handleSubmit = (event) => {
    let newTotal = isDeposit ? totalState + deposit : totalState - deposit;
    console.log(`${totalState}:${newTotal}`);
    if (totalState !== newTotal)
      addTransaction({ isDeposit, amount: deposit, balance: newTotal });
    setTotalState(newTotal);
    console.log(`NewTotal = ${newTotal}`);

    setValidTransaction(false);
    setAtmMode("");

    event.preventDefault();
  };

  const handleModeSelect = (event) => {
    console.log(event.target.value);
    setAtmMode(event.target.value);
    if (event.target.value == "") return;
    setIsDeposit(event.target.value === "Deposit");
    console.log("Operation included: ", choice.includes(atmMode));
  };

  return (
    <form onSubmit={handleSubmit} className="container overflow-hidden">
      <div className="row text-center">
        <h2 className="col" id="total">
          Balance ${totalState}
        </h2>
      </div>
      <div className="row text-center">
      <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        <div className="col">
          <input type="radio" className="btn-check" data-toggle="button" name="btnOperation" id="btnDeposit" autoComplete="off" value="Deposit" 
            checked={atmMode === "Deposit"} onChange={handleModeSelect}/>
          <label className="btn btn-outline-primary " htmlFor="btnDeposit">Deposit </label>
        </div>
        <div className="col"> 
          <input type="radio" className="btn-check"  data-toggle="button" name="btnOperation" id="btnWithdraw" autoComplete="off" value="Withdraw"
            checked={atmMode === "Withdraw"} onChange={handleModeSelect}/>
          <label className="btn btn-outline-primary" htmlFor="btnWithdraw">
            WithDraw
          </label>
        </div>
      </div>
      </div>
      {choice.includes(atmMode) && (
        <div>
          <ATMDeposit onChange={handleChange} isValid={validTransaction} />
        </div>
      )}
    </form>
  );
};

const Transactions = ({ transactionList }) => {
  const listItems = transactionList.map((item, index) => {
    const formatDate = (value) => {
      return new Date(value).toUTCString();
    };

    return (
      <tr key={index + 1}>
        <td>{index + 1}</td>
        <td>{formatDate(item.date)}</td>
        <td style={{ color: item.isDeposit ? "green" : "red" }}>
          {item.amount}
        </td>
        <td>{item.balance}</td>
      </tr>
    );
  });

  return (
    <div className="container g-5 overflow-hidden">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody>{listItems}</tbody>
      </table>
    </div>
  );
};

const Atm = () => {
  const [transactions, setTransactionList] = React.useState([]);

  const transactionDone = ({ isDeposit, amount, balance }) => {
    const newTransactions = [
      ...transactions,
      { date: new Date().getTime(), isDeposit, amount, balance },
    ];
    setTransactionList(newTransactions);
  };

  return (
    <div>
      <Account addTransaction={transactionDone} />
      {transactions.length > 0 && (
        <Transactions transactionList={transactions} />
      )}
    </div>
  );
};

// ========================================
ReactDOM.render(<Atm />, document.getElementById("root"));
