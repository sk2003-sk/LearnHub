import AdminSideBar from "./AdminSideBar";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <div className=" grid grid-cols-12 mx-auto gap-5  w-full  max-w-7xl   px-4 sm:px-6 lg:px-8 ">
        <div className="grid col-span-3 w-xsm bg-dark-200 p-10 rounded-lg shadow-md">
          <AdminSideBar></AdminSideBar>
        </div>
        <div className="grid col-span-9">
          <Outlet />
        </div>
      </div>
    </>
  );
}
