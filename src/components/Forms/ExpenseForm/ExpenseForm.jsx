import styles from "./ExpenseForm.module.css";
import Button from "../../Button/Button.jsx";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

export default function ExpenseForm({
  setIsOpen,
  expList,
  setExpList,
  editId,
  setBal,
  bal,
}) {
  const initFormData = editId
    ? expList.find((item) => item.id === editId)
    : {
        title: "",
        category: "",
        price: "",
        date: "",
      };
  const [formData, setFormData] = useState(initFormData);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const name = e.target.name;
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (bal < Number(formData.price)) {
      enqueueSnackbar("Price should be less than the wallet balance", {
        variant: "warning",
      });
      setIsOpen(false);
      return;
    }

    setBal((prev) => prev - Number(formData.price));

    const lastId = expList.length > 0 ? expList[0].id : 0;
    setExpList((prev) => [{ ...formData, id: lastId + 1 }, ...prev]);

    setFormData({
      title: "",
      category: "",
      price: "",
      date: "",
    });

    setIsOpen(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    const updated = expList.map((item) => {
      if (item.id === editId) {
        const priceDifference = item.price - Number(formData.price);

        if (priceDifference < 0 && Math.abs(priceDifference) > bal) {
          enqueueSnackbar("Price should not exceed the wallet balance", {
            variant: "warning",
          });
          setIsOpen(false);
          return { ...item };
        }

        setBal((prev) => prev + priceDifference);
        return { ...formData, id: editId };
      } else {
        return item;
      }
    });

    setExpList(updated);

    setIsOpen(false);
  };


  return (
    <div className={styles.formWrapper}>
      <h3>{editId ? "Edit Expense" : "Add Expenses"}</h3>
      <form onSubmit={editId ? handleEdit : handleAdd}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="food">Food</option>
          <option value="entertainment">Entertainment</option>
          <option value="travel">Travel</option>
        </select>

        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <Button type="submit" style="primary" shadow>
          {editId ? "Edit Expense" : "Add Expense"}
        </Button>

        <Button style="secondary" shadow handleClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </form>
    </div>
  );
}
