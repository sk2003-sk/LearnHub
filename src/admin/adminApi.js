
import api from "../api/axios.js";

export const getAdminUsers = () =>
    api.get("/api/v1/auth/get-all-user-dashboard");

export const getAdminInstructors = () =>
    api.get("/api/v1/lms/admin/instructors");

export const getAdminCourses = () =>
    api.get("/api/v1/lms/admin/courses");

export const getAdminAnalytics = () =>
    api.get("/api/v1/lms/admin/analytics");

export const getUserAnalytics = () =>
    api.get("/api/v1/analytics/get-users-analytics");

export const getAdminOrders = () =>
    api.get("/api/v1/lms/admin/orders");

export const getAdminEnrollments = () =>
    api.get("/api/v1/lms/admin/enrollments");

export const getAdminNotifications = () =>
    api.get("/api/v1/notifications/get-all-notification");
