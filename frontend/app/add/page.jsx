"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";


export default function AddTransaction() {
    const router = useRouter();


  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: ""
  });

    useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, []);
  

  const handleSubmit = async () => {
  await API.post("/transactions", form);
  router.push("/dashboard");
};

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>

        <select
          className="w-full mb-3 p-2 border rounded"
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Amount"
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Category"
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Note"
          onChange={e => setForm({ ...form, note: e.target.value })}
        />

        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Add
        </button>
      </div>
    </div>
  );
}