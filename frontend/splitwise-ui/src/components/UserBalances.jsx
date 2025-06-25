import React, { useState } from "react";
import axios from "axios";

export default function UserBalances() {
  const [userId, setUserId] = useState("");
  const [balances, setBalances] = useState([]);

  const fetchBalances = async () => {
    const res = await axios.get(`http://localhost:8000/users/${userId}/balances`);
    console.log(res.data);
    setBalances(res.data);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">User Balances</h2>
      <input type="number" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} className="border p-2 w-full mb-2" />
      <button onClick={fetchBalances} className="bg-green-500 text-white px-4 py-2 rounded">Fetch</button>
      <ul className="mt-4">
        {balances.map((b, i) => (
          <li key={i} className="py-1">User {b.user} owes User {b.owes} ₹{b.amount}</li>
        ))}
      </ul>
    </div>
  );
}