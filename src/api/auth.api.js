
import api from './axios.js'

export const registerUser = (data) =>
    api.post("/api/v1/auth/register", data);

export const activateUser = (data) =>
    api.post("/api/v1/auth/activate-user", data);

export const loginUser = (data) =>
    api.post("/api/v1/auth/login", data);

export const logoutUser = () =>
    api.get("/api/v1/auth/logout");

export const refreshToken = () =>
    api.get("/api/v1/auth/refreshtoken");

export const getCurrentUser = () =>
    api.get("/api/v1/auth/me");

export const getAllUsers = () =>
    api.get("/api/v1/auth/get-all-user-dashboard");

export const deleteUser = (id) =>
    api.delete(`/api/v1/auth/delete-user/${id}`);


export const getAllInstructors = () => {
    api.get("/api/v1/lms/admin/instructors")
}

export const getAllCourses = () => {
    api.get("/api/v1/course/get-all-course-dashboard")
}