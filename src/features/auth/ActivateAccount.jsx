import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ActivateAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  const activationToken =
    location.state?.activation_token ||
    sessionStorage.getItem("activation_token");

  const [email, setEmail] = useState(
    location.state?.email || sessionStorage.getItem("activation_email") || "",
  );

  const [code, setCode] = useState(
    location.state?.activation_code ||
      sessionStorage.getItem("activation_code") ||
      "",
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mailSent = location.state?.mailSent;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!activationToken) {
      setError("Activation token is missing. Please register again.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the 6-digit activation code.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/v1/auth/activate-user", {
        activation_token: activationToken,
        activation_code: code,
      });

      if (response.data?.success === false) {
        setError(response.data.message || "Activation failed.");
        return;
      }

      sessionStorage.removeItem("activation_token");
      sessionStorage.removeItem("activation_code");
      sessionStorage.removeItem("activation_email");

      navigate("/login", {
        replace: true,
        state: {
          email,
          message:
            response.data?.message ||
            "Account activated successfully. Please log in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Activation failed. Check your code and try again.",
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
        <h1 className="text-3xl font-bold">Activate Account</h1>
        <p className="text-sm text-secondary">
          Enter the six-digit activation code.
        </p>
      </div>

      {mailSent === false && (
        <p className="max-w-md px-4 text-center text-sm text-secondary">
          The activation email could not be sent. For this test, the code
          returned by the API has been filled in below.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid w-full max-w-md grid-cols-1 gap-4 px-4"
      >
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          autoComplete="email"
          className="h-12 w-full rounded-lg border border-dark-100 bg-dark-200 px-3 text-white outline-none"
          required
        />

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit activation code"
          maxLength={6}
          className="h-12 w-full rounded-lg border border-dark-100 bg-dark-200 px-3 text-white outline-none"
          required
        />

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="h-12 rounded-lg bg-primary font-semibold transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Activating..." : "Activate Account"}
        </button>

        <p className="text-center text-sm text-secondary">
          Already activated?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
