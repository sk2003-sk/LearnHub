import { useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import { CiUser } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/v1/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const result = response.data;

      const token =
        result.activationToken ??
        result.data?.activationToken ??
        result.activation_token ??
        result.data?.activation_token;

      const activationCode =
        result.activationCode ??
        result.data?.activationCode ??
        result.activation_code ??
        result.data?.activation_code;

      if (!result.success || !token || !activationCode) {
        setError(
          result.message ||
            "Registration succeeded, but activation details are missing.",
        );
        return;
      }

      sessionStorage.setItem("activation_token", token);
      sessionStorage.setItem("activation_code", String(activationCode));
      sessionStorage.setItem("activation_email", form.email.trim());

      navigate("/activate", {
        state: {
          email: form.email.trim(),
          activation_token: token,
          activation_code: String(activationCode),
          mailSent: result.mailSent,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again.",
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
        <p className="text-3xl font-bold">Create Your Account</p>
        <p className="text-sm text-secondary">
          Join thousands of learners today
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid w-full max-w-2xl grid-cols-1 gap-4 px-4 sm:grid-cols-2"
      >
        <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-dark-100 bg-dark-200 px-3">
          <CiUser className="h-5 w-5 shrink-0 text-secondary" />
          <input
            name="name"
            type="text"
            placeholder="Full name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-transparent text-base text-white outline-none"
            required
          />
        </div>

        <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-dark-100 bg-dark-200 px-3">
          <HiOutlineMail className="h-6 w-6 shrink-0 text-secondary" />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent text-base text-white outline-none"
            required
          />
        </div>

        <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-dark-100 bg-dark-200 px-3">
          <BiLockAlt className="h-5 w-5 shrink-0 text-secondary" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-transparent text-base text-white outline-none"
            required
          />
        </div>

        <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-dark-100 bg-dark-200 px-3">
          <BiLockAlt className="h-5 w-5 shrink-0 text-secondary" />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full bg-transparent text-base text-white outline-none"
            required
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(event) => setTerms(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          <label
            htmlFor="terms"
            className="cursor-pointer text-sm text-secondary"
          >
            I agree to Terms & Conditions
          </label>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400 sm:col-span-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-lg bg-primary font-semibold transition hover:opacity-90 disabled:opacity-60 sm:col-span-2"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-secondary sm:col-span-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
