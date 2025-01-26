
// import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";
// import { formatDate } from "../utils/date";
// import { useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate(); // React Router navigation hook

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
//     >
//       <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
//         Dashboard
//       </h2>

//       <div className="space-y-6">
//         <motion.div
//           className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h3 className="text-xl font-semibold text-green-400 mb-3">
//             Profile Information
//           </h3>
//           <p className="text-gray-300">Name: {user.name}</p>
//           <p className="text-gray-300">Email: {user.email}</p>
//         </motion.div>
//         <motion.div
//           className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <h3 className="text-xl font-semibold text-green-400 mb-3">
//             Account Activity
//           </h3>
//           <p className="text-gray-300">
//             <span className="font-bold">Joined: </span>
//             {new Date(user.createdAt).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//           <p className="text-gray-300">
//             <span className="font-bold">Last login: </span>
//             {formatDate(user.lastLogin)}
//           </p>
//         </motion.div>
//       </div>

//       {/* Navigation Buttons */}
//       <motion.div
//         className="mt-6 space-y-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//       >
//         <button
//           onClick={() => navigate("/face-recognition")}
//           className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
//         >
//           Go to Face Recognition
//         </button>
//         <button
//           onClick={() => navigate("/live-face-capture")}
//           className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
//         >
//           Go to Live Face Capture
//         </button>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.8 }}
//         className="mt-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleLogout}
//           className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
//           font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
//           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
//         >
//           Logout
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default DashboardPage;





















import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore"; // Assuming `updateUser` updates user state
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For API requests

const DashboardPage = () => {
  const { user, setUser, logout } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(user.profileImage || null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("userId", user._id); // Send user ID with the image upload request

      try {
        // Upload the image to the backend
        const response = await axios.post("/api/upload-profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const imageUrl = response.data.imageUrl;
        setSelectedImage(imageUrl); // Update image preview
        setUser({ ...user, profileImage: imageUrl }); // Update user state with new image URL
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-100">
      <div className="max-w-7xl mx-auto flex h-screen rounded-3xl overflow-hidden shadow-xl">
        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-1900 rounded-l-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-3xl font-bold text-emerald-500 mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-gray-300">
              Manage your account, track activities, and explore features.
            </p>
          </motion.div>
        </main>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/3 bg-gray-800 flex flex-col items-center p-6 rounded-r-3xl"
        >
          {/* Profile Section */}
          <div className="bg-gray-700 p-6 rounded-full shadow-lg mb-6 relative">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="User Profile"
                className="w-24 h-24 rounded-full shadow-md border-4 border-emerald-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-gray-200 text-sm">
                Upload Image
              </div>
            )}

            {/* Upload Button */}
            <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2">
              <label
                htmlFor="profile-upload"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 cursor-pointer shadow-lg"
              >
                📷
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">{user.name || "User Name"}</h2>
          <p className="text-sm text-gray-400 mb-4">{user.email}</p>

          {/* Navigation Links */}
          <nav className="flex flex-col w-full">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-2 px-4 my-1 bg-emerald-600 rounded-lg shadow hover:bg-emerald-700"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-2 px-4 my-1 bg-emerald-600 rounded-lg shadow hover:bg-emerald-700"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 my-1 bg-red-500 rounded-lg shadow hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        </motion.aside>
      </div>
    </div>
  );
};

export default DashboardPage;
