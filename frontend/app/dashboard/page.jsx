"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import ExpenseChart from "@/components/ExpenseChart";
import { isLoggedIn } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    const summaryRes = await API.get("/transactions/summary");
    const txnRes = await API.get("/transactions");

    setData(summaryRes.data);
    setTransactions(txnRes.data);
  };

  useEffect(() => {
  if (!isLoggedIn()) {
    router.push("/login");
  }
}, []);

  useEffect(() => {
    fetchData();
  }, []);

  const getChartData = (transactions) => {
    const map = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  };

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">💰 Finance Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Income</p>
          <h2 className="text-xl font-bold text-green-600">₹{data.income}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Expense</p>
          <h2 className="text-xl font-bold text-red-600">₹{data.expense}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Balance</p>
          <h2 className="text-xl font-bold">₹{data.remainingBalance}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-2 border-blue-500">
          <p className="text-gray-500">Safe Daily Limit</p>
          <h2 className="text-xl font-bold text-blue-600">
            ₹{Math.round(data.safeDailyLimit)}
          </h2>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
        <ExpenseChart data={getChartData(transactions)} />
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

        {transactions.slice(0, 5).map((t) => (
          <div key={t._id} className="flex justify-between border-b py-2">
            <span>{t.category}</span>
            <span
              className={
                t.type === "expense" ? "text-red-500" : "text-green-500"
              }
            >
              ₹{t.amount}
            </span>
          </div>
        ))}
      </div>
      {/* Warning */}
      {data.warning && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
          ⚠️ {data.warning}
        </div>
      )}
    </div>
  );
}
