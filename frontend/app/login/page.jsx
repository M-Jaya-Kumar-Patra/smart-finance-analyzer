"use client";

import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    router.push("/dashboard");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Login</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}