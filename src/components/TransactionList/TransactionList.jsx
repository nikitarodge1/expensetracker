import TransactionCard from "../TransactionCard/TransactionCard";
import styles from "./TransactionList.module.css";
import Modal from "../Modal/Modal";
import ExpenseForm from "../Forms/ExpenseForm/ExpenseForm";
import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";

export default function TransactionList({
  transactions,
  title,
  editTransactions,
  bal,
  setBal,
}) {
  const [editId, setEditId] = useState(0);
  const [isDisplayEditor, setIsDisplayEditor] = useState(false);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const maxRecords = 3;
  const [totalPages, setTotalPages] = useState(0);

  const handleDel = (id) => {
    const item = transactions.find((i) => i.id === id);
    const price = Number(item.price);
    setBal((prev) => prev + price);

    editTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    setEditId(id);
    setIsDisplayEditor(true);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * maxRecords;
    const endIndex = Math.min(currentPage * maxRecords, transactions.length);

    setCurrentTransactions([...transactions].slice(startIndex, endIndex));
    setTotalPages(Math.ceil(transactions.length / maxRecords));
  }, [currentPage, transactions]);

  useEffect(() => {
    if (totalPages < currentPage && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [totalPages]);
 
  
  return (
    <div className={styles.transactionsWrapper}>
      {title && <h2>{title}</h2>}

      {transactions.length > 0 ? (
        <div className={styles.list}>
          <div>
            {currentTransactions.map((transaction) => (
              <TransactionCard
                details={transaction}
                key={transaction.id}
                handleDel={() => handleDel(transaction.id)}
                handleEdit={() => handleEdit(transaction.id)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              updatePage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className={styles.emptyTransactionsWrapper}>
          <p>No transactions!</p>
        </div>
      )}

      <Modal isOpen={isDisplayEditor} setIsOpen={setIsDisplayEditor}>
        <ExpenseForm
          editId={editId}
          expList={transactions}
          setExpList={editTransactions}
          setIsOpen={setIsDisplayEditor}
          bal={bal}
          setBal={setBal}
        />
      </Modal>
    </div>
  );
}
