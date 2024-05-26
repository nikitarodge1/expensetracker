import { useEffect, useState, useCallback } from "react";
import Card from "../../components/Card/Card";
import styles from "./Home.module.css";
import TransactionList from "../../components/TransactionList/TransactionList";
import ExpenseForm from "../../components/Forms/ExpenseForm/ExpenseForm";
import Modal from "../../components/Modal/Modal";
import AddBalanceForm from "../../components/Forms/AddBalanceForm/AddBalanceForm";
import PieChart from "../../components/PieChart/PieChart";
import BarChart from "../../components/BarChart/BarChart";

const useLocalStorage = (key, initialVal) => {
  const [storedVal, setStoredVal] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialVal;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedVal));
  }, [key, storedVal]);

  return [storedVal, setStoredVal];
};

const calculateCategoryStats = (expList) => {
  return expList.reduce(
    (acc, item) => {
      acc.spends[item.category] =
        (acc.spends[item.category] || 0) + Number(item.price);
      return acc;
    },
    {
      spends: { food: 0, entertainment: 0, travel: 0 },
    }
  );
};

export default function Home() {
  const [bal, setBal] = useLocalStorage("balance", 5000);
  const [expList, setExpList] = useLocalStorage("expenses", []);

  // Show hide modals
  const [isOpenExp, setIsOpenExp] = useState(false);
  const [isOpenBal, setIsOpenBal] = useState(false);

  const { spends: categorySpends } = calculateCategoryStats(expList);

  const expense = expList.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const handleAddInc = useCallback(() => {
    setIsOpenBal(true);
  }, []);

  const handleAddExp = useCallback(() => {
    setIsOpenExp(true);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Expense Tracker</h1>

      
      <div className={styles.cardsWrapper}>
        <Card
          title="Wallet Balance"
          money={bal}
          buttonText="+ Add Income"
          buttonType="success"
          handleClick={handleAddInc}
        />

        <Card
          title="Expenses"
          money={expense}
          buttonText="+ Add Expense"
          buttonType="failure"
          success={false}
          handleClick={handleAddExp}
        />

        <PieChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}
        />
      </div>

      {/* Transactions and bar chart wrapper */}
      <div className={styles.transactionsWrapper}>
        <TransactionList
          transactions={expList}
          editTransactions={setExpList}
          title="Recent Transactions"
          balance={bal}
          setBal={setBal}
        />

        <BarChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}
        />
      </div>

      {/* Modals */}
      <Modal isOpen={isOpenExp} setIsOpen={setIsOpenExp}>
        <ExpenseForm
          setIsOpen={setIsOpenExp}
          expList={expList}
          setExpList={setExpList}
          setBal={setBal}
          balance={bal}
        />
      </Modal>

      <Modal isOpen={isOpenBal} setIsOpen={setIsOpenBal}>
        <AddBalanceForm setIsOpen={setIsOpenBal} setBal={setBal} />
      </Modal>
    </div>
  );
}
