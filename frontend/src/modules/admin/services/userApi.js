import axiosInstance from '../../../services/axiosInstance';

// --- MOCK DATA FOR TESTING (Remove this array when connecting to real backend) ---
const MOCK_USERS = [
  { id: 1, name: "Rohan Das", email: "rohan@gmail.com", role: "Worker", status: "Active" },
  { id: 2, name: "BuildCorp", email: "contact@buildcorp.com", role: "Organization", status: "Active" },
  { id: 3, name: "Amit Verma", email: "amit@yahoo.com", role: "Client", status: "Blocked" },
  { id: 4, name: "Suresh R", email: "suresh@sup.com", role: "Supervisor", status: "Active" },
];

export const fetchAllUsers = async () => {
  // Temporary: Return mock data so you can see the table immediately
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USERS), 300);
  });
};

export const updateUserStatus = async (userId, status) => {
  console.log(`API: Updating user ${userId} status to ${status}`);
  return { success: true };
};

export const updateUserRole = async (userId, role) => {
  console.log(`API: Updating user ${userId} role to ${role}`);
  return { success: true };
};