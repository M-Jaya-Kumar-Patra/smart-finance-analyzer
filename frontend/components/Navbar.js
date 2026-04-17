"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="font-bold text-xl">💰 Finance App</h1>

      <div className="space-x-4">
        <button onClick={() => router.push("/dashboard")}>Dashboard</button>
        <button onClick={() => router.push("/add")}>Add</button>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>
    </div>
  );
}