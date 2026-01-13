import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-navy-deep dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
      {/* 1. The Header is here permanently */}
      <Header />
      
      {/* 2. Where different pages will load automatically */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 3. Permanent Footer can go here */}
    </div>
  );
}