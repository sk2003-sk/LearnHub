import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <div className="border-t p-10 text-sm border-t-dark-100 flex w-full max-w-7xl mx-auto text-secondary items-center justify-between">
      <div>
        <h1 className="font-bold text-xl">LearnHub</h1>
        <p>Learn at your peace. Finish with a certificate.</p>
      </div>
      <div className="flex gap-3">
        <NavLink end className="hover:text-white">
          Explore
        </NavLink>
        <NavLink to="/login" className="hover:text-white">
          Login
        </NavLink>
      </div>
    </div>
  );
}
