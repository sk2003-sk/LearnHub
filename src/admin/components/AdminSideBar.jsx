import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiBookOpen,
  FiShoppingBag,
  FiAward,
  FiTag,
  FiStar,
  FiBell,
  FiBarChart2,
  FiLayout,
  FiShield,
} from "react-icons/fi";

const links = [
  { label: "Dashboard", to: "/admin", icon: FiGrid, end: true },
  { label: "Users", to: "/admin/users", icon: FiUsers },
  { label: "Instructors", to: "/admin/instructors", icon: FiUserCheck },
  { label: "Courses", to: "/admin/courses", icon: FiBookOpen },
  { label: "Orders", to: "/admin/orders", icon: FiShoppingBag },
  { label: "Enrollments", to: "/admin/enrollments", icon: FiAward },
  { label: "Categories", to: "/admin/categories", icon: FiTag },
  { label: "Coupons", to: "/admin/coupons", icon: FiTag },
  { label: "Reviews", to: "/admin/reviews", icon: FiStar },
  { label: "Notifications", to: "/admin/notification", icon: FiBell },
  { label: "Analytics", to: "/admin/analytics", icon: FiBarChart2 },
  { label: "Layout", to: "/admin/layout", icon: FiLayout },
  { label: "System", to: "/admin/system", icon: FiShield },
];

export default function AdminSideBar() {
  function navLinkActive({ isActive }) {
    return `flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors duration-200 ${
      isActive
        ? "bg-primary text-white"
        : "text-secondary hover:bg-dark-100 hover:text-white"
    }`;
  }

  return (
    <nav className="flex flex-col gap-1.5">
      {links.map(({ label, to, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={navLinkActive}>
          <Icon size={18} className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
