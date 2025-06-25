import React, { useState } from "react";
import axios from "axios";

export default function ExpenseForm() {
  const [form, setForm] = useState({
    group_id: "",
    description: "",
    amount: 0,
    paid_by: 0,
    split_type: "equal",
    splits: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const splitArray = form.splits.split(",").map((entry) => {
      const [user_id, val] = entry.split(":");
      return form.split_type === "equal"
        ? { user_id: parseInt(user_id) }
        : { user_id: parseInt(user_id), percentage: parseFloat(val) };
    });
    await axios.post(`http://localhost:8000/groups/${form.group_id}/expenses`, {
      description: form.description,
      amount: parseFloat(form.amount),
      paid_by: parseInt(form.paid_by),
      split_type: form.split_type,
      splits: splitArray
    });
    alert("Expense added");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">Add Expense</h2>
      <input type="number" placeholder="Group ID" onChange={e => setForm({ ...form, group_id: e.target.value })} className="border p-2 w-full" required />
      <input type="text" placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 w-full" required />
      <input type="number" placeholder="Amount" onChange={e => setForm({ ...form, amount: e.target.value })} className="border p-2 w-full" required />
      <input type="number" placeholder="Paid by User ID" onChange={e => setForm({ ...form, paid_by: e.target.value })} className="border p-2 w-full" required />
      <select onChange={e => setForm({ ...form, split_type: e.target.value })} className="border p-2 w-full">
        <option value="equal">Equal</option>
        <option value="percentage">Percentage</option>
      </select>
      <input type="text" placeholder="Splits (user_id[:percentage],...)" onChange={e => setForm({ ...form, splits: e.target.value })} className="border p-2 w-full" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Expense</button>
    </form>
  );
}