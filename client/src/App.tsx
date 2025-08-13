import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FormIzin from './components/FormIzin';
import DaftarIzin from './components/DaftarIzin';

type Page = 'dashboard' | 'form' | 'izin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'form':
        return <FormIzin />;
      case 'izin':
        return <DaftarIzin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </div>
    </div>
  );
}

export default App;