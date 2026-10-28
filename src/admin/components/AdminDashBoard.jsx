import { useEffect, useState } from "react";
import { FiUsers, FiUserCheck, FiBookOpen, FiTrendingUp } from "react-icons/fi";
import api from "../../api/axios";

const initialStats = [
  { title: "Total Users", value: "—", icon: FiUsers },
  { title: "Instructors", value: "—", icon: FiUserCheck },
  { title: "Courses", value: "—", icon: FiBookOpen },
  { title: "Total Revenue", value: "—", icon: FiTrendingUp },
];

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? {};
}

function getArray(data, keys) {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
}

function getTotal(data, arrayKeys, totalKeys) {
  for (const key of totalKeys) {
    if (data?.[key] != null && Number.isFinite(Number(data[key]))) {
      return Number(data[key]);
    }
  }

  return getArray(data, arrayKeys).length;
}

export default function AdminDashBoard() {
  const [stats, setStats] = useState(initialStats);
  const [growth, setGrowth] = useState([]);
  const [period, setPeriod] = useState("6");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchDashboard() {
      setLoading(true);
      setError("");

      const endpoints = [
        "/api/v1/auth/get-all-user-dashboard",
        "/api/v1/lms/admin/instructors",
        "/api/v1/lms/admin/courses",
        "/api/v1/lms/admin/analytics",
        "/api/v1/analytics/get-users-analytics",
      ];

      const results = await Promise.allSettled(
        endpoints.map((endpoint) => api.get(endpoint)),
      );

      if (!active) return;

      const read = (index) =>
        results[index].status === "fulfilled"
          ? unwrap(results[index].value)
          : null;

      const users = read(0);
      const instructors = read(1);
      const courses = read(2);
      const analytics = read(3);
      const userAnalytics = read(4);

      const totalUsers = users
        ? getTotal(users, ["users", "allUsers"], ["totalUsers", "total"])
        : null;

      const totalInstructors = instructors
        ? getTotal(
            instructors,
            ["instructors", "users"],
            ["totalInstructors", "total"],
          )
        : null;

      const totalCourses = courses
        ? getTotal(
            courses,
            ["courses", "allCourses"],
            ["totalCourses", "total"],
          )
        : null;

      const revenue = analytics
        ? (analytics.totalRevenue ??
          analytics.total_revenue ??
          analytics.totalSales ??
          analytics.revenue ??
          null)
        : null;

      const formatNumber = (value) =>
        value == null ? "—" : Number(value).toLocaleString("en-IN");

      const formatCurrency = (value) =>
        value == null
          ? "—"
          : new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(Number(value));

      setStats([
        {
          title: "Total Users",
          value: formatNumber(totalUsers),
          icon: FiUsers,
        },
        {
          title: "Instructors",
          value: formatNumber(totalInstructors),
          icon: FiUserCheck,
        },
        {
          title: "Courses",
          value: formatNumber(totalCourses),
          icon: FiBookOpen,
        },
        {
          title: "Total Revenue",
          value: formatCurrency(revenue),
          icon: FiTrendingUp,
        },
      ]);

      const growthItems = getArray(userAnalytics, [
        "months",
        "analytics",
        "userAnalytics",
        "users",
      ]);

      setGrowth(
        growthItems.map((item) => ({
          month: item.month ?? item.name ?? item.label ?? "",
          value: Number(
            item.count ?? item.users ?? item.value ?? item.total ?? 0,
          ),
        })),
      );

      if (results.every((result) => result.status === "rejected")) {
        setError("Unable to load dashboard data. Check your admin access.");
      } else if (results.some((result) => result.status === "rejected")) {
        setError("Some dashboard information could not be loaded.");
      }

      setLoading(false);
    }

    fetchDashboard();

    return () => {
      active = false;
    };
  }, []);

  const visibleGrowth = growth.slice(-Number(period));
  const maxValue = Math.max(1, ...visibleGrowth.map((item) => item.value));

  const chartPoints = visibleGrowth
    .map((item, index) => {
      const x =
        visibleGrowth.length === 1
          ? 500
          : 50 + (index / (visibleGrowth.length - 1)) * 900;

      const y = 260 - (item.value / maxValue) * 220;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="flex min-w-0 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-secondary">
          Overview of your LearnHub platform
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <article
            key={title}
            className="min-h-32 rounded-lg border border-dark-100 bg-dark-200 p-5 transition-colors hover:border-primary/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-secondary">{title}</p>
                <p className="mt-4 wrap-break-words text-2xl font-bold sm:text-3xl">
                  {loading ? "..." : value}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="text-primary" size={22} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="min-w-0 rounded-lg border border-dark-100 bg-dark-200 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">User Growth</h2>
            <p className="mt-1 text-sm text-secondary">
              Monthly registration analytics
            </p>
          </div>

          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-md border border-dark-100 bg-dark px-3 py-2 text-sm text-white outline-none focus:border-primary"
          >
            <option value="3">Last 3 months</option>
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
          </select>
        </div>

        {loading ? (
          <p className="py-12 text-center text-secondary">
            Loading analytics...
          </p>
        ) : visibleGrowth.length === 0 ? (
          <p className="py-12 text-center text-secondary">
            No user-growth data returned by the API.
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 1000 330"
              className="min-w-125 w-full"
              role="img"
              aria-label="Monthly user growth chart"
            >
              {[0, 1, 2, 3, 4].map((index) => {
                const y = 40 + index * 55;
                const value = Math.round((maxValue * (4 - index)) / 4);

                return (
                  <g key={index}>
                    <line x1="50" y1={y} x2="950" y2={y} stroke="#262626" />
                    <text
                      x="38"
                      y={y + 5}
                      fill="#9ca3af"
                      fontSize="14"
                      textAnchor="end"
                    >
                      {value.toLocaleString("en-IN")}
                    </text>
                  </g>
                );
              })}

              {visibleGrowth.length > 1 && (
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="#e50914"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}

              {visibleGrowth.map((item, index) => {
                const x =
                  visibleGrowth.length === 1
                    ? 500
                    : 50 + (index / (visibleGrowth.length - 1)) * 900;

                const y = 260 - (item.value / maxValue) * 220;

                return (
                  <g key={`${item.month}-${index}`}>
                    <circle cx={x} cy={y} r="5" fill="#e50914" />
                    <text
                      x={x}
                      y="300"
                      fill="#9ca3af"
                      fontSize="14"
                      textAnchor="middle"
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </section>
    </section>
  );
}
