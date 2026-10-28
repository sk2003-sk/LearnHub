import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";

import Courses from "../features/courses/Courses";
import Login from "../features/auth/Login";
import SignUp from "../features/auth/SignUp";
import ActivateAccount from "../features/auth/ActivateAccount";

import ProtectedRoute from "../components/ProtectedRoute";
import MainLoyout from "../layouts/MainLoyout";
import Dashboard from "../dashboard/Dashboard";
import Instructor from "../instructor/Instructor";
import Admin from "../admin/components/Admin";

import AdminDashBoard from "../admin/components/AdminDashBoard";
import Users from "../admin/components/Users";
import Instructors from "../admin/components/Instructors";
import Orders from "../admin/components/Orders";
import Enrollments from "../admin/components/Enrollments";
import Categories from "../admin/components/Categories";
import Coupons from "../admin/components/Coupons";
import Reviews from "../admin/components/Reviews";
import Notifications from "../admin/components/Notifications";
import Analytics from "../admin/components/Analytics";
import Layout from "../admin/components/Layout";
import System from "../admin/components/System";
import AdminCourses from "../admin/components/AdminCourses";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <MainLoyout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "activate",
        element: <ActivateAccount />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "instructor",
            element: <Instructor />,
          },
          {
            path: "admin",
            element: <Admin />,
            children: [
              {
                index: true,
                element: <AdminDashBoard />,
              },
              {
                path: "users",
                element: <Users />,
              },
              {
                path: "instructors",
                element: <Instructors />,
              },
              {
                path: "courses",
                element: <AdminCourses />,
              },
              {
                path: "orders",
                element: <Orders />,
              },
              {
                path: "enrollments",
                element: <Enrollments />,
              },
              {
                path: "categories",
                element: <Categories />,
              },
              {
                path: "coupons",
                element: <Coupons />,
              },
              {
                path: "reviews",
                element: <Reviews />,
              },
              {
                path: "notification",
                element: <Notifications />,
              },
              {
                path: "analytics",
                element: <Analytics />,
              },
              {
                path: "layout",
                element: <Layout />,
              },
              {
                path: "system",
                element: <System />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
