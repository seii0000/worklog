// app/components/Navbar.jsx
"use client";
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();

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

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-7">
            <Link href="/" className="flex items-center py-4 px-2">
              <span className="font-semibold text-gray-500 text-lg">WorkLog</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                Home
              </Link>
              {user && (
                <>
                  <Link href="/worklog" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    New Entry
                  </Link>
                  <Link href="/profile" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    Profile
                  </Link>
                </>
              )}
              <Link href="/about" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                <button onClick={handleSignOut} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={handleSignIn} className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded transition duration-300">
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;