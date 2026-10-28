import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "../footer/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-dark text-white w-full   mx-auto">
      <NavBar />

      <main className="flex flex-1 flex-col  bg-dark p-4 text-white sm:p-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
