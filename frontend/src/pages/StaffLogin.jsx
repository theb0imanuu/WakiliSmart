import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../assets/login.webp';
import logoImg from '../assets/logo.svg';
import api from '../utils/api';

const StaffLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username: email, password });
      const { access_token, role, username } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">

      {/* Left Side: Visual / Brand (Visible on Desktop) */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-primary/5 relative flex-col justify-between p-12 border-r border-gray-200 dark:border-gray-800">

        {/* Brand Logo Top Left */}
        <Link to="/" className="flex items-center gap-2">
        <img src={logoImg} alt="WakiliSmart" className="h-10 w-auto" />
        <h2 className="text-navy-deep dark:text-white text-xl font-bold font-serif tracking-tight">WakiliSmart</h2>
        </Link>

        {/* Illustration/Image Area */}
        <div className="flex-1 flex items-center justify-center my-8">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10"></div>
            {/* Using your login.webp image here */}
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${loginImg})` }}
            ></div>
            <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
              <p className="text-lg font-medium leading-relaxed">"Efficient legal practice management for the modern solo practitioner."</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <span>© 2026 WakiliSmart</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col relative bg-background-light dark:bg-background-dark overflow-y-auto">

        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <div className="size-6">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
              </svg>
            </div>
            <span className="font-bold text-lg text-navy-deep dark:text-white font-serif">WakiliSmart</span>
          </Link>
        </div>

        {/* Top Right Action */}
        <div className="absolute top-6 right-6 hidden md:block">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">public</span>
            Public Portal
          </Link>
        </div>

        {/* Form Content Wrapper */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24">
          <div className="w-full max-w-[420px] flex flex-col gap-8">

            {/* Page Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="text-navy-deep dark:text-white tracking-tight text-[32px] font-bold leading-tight font-serif">Staff Access</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Please enter your credentials to access the ERP securely.
              </p>
            </div>

            {/* Login Form */}
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-navy-deep dark:text-white text-sm font-medium leading-normal" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-navy-deep dark:text-white h-12 px-4 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
                    id="email"
                    placeholder="name@wakilismart.com"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-navy-deep dark:text-white text-sm font-medium leading-normal" htmlFor="password">Password</label>
                  <a className="text-primary text-sm font-medium hover:underline cursor-pointer">Forgot Password?</a>
                </div>
                <div className="relative flex items-center">
                  <input
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-navy-deep dark:text-white h-12 pl-4 pr-12 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-0 top-0 bottom-0 px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Secure Login Button */}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary hover:bg-blue-700 text-white h-12 px-6 text-sm font-bold leading-normal tracking-wide shadow-md transition-all mt-2 group cursor-pointer">
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">lock</span>
                Secure Login
              </button>
            </form>

            {/* Bottom helper for mobile */}
            <div className="md:hidden mt-4 text-center">
              <Link to="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Return to Public Portal
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
              <span className="material-symbols-outlined text-green-600 text-[20px]">verified_user</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Connection is 256-bit SSL Encrypted</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
