"use client";
import React, { useState } from "react";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from "../context/AdminContext";

const Navbar = () => {
  const { user, googleSignIn, logOut } = useAuth();
  const { admin } = useAdminAuth();
  const [language, setLanguage] = useState('en');

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'vi' : 'en'));
  };

  const translations = {
    en: {
      home: 'Home',
      newEntry: 'New Entry',
      profile: 'Profile',
      report: 'Report',
      admin: 'Admin',
      logout: 'Logout',
      login: 'Login with Google',
    },
    vi: {
      home: 'Trang chủ',
      newEntry: 'Nhật ký mới',
      profile: 'Hồ sơ',
      report: 'Báo cáo',
      admin: 'Quản trị',
      logout: 'Đăng xuất',
      login: 'Đăng nhập với Google',
    },
  };

  const t = translations[language];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-7">
            <Link href="/" className="flex items-center py-4 px-2">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-auto" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                {t.home}
              </Link>
              {user && (
                <>
                  <Link href="/worklog" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    {t.newEntry}
                  </Link>
                  <Link href="/profile" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    {t.profile}
                  </Link>
                </>
              )}
              <Link href="/about" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                {t.report}
              </Link>
              {admin && (
                <Link href="/admin" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                  {t.admin}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={toggleLanguage} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300">
              {language === 'en' ? 'Tiếng Việt' : 'English'}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                <button onClick={handleSignOut} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300">
                  {t.logout}
                </button>
              </div>
            ) : (
              <button onClick={handleSignIn} className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded transition duration-300">
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;