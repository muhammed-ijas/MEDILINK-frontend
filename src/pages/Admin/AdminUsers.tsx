import  { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../../api/admin";
import ConfirmationModal from "../../Components/admin/BlockConfirmationModal";
import { toast, Toaster } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  fromGoogle: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isBlocking, setIsBlocking] = useState<boolean>(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(Array.isArray(data.users) ? data.users : []);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  // Handle Block User
  const handleBlockUser = async (id: string) => {
    try {
      await blockUser(id); // Call blockUser API
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isBlocked: true } : user
        )
      );
      toast.success("Successfully changed the block status");

      // Delay closing the modal for 1 second
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to change the block status");
    }
  };

  // Handle Unblock User
  const handleUnblockUser = async (id: string) => {
    try {
      await unblockUser(id); // Call unblockUser API
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isBlocked: false } : user
        )
      );
      toast.success("Successfully changed the unblock status");

      // Delay closing the modal for 1 second
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to change the unblock status");
    }
  };

  // Open Modal with User Info
  const openConfirmationModal = (user: User, block: boolean) => {
    setSelectedUser(user);
    setIsBlocking(block);
    setShowModal(true);
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-black text-white">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {users.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white">No users found</p>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-black border border-gray-300 text-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-black text-left">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">from Google</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="border-t border-gray-200">
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.phone || "N/A"}</td>
                  <td className="py-3 px-6">
                    {user.fromGoogle ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() =>
                        openConfirmationModal(user, !user.isBlocked)
                      }
                      className={`${
                        user.isBlocked
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      } py-2 px-4 rounded hover:bg-opacity-80`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <nav>
              <ul className="inline-flex items-center space-x-2">
                {Array.from(
                  { length: Math.ceil(users.length / usersPerPage) },
                  (_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500 border border-blue-500"
                        } font-bold py-2 px-4 rounded`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showModal && selectedUser && (
        <ConfirmationModal
          isOpen={showModal}
          title={isBlocking ? "Block User" : "Unblock User"}
          message={`Are you sure you want to ${
            isBlocking ? "block" : "unblock"
          } ${selectedUser.name}?`}
          onConfirm={() =>
            isBlocking
              ? handleBlockUser(selectedUser._id)
              : handleUnblockUser(selectedUser._id)
          }
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
