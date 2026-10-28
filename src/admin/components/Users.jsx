import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/auth.api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();

        console.log("Full API response:", response);
        console.log("API response data:", response.data);

        const result = response.data;

        if (Array.isArray(result.users)) {
          setUsers(result.users);
        } else {
          console.error("Users array not found:", result);
        }
      } catch (error) {
        console.error("Error message:", error.message);
        console.error("Status:", error.response?.status);
        console.error("Error response:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await deleteUser(id);

      console.log("Delete response:", response.data);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error message:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Error response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Failed to delete user. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="p-4">Loading users...</p>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold sm:text-3xl">Users</h1>

      <div className="mt-6 h-170 overflow-x-auto overflow-y-auto rounded-lg border border-dark-100 bg-dark-200 p-4">
        <table className="w-full text-left">
          <thead className="border-b border-b-dark-100 text-sm text-secondary">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="text-sm text-secondary">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-dark-100">
                  <td className="px-4 py-3">{user._id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={deletingId === user._id}
                      className="rounded-md border border-dark-100 px-4 py-2 hover:bg-dark-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === user._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
