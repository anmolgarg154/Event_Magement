import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Info, Lock, LogOut, Mail, Phone, MapPin, Edit3 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('information');
  const { user, setUser, loading } = useAuthContext();
  const navigate = useNavigate();

  async function doLogout() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + `user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser(null)
        toast.success("Logout Successful");
      } else {
        toast.warn("Logout Failed");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
    navigate("/");
  }

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'information', label: 'Information', icon: Info },
    // { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white shadow-sm border border-gray-300 shadow-primary2/40 hover:shadow-md p-12">
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-darkprimary flex items-center justify-center text-6xl font-bold text-white shadow-lg mx-auto mb-4">
                {user.username?.charAt(0).toUpperCase() || "-"}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.username || "-"}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-medium mt-2 ${user.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
                }`}>
                <div className={`w-2 h-2 mr-2 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                {user.status === 'active' ? 'Active' : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="text-sm lg:text-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Member Since</h3>
                <p className=" font-semibold text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        );

      case 'information':
        return (
          <div className="bg-white shadow-sm border border-gray-300 shadow-primary2/40 hover:shadow-md p-4 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                  <User className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.username || "-"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                  <Mail className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-sm lg:text-lg font-semibold text-gray-800">{user.email || "-"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                  <Phone className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-lg font-semibold text-gray-800">{user.phone || "-"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                  <MapPin className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-lg font-semibold text-gray-800">{user.address || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
              <div className="bg-gray-50 p-4">
                <p className="text-gray-600 leading-relaxed">
                  {user.bio || 'Hi there, this is my bio...'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Status</p>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium ${user.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                  }`}>
                  <div className={`w-2 h-2 mr-2 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="bg-white shadow-sm border border-gray-300 shadow-primary2/40 hover:shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
            <div className="max-w-md space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="bg-primary/30 border border-darkprimary p-4">
                <h4 className="font-medium text-darkprimary mb-2">Password Requirements:</h4>
                <ul className="text-sm text-primary space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>

              <button className="w-full bg-darkprimary hover:bg-primary text-white font-semibold py-3 px-8 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        );

      case 'logout':
        return (
          <div className="bg-white shadow-sm border border-gray-300 shadow-primary2/40 hover:shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Logout Confirmation</h2>
            <p className="text-gray-600 mb-8">Are you sure you want to logout from your account?</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setActiveTab('profile')}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={doLogout} className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white shadow-sm border border-gray-300 shadow-primary2/40 hover:shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
            <p className="text-gray-600">Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-500 font-medium">
          <p className="text-xl mb-4">User not logged in</p>
          <button onClick={() => navigate("/login")} className="bg-primary text-white px-6 py-2 hover:bg-darkprimary transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-full h-auto p-8 py-20 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex-1 lg:flex">
          <div className="w-80 bg-white h-auto">
            <div className="p-6 shadow-sm border border-gray-300 shadow-primary2/40 hover:shadow-md">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center space-x-3 p-4 text-left transition-all duration-200 ${isActive
                        ? 'bg-primary/30 text-darkprimary border-l-4 border-darkprimary'
                        : 'text-gray-600 hover:bg-darkprimary/60 hover:text-gray-800'
                        }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 pt-4 lg:px-8">
            <div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;