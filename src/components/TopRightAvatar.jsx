import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  CogIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BellIcon
} from "@heroicons/react/24/solid";

const TopRightAvatar = ({ theme, toggleTheme }) => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate a stable avatar URL based on user email
  const generateAvatarUrl = (email) => {
    const styles = [
      "lorelei",
      "adventurer",
      "avataaars",
      "personas",
      "micah"
    ];
    const styleIndex = Math.abs(email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % styles.length;
    const randomStyle = styles[styleIndex];
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(
      email
    )}&backgroundColor=6366f1,a5b4fc`;
  };

  // Fetch notifications from API
  const fetchNotifications = async (userId) => {
    try {
      const response = await fetch(`/api/reminders/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const allNotifications = [
          ...data.dsaReminders.map(item => ({
            type: 'DSA',
            title: item.questionId?.title || 'DSA Question',
            date: item.remindOn,
            id: item._id
          })),
          ...data.coreReminders.map(item => ({
            type: 'Core',
            title: item.coreTopicId?.title || 'Core Topic',
            date: item.remindOn,
            id: item._id
          })),
          ...data.theoryReminders.map(item => ({
            type: 'Theory',
            title: item.topicId?.title || 'Theory Topic',
            date: item.remindOn,
            id: item._id
          }))
        ];
        setNotifications(allNotifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Check for user on mount and when localStorage changes
  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (parsedUser?.email && !localStorage.getItem('avatarUrl')) {
            const url = generateAvatarUrl(parsedUser.email);
            setAvatarUrl(url);
            localStorage.setItem('avatarUrl', url);
          }
          // Fetch notifications when user is available
          if (parsedUser._id) {
            fetchNotifications(parsedUser._id);
          }
        } else {
          setUser(null);
          localStorage.removeItem('avatarUrl');
          setNotifications([]);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        setUser(null);
      }
    };

    checkUser();

    const storedAvatar = localStorage.getItem('avatarUrl');
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'avatarUrl') checkUser();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('avatarUrl');
    window.location.href = '/login';
  };

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  const handleSettingsClick = () => {
    window.location.href = '/settings';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center justify-end mb-6 gap-3">
      {/* Dark/Light Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:shadow transition-all duration-200"
        title="Toggle Theme"
      >
        {theme === "light" ? (
          <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <SunIcon className="h-5 w-5 text-yellow-400" />
        )}
      </button>

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:shadow transition-all duration-200 relative"
          title="Notifications"
        >
          <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Notifications</h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {notifications.length} new
                </span>
              </div>
            </div>

            {notifications.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                            {notification.type}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {formatDate(notification.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications available
                </p>
              </div>
            )}

            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/30 text-center border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  window.location.href = '/reminders';
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all reminders
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar Dropdown */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow hover:shadow-md border border-gray-200 dark:border-gray-600 focus:outline-none transition-all duration-200">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              className="w-8 h-8 rounded-full border-2 border-indigo-400 dark:border-indigo-300" 
              alt="avatar" 
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
          )}
          <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
        </Menu.Button>

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 dark:border-gray-600 overflow-hidden">
            {/* Profile Header */}
            {user ? (
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <img 
                    src={avatarUrl} 
                    className="w-12 h-12 rounded-full border-2 border-white" 
                    alt="avatar" 
                  />
                  <div>
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-xs opacity-90 truncate">{user?.email}</p>
                    <p className="text-xs mt-1 flex items-center gap-1">
                      <AcademicCapIcon className="w-3 h-3" />
                      Student Account
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center border-2 border-white">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Guest User</p>
                    <p className="text-xs opacity-90">Not logged in</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items - Only show when logged in */}
            {user ? (
              <>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleProfileClick}
                        className={`${
                          active ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                        } group flex items-center w-full px-4 py-3 text-sm transition-colors duration-150`}
                      >
                        <UserIcon className="w-5 h-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                        My Profile
                      </button>
                    )}
                  </Menu.Item>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSettingsClick}
                        className={`${
                          active ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                        } group flex items-center w-full px-4 py-3 text-sm transition-colors duration-150`}
                      >
                        <CogIcon className="w-5 h-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                        Account Settings
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="py-1 bg-gray-50 dark:bg-gray-700/30">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"
                        } group flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-150`}
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </>
            ) : (
              <div className="py-1 bg-gray-50 dark:bg-gray-700/30">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => window.location.href = '/login'}
                      className={`${
                        active ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "text-indigo-500 dark:text-indigo-400"
                      } group flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-150`}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 rotate-180" />
                      Login
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default TopRightAvatar;