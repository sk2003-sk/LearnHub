import { useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/api/v1/auth/login", {
        email: email.trim(),
        password,
      });

      const result = response.data;

      if (result.success === false) {
        setError(result.message || "Login failed.");
        return;
      }

      const token =
        result.access_token ??
        result.accessToken ??
        result.data?.access_token ??
        result.data?.accessToken ??
        result.data?.token;

      const user = result.user ?? result.data?.user ?? result.data?.data?.user;

      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("auth_user");

      if (token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("access_token", token);
      }

      if (user) {
        sessionStorage.setItem("auth_user", JSON.stringify(user));
      }

      login();

      const redirectTo = location.state?.from || "/dashboard";

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-8 text-white">
      <div className="flex items-center gap-3">
        <b className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-xl">
          H
        </b>

        <p className="text-xl font-bold">LearnHub</p>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-3xl font-bold">Welcome Back</p>

        <p className="text-sm text-secondary">Sign in to continue learning</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid w-full max-w-md grid-cols-1 gap-4 px-4"
      >
        <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-dark-100 bg-dark-200 px-3">
          <HiOutlineMail className="h-6 w-6 shrink-0 text-secondary" />

          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent text-base text-white outline-none"
            required
          />
        </div>

        <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-dark-100 bg-dark-200 px-3">
          <BiLockAlt className="h-6 w-6 shrink-0 text-secondary" />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-transparent text-base text-white outline-none"
            required
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 cursor-pointer accent-primary"
            />
            Remember me
          </label>
        </div>

        {message && (
          <p role="status" className="text-sm text-green-400">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-lg bg-primary text-base font-semibold transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-secondary">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
