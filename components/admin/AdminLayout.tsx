import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
       <Header />
        <div className="flex flex-col lg:flex-row flex-1 container mx-auto px-6 py-8 gap-8">
            <Sidebar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
        <Footer />
    </div>
  );
};

export default AdminLayout;