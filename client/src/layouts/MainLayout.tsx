import React, { ReactNode } from 'react';
import './MainLayout.css';
import WebHeader from '../components/layout/WebHeader';
import WebFooter from '../components/layout/WebFooter';
import ScrollToTop from '../components/common/ScrollToTop';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <WebHeader />
      <main className="main-content">
        {children}
      </main>
      <WebFooter />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
