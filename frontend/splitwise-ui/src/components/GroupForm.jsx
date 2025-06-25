import React, { useState } from "react";
import axios from "axios";

export default function GroupForm() {
  const [name, setName] = useState("");
  const [userIds, setUserIds] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ids = userIds.split(",").map(id => parseInt(id.trim()));
    await axios.post("http://localhost:8000/groups", { name, user_ids: ids });
    alert("Group created");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">Create Group</h2>
      <input type="text" placeholder="Group Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full" required />
      <input type="text" placeholder="User IDs (comma separated)" value={userIds} onChange={e => setUserIds(e.target.value)} className="border p-2 w-full" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}